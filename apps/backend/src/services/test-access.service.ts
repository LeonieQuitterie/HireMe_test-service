// services/test-access.service.ts
import { supabase } from '../config/supabase';

export class TestAccessService {
    static async verifyAccessCode(code: string, candidateEmail: string) {
        // 1. Check code tồn tại
        const { data: accessCode, error: codeError } = await supabase
            .from('test_access_codes')
            .select('id, schedule_id, used_at, candidate_id')
            .eq('code', code)
            .single();

        if (codeError || !accessCode) {
            return {
                success: false,
                status: 404,
                message: 'Invalid access code',
            };
        }

        // 2. Check code đã dùng chưa
        // if (accessCode.used_at) {
        //     return {
        //         success: false,
        //         status: 400,
        //         message: 'This code has already been used',
        //     };
        // }

        // 3. Check email có trong invites không
        const { data: invite, error: inviteError } = await supabase
            .from('test_invites')
            .select('id')
            .eq('schedule_id', accessCode.schedule_id)
            .eq('email', candidateEmail.toLowerCase().trim())
            .single();

        if (inviteError || !invite) {
            return {
                success: false,
                status: 403,
                message: 'You are not invited to this test',
            };
        }

        // 4. Lấy thông tin schedule + test
        const { data: schedule, error: scheduleError } = await supabase
            .from('test_schedules')
            .select(`
                id,
                start_time,
                tests!inner(
                    id,
                    title,
                    time_limit_minutes,
                    pass_score
                )
            `)
            .eq('id', accessCode.schedule_id)
            .single();

        if (scheduleError || !schedule) {
            return {
                success: false,
                status: 404,
                message: 'Test schedule not found',
            };
        }

        const test = Array.isArray(schedule.tests) ? schedule.tests[0] : schedule.tests;

        if (!test) {
            return {
                success: false,
                status: 404,
                message: 'Test not found',
            };
        }

        // 5. Check đã đến giờ chưa
        const now = new Date();
        const startTime = new Date(schedule.start_time);

        if (now < startTime) {
            return {
                success: false,
                status: 400,
                message: `Test will start at ${startTime.toLocaleString()}`,
            };
        }

        // 6. Lấy candidate_id
        const { data: candidate } = await supabase
            .from('users')
            .select('id')
            .eq('email', candidateEmail.toLowerCase().trim())
            .single();

        // 7. Update used_at và candidate_id
        await supabase
            .from('test_access_codes')
            .update({
                used_at: new Date().toISOString(),
                candidate_id: candidate?.id || null,
            })
            .eq('id', accessCode.id);

        // XÓA DÒNG NÀY: // @ts-ignore const test = schedule.tests;

        return {
            success: true,
            status: 200,
            message: 'Access granted',
            data: {
                test_id: test.id,
                test_name: test.title,
                time_limit_minutes: test.time_limit_minutes,
                pass_score: test.pass_score,
            },
        };
    }
}