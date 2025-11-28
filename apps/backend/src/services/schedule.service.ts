// src/services/testSchedule.service.ts
import { supabase } from '../config/supabase';

export interface CandidateInSchedule {
    candidate_id: string | null;
    full_name: string | null;
    email: string;
    invited_at: string | null;
    submitted_at: string | null;
}

export interface TestScheduleWithStats {
    schedule_id: string;
    test_id: string;
    test_title: string;
    start_time: string;
    end_time: string | null;
    total_invited: number;
    total_submitted: number;
    candidates: CandidateInSchedule[];
}

export class TestScheduleService {
    static async getSchedulesByHrId(hrId: string): Promise<TestScheduleWithStats[]> {
        // 1. Lấy jobs của HR
        const { data: jobs } = await supabase
            .from('jobs')
            .select('id')
            .eq('hr_id', hrId);

        if (!jobs?.length) return [];

        const jobIds = jobs.map(j => j.id);

        // 2. Lấy tests
        const { data: tests } = await supabase
            .from('tests')
            .select('id, title')
            .in('job_id', jobIds);

        if (!tests?.length) return [];

        const testIds = tests.map(t => t.id);

        // 3. Lấy schedules
        const { data: schedules } = await supabase
            .from('test_schedules')
            .select('id, test_id, start_time, end_time')
            .in('test_id', testIds)
            .order('start_time', { ascending: false });

        if (!schedules?.length) return [];

        const scheduleIds = schedules.map(s => s.id);

        // 4. Lấy dữ liệu liên quan (song song)
        const [
            { data: invites },
            { data: accessCodes },
            { data: submissions },
            { data: users }
        ] = await Promise.all([
            supabase.from('test_invites').select('id, schedule_id, email, invited_at').in('schedule_id', scheduleIds),
            supabase.from('test_access_codes').select('id, schedule_id, candidate_id').in('schedule_id', scheduleIds),
            // Lấy tất cả submissions có test_id trong danh sách testIds
            supabase.from('test_submissions').select('id, test_id, candidate_id, access_code_id, submitted_at').in('test_id', testIds),
            supabase.from('users').select('id, full_name, email').in('role', ['Candidate'])
        ]);

        // Map nhanh: candidate_id → info
        const candidateMap = new Map<string, { full_name: string | null; email: string }>();
        users?.forEach(u => {
            candidateMap.set(u.id, { full_name: u.full_name, email: u.email });
        });

        // Map access_code_id → access_code record
        const accessCodeMap = new Map<string, any>();
        accessCodes?.forEach(ac => {
            if (ac.id) accessCodeMap.set(ac.id, ac);
        });

        // Map test_id → số người đã nộp bài (đếm theo test_id)
        const submittedCountByTestId = new Map<string, number>();
        submissions?.forEach(sub => {
            if (sub.test_id) {
                submittedCountByTestId.set(sub.test_id, (submittedCountByTestId.get(sub.test_id) || 0) + 1);
            }
        });

        // Ghép dữ liệu cuối cùng
        return schedules.map(schedule => {
            const test = tests.find(t => t.id === schedule.test_id)!;
            const scheduleInvites = (invites || []).filter(i => i.schedule_id === schedule.id);

            const candidatesList: CandidateInSchedule[] = scheduleInvites.map(invite => {
                // Tìm access_code phù hợp với email này trong schedule hiện tại
                const relatedAccessCode = (accessCodes || []).find(ac =>
                    ac.schedule_id === schedule.id &&
                    candidateMap.get(ac.candidate_id || '')?.email === invite.email
                );

                const candidateId = relatedAccessCode?.candidate_id || null;
                const userInfo = candidateId ? candidateMap.get(candidateId) : null;

                // Kiểm tra xem người này đã nộp bài chưa (dựa trên test_id và candidate_id)
                const submissionRecord = (submissions || []).find(sub =>
                    sub.test_id === schedule.test_id && sub.candidate_id === candidateId
                );

                const hasSubmitted = !!submissionRecord;

                return {
                    candidate_id: candidateId,
                    full_name: userInfo?.full_name || null,
                    email: invite.email,
                    invited_at: invite.invited_at,
                    submitted_at: hasSubmitted ? submissionRecord?.submitted_at || null : null,
                };
            });

            return {
                schedule_id: schedule.id,
                test_id: schedule.test_id,
                test_title: test.title,
                start_time: schedule.start_time,
                end_time: schedule.end_time,
                total_invited: scheduleInvites.length,
                total_submitted: submittedCountByTestId.get(schedule.test_id) || 0, // Đếm theo test_id
                candidates: candidatesList,
            };
        });
    }

    /**
     * Thêm người dùng mới vào schedule hiện có
     * Tất cả ứng viên trong cùng schedule dùng chung một access_code
     */
    static async addInvitesToSchedule(
        scheduleId: string,
        emails: string[],
        hrId: string
    ): Promise<{ success: boolean; message: string; invited_count?: number }> {
        // 1. Kiểm tra schedule có tồn tại không
        const { data: schedule, error: scheduleError } = await supabase
            .from('test_schedules')
            .select('id, test_id')
            .eq('id', scheduleId)
            .single();

        if (scheduleError || !schedule) {
            throw new Error('Schedule not found');
        }

        // 2. Kiểm tra quyền sở hữu: HR phải sở hữu test này
        const { data: test, error: testError } = await supabase
            .from('tests')
            .select('id, job_id')
            .eq('id', schedule.test_id)
            .single();

        if (testError || !test) {
            throw new Error('Test not found');
        }

        const { data: job, error: jobError } = await supabase
            .from('jobs')
            .select('id, hr_id')
            .eq('id', test.job_id)
            .single();

        if (jobError || !job) {
            throw new Error('Job not found');
        }

        if (job.hr_id !== hrId) {
            throw new Error('Unauthorized: You do not own this schedule');
        }

        // 3. Validate emails
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validEmails = emails
            .map(e => e.toLowerCase().trim())
            .filter(e => emailRegex.test(e));

        if (validEmails.length === 0) {
            throw new Error('No valid emails provided');
        }

        // 4. Lấy danh sách emails đã được mời trong schedule này
        const { data: existingInvites } = await supabase
            .from('test_invites')
            .select('email')
            .eq('schedule_id', scheduleId);

        const existingEmails = new Set(
            (existingInvites || []).map(inv => inv.email.toLowerCase())
        );

        // 5. Lọc ra emails chưa được mời
        const newEmails = validEmails.filter(email => !existingEmails.has(email));

        if (newEmails.length === 0) {
            return {
                success: false,
                message: 'All emails have already been invited to this schedule',
            };
        }

        // 6. Thêm invites mới
        const invitesToInsert = newEmails.map(email => ({
            schedule_id: scheduleId,
            email: email,
        }));

        const { error: invitesError } = await supabase
            .from('test_invites')
            .insert(invitesToInsert);

        if (invitesError) {
            throw new Error(`Failed to add invites: ${invitesError.message}`);
        }

        return {
            success: true,
            message: `Successfully invited ${newEmails.length} new candidate(s)`,
            invited_count: newEmails.length,
        };
    }

    /**
     * Xóa lịch test theo schedule_id
     * Chỉ HR sở hữu test mới có quyền xóa
     */
    static async deleteSchedule(scheduleId: string, hrId: string): Promise<boolean> {
        // 1. Kiểm tra schedule có tồn tại không
        const { data: schedule, error: scheduleError } = await supabase
            .from('test_schedules')
            .select('id, test_id')
            .eq('id', scheduleId)
            .single();

        if (scheduleError || !schedule) {
            throw new Error('Schedule not found');
        }

        // 2. Kiểm tra quyền sở hữu: HR phải sở hữu test này
        const { data: test, error: testError } = await supabase
            .from('tests')
            .select('id, job_id')
            .eq('id', schedule.test_id)
            .single();

        if (testError || !test) {
            throw new Error('Test not found');
        }

        const { data: job, error: jobError } = await supabase
            .from('jobs')
            .select('id, hr_id')
            .eq('id', test.job_id)
            .single();

        if (jobError || !job) {
            throw new Error('Job not found');
        }

        if (job.hr_id !== hrId) {
            throw new Error('Unauthorized: You do not own this schedule');
        }

        // 3. Xóa các bản ghi liên quan (theo thứ tự để tránh lỗi foreign key)
        
        // 3.1. Xóa test_invites
        await supabase
            .from('test_invites')
            .delete()
            .eq('schedule_id', scheduleId);

        // 3.2. Lấy danh sách access_code_id của schedule này
        const { data: accessCodes } = await supabase
            .from('test_access_codes')
            .select('id')
            .eq('schedule_id', scheduleId);

        if (accessCodes && accessCodes.length > 0) {
            const accessCodeIds = accessCodes.map(ac => ac.id);

            // 3.3. Xóa test_submissions liên quan đến các access codes này
            await supabase
                .from('test_submissions')
                .delete()
                .in('access_code_id', accessCodeIds);

            // 3.4. Xóa test_access_codes
            await supabase
                .from('test_access_codes')
                .delete()
                .eq('schedule_id', scheduleId);
        }

        // 4. Cuối cùng, xóa schedule
        const { error: deleteError } = await supabase
            .from('test_schedules')
            .delete()
            .eq('id', scheduleId);

        if (deleteError) {
            throw new Error(`Failed to delete schedule: ${deleteError.message}`);
        }

        return true;
    }
}