// services/test-schedule.service.ts
import { supabase } from '../config/supabase';
import { ScheduleTestInput, ScheduleTestResult } from '../types/schedule.types';

export class TestScheduleService {
    private static generateAccessCode(): string {
        const digits = '123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += digits.charAt(Math.floor(Math.random() * digits.length));
        }
        return code;
    }

    static async scheduleTest(
        testId: string,
        input: ScheduleTestInput,
        hr_id: string
    ): Promise<ScheduleTestResult> {
        const { start_time, emails } = input;

        // 1. Kiểm tra test tồn tại + thuộc HR này không
        const { data: test, error: testError } = await supabase
            .from('tests')
            .select('id, job_id, status, jobs!inner(hr_id)')
            .eq('id', testId)
            .eq('jobs.hr_id', hr_id)
            .single();

        if (testError || !test) {
            return {
                success: false,
                status: testError?.code === 'PGRST116' ? 404 : 403,
                message: 'Test not found or you do not have permission',
            };
        }

        // 2. Validate thời gian
        if (new Date(start_time) <= new Date()) {
            return {
                success: false,
                status: 400,
                message: 'Start time must be in the future',
            };
        }

        // 3. Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const invalidEmails = emails.filter(e => !emailRegex.test(e));
        if (invalidEmails.length > 0) {
            return {
                success: false,
                status: 400,
                message: `Invalid emails: ${invalidEmails.join(', ')}`,
            };
        }

        if (emails.length === 0) {
            return {
                success: false,
                status: 400,
                message: 'At least one email is required',
            };
        }

        // 4. Tạo schedule
        const { data: schedule, error: scheduleError } = await supabase
            .from('test_schedules')
            .insert({ test_id: testId, start_time })
            .select()
            .single();

        if (scheduleError) {
            return {
                success: false,
                status: scheduleError.code === '23505' ? 409 : 400,
                message: scheduleError.code === '23505'
                    ? 'This test already has a schedule at this time'
                    : scheduleError.message,
            };
        }
        // 5. Tạo invites
        const invitesToInsert = emails.map(email => ({
            schedule_id: schedule.id,
            email: email.toLowerCase().trim(),
        }));

        const { error: invitesError } = await supabase
            .from('test_invites')
            .insert(invitesToInsert);

        if (invitesError) {
            console.error('Invites error:', invitesError); // Log để debug
            await supabase.from('test_schedules').delete().eq('id', schedule.id);

            // Handle duplicate email
            if (invitesError.code === '23505') {
                return {
                    success: false,
                    status: 409,
                    message: 'One or more emails already invited to this schedule',
                };
            }

            return {
                success: false,
                status: 400,
                message: invitesError.message || invitesError.details || 'Failed to create invites',
            };
        }

        // 6. Tạo access code (1 mã cho schedule này)
        let codeInserted = false;
        let retries = 3;

        while (!codeInserted && retries > 0) {
            const accessCode = this.generateAccessCode();

            const { error: codeError } = await supabase
                .from('test_access_codes')
                .insert({
                    schedule_id: schedule.id,
                    code: accessCode,
                    candidate_id: null,
                    used_at: null,
                });

            if (!codeError) {
                codeInserted = true;
            } else if (codeError.code !== '23505') {
                // Lỗi khác ngoài duplicate, rollback
                await supabase.from('test_invites').delete().eq('schedule_id', schedule.id);
                await supabase.from('test_schedules').delete().eq('id', schedule.id);
                return {
                    success: false,
                    status: 400,
                    message: `Failed to create access code: ${codeError.message}`,
                };
            }

            retries--;
        }

        if (!codeInserted) {
            // Hết retry, rollback
            await supabase.from('test_invites').delete().eq('schedule_id', schedule.id);
            await supabase.from('test_schedules').delete().eq('id', schedule.id);
            return {
                success: false,
                status: 500,
                message: 'Failed to generate unique access code',
            };
        }

        // 7. Update test status
        await supabase.from('tests').update({ status: 'scheduled' }).eq('id', testId);

        return {
            success: true,
            message: 'Test scheduled and invitations sent successfully',
            data: {
                schedule_id: schedule.id,
                invited_count: emails.length,
            },
        };
    }
}