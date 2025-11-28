// src/controllers/testSchedule.controller.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { TestScheduleService } from '../services/schedule.service';
import { sendEmail } from '../utils/email';
import { renderTestInvitationEmail } from '../emails/TestInvitationEmail';

export interface AddInvitesResult {
    success: boolean;
    message: string;
    invited_count?: number;
    schedule_info?: {
        schedule_id: string;
        test_id: string;
        test_title: string;
        job_title: string;
        start_time: string;
        access_code: string;
    };
    new_emails?: string[];
}

export class TestScheduleController {
    static async getMyTestSchedules(req: AuthRequest, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            const hrId = req.user.id;

            const schedules = await TestScheduleService.getSchedulesByHrId(hrId);

            return res.status(200).json({
                success: true,
                data: schedules,
            });
        } catch (error: any) {
            console.error('Error in getMyTestSchedules:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message,
            });
        }
    }

    
    static async addInvitesToSchedule(req: AuthRequest, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            const hrId = req.user.id;
            const { scheduleId } = req.params;
            const { emails } = req.body;

            console.log('🔍 Add Invites Request:');
            console.log('Schedule ID:', scheduleId);
            console.log('HR ID:', hrId);
            console.log('Emails:', emails);

            // Validate input
            if (!scheduleId) {
                return res.status(400).json({
                    success: false,
                    message: 'Schedule ID is required',
                });
            }

            if (!emails || !Array.isArray(emails) || emails.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Emails array is required and must not be empty',
                });
            }

            // 1. Gọi service để thêm invites - Khai báo type rõ ràng
            const result: AddInvitesResult = await TestScheduleService.addInvitesToSchedule(
                scheduleId,
                emails,
                hrId
            );

            console.log('📊 Add Invites Result:', {
                success: result.success,
                message: result.message,
                invited_count: result.invited_count,
                has_schedule_info: !!result.schedule_info
            });

            // 2. Nếu thất bại, return luôn
            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: result.message,
                });
            }

            // 3. Nếu thành công, GỬI EMAIL (không chờ, chạy background)
            console.log('✅ Invites added successfully, checking email conditions...');
            console.log('Has schedule_info?', !!result.schedule_info);
            console.log('Has new_emails?', !!result.new_emails);
            console.log('New emails count:', result.new_emails?.length);

            if (result.success && result.schedule_info && result.new_emails && result.new_emails.length > 0) {
                console.log('✅ Starting email sending process...');

                const VERIFIED_EMAILS = process.env.VERIFIED_EMAILS
                    ? process.env.VERIFIED_EMAILS.split(',').map(e => e.trim().toLowerCase())
                    : ['leduongyenquynh@gmail.com'];

                console.log('🔍 Email Config:');
                console.log('VERIFIED_EMAILS from env:', process.env.VERIFIED_EMAILS);
                console.log('VERIFIED_EMAILS parsed:', VERIFIED_EMAILS);
                console.log('New emails:', result.new_emails);
                console.log('Filtered emails:', result.new_emails.filter(e => VERIFIED_EMAILS.includes(e.toLowerCase())));

                const { schedule_info, new_emails } = result;

                console.log('📧 Email Details:');
                console.log('Test Title:', schedule_info.test_title);
                console.log('Job Title:', schedule_info.job_title);
                console.log('Access Code:', schedule_info.access_code);
                console.log('Start Time:', schedule_info.start_time);

                const emailPromises = new_emails
                    .filter(email => {
                        const shouldSend = VERIFIED_EMAILS.includes(email.toLowerCase());
                        console.log(`📧 Email ${email}: shouldSend = ${shouldSend}`);
                        return shouldSend;
                    })
                    .map(async (email) => {
                        try {
                            console.log(`📧 Rendering email for ${email}...`);
                            const emailHtml = await renderTestInvitationEmail({
                                candidateName: email.split('@')[0],
                                testTitle: schedule_info.test_title,
                                jobName: schedule_info.job_title,
                                startTime: schedule_info.start_time,
                                accessCode: schedule_info.access_code,
                                testLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}`,
                            });

                            console.log(`📧 Email HTML rendered for ${email}, length: ${emailHtml.length} chars`);
                            console.log(`📧 Calling sendEmail for ${email}...`);

                            await sendEmail({
                                to: email,
                                subject: `Test Invitation: ${schedule_info.test_title} - ${schedule_info.job_title}`,
                                html: emailHtml,
                            });

                            console.log(`✅ Email sent to ${email}`);
                        } catch (err) {
                            console.error(`❌ Failed to send email to ${email}:`, err);
                            console.error('Error details:', JSON.stringify(err, null, 2));
                        }
                    });

                console.log(`📧 Total email promises: ${emailPromises.length}`);

                // Gửi email trong background (không block response)
                if (emailPromises.length > 0) {
                    Promise.all(emailPromises)
                        .then(() => console.log(`📧 All ${emailPromises.length} email(s) sent successfully`))
                        .catch(err => {
                            console.error('❌ Error in email sending:', err);
                            console.error('Error stack:', err.stack);
                        });
                } else {
                    console.log(`⚠️ No verified emails in list`);
                    console.log(`New invited emails: ${new_emails.join(', ')}`);
                    console.log(`Verified list: ${VERIFIED_EMAILS.join(', ')}`);
                }
            } else {
                console.log('⚠️ Email sending skipped - conditions not met');
                console.log('Success:', result.success);
                console.log('Has schedule_info:', !!result.schedule_info);
                console.log('Has new_emails:', !!result.new_emails);
            }

            // 4. Return response ngay lập tức
            return res.status(200).json({
                success: true,
                message: result.message,
                invited_count: result.invited_count,
            });

        } catch (error: any) {
            console.error('💥 Add invites controller error:', error);
            console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');

            // Xử lý các lỗi cụ thể
            if (error.message === 'Schedule not found') {
                return res.status(404).json({
                    success: false,
                    message: 'Schedule not found',
                });
            }

            if (error.message.includes('Unauthorized')) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to add invites to this schedule',
                });
            }

            if (error.message.includes('No valid emails')) {
                return res.status(400).json({
                    success: false,
                    message: 'No valid emails provided',
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message,
            });
        }
    }

    static async deleteSchedule(req: AuthRequest, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            const hrId = req.user.id;
            const { scheduleId } = req.params;

            if (!scheduleId) {
                return res.status(400).json({
                    success: false,
                    message: 'Schedule ID is required',
                });
            }

            await TestScheduleService.deleteSchedule(scheduleId, hrId);

            return res.status(200).json({
                success: true,
                message: 'Schedule deleted successfully',
            });
        } catch (error: any) {
            console.error('Error in deleteSchedule:', error);

            // Xử lý các lỗi cụ thể
            if (error.message === 'Schedule not found') {
                return res.status(404).json({
                    success: false,
                    message: 'Schedule not found',
                });
            }

            if (error.message.includes('Unauthorized')) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to delete this schedule',
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message,
            });
        }
    }
}