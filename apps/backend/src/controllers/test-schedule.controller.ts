// controllers/test-schedule.controller.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { TestScheduleService } from '../services/test-schedule.service';
import { renderTestInvitationEmail } from '../emails/TestInvitationEmail';
import { sendEmail } from '../utils/email';

export class TestScheduleController {
  static async createSchedule(req: AuthRequest, res: Response) {
    try {
      const { testId } = req.params;
      const hr_id = req.user?.id;

      if (!hr_id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const { start_time, emails } = req.body;

      console.log('🔍 Schedule Request:');
      console.log('Test ID:', testId);
      console.log('HR ID:', hr_id);
      console.log('Start Time:', start_time);
      console.log('Emails:', emails);

      if (!start_time || !emails || !Array.isArray(emails)) {
        return res.status(400).json({
          success: false,
          message: 'start_time and emails array are required',
        });
      }

      // 1. Tạo schedule trước (service thuần túy, không gửi email)
      const result = await TestScheduleService.scheduleTest(testId, { start_time, emails }, hr_id);

      console.log('📊 Schedule Result:', {
        success: result.success,
        status: result.status,
        message: result.message,
        data: result.data
      });

      // 2. Nếu thất bại, return luôn
      if (!result.success) {
        return res.status(result.status || 400).json(result);
      }

      // 3. Nếu thành công, GỬI EMAIL (không chờ, chạy background)
      console.log('✅ Schedule created successfully, checking email conditions...');
      console.log('Has access_code?', !!result.data?.access_code);
      console.log('Access code:', result.data?.access_code);

      if (result.success && result.data?.access_code) {
        console.log('✅ Starting email sending process...');

        const VERIFIED_EMAILS = process.env.VERIFIED_EMAILS
          ? process.env.VERIFIED_EMAILS.split(',').map(e => e.trim().toLowerCase())
          : ['leduongyenquynh@gmail.com'];

        console.log('🔍 Email Config:');
        console.log('VERIFIED_EMAILS from env:', process.env.VERIFIED_EMAILS);
        console.log('VERIFIED_EMAILS parsed:', VERIFIED_EMAILS);
        console.log('Request emails:', emails);
        console.log('Filtered emails:', emails.filter(e => VERIFIED_EMAILS.includes(e.toLowerCase())));

        // Lấy thông tin test và job để gửi email
        const { data: testInfo, error: testInfoError } = await require('../config/supabase').supabase
          .from('tests')
          .select(`
            id,
            title,
            jobs!inner(
              id,
              title 
            )
          `)
          .eq('id', testId)
          .single();

        console.log('📊 Test Info Query:');
        console.log('Test Info:', testInfo);
        console.log('Test Info Error:', testInfoError);

        if (testInfo) {
          console.log('✅ Test info loaded successfully');
          
          const job = Array.isArray(testInfo.jobs) ? testInfo.jobs[0] : testInfo.jobs;
          const accessCode = result.data.access_code;

          console.log('📧 Email Details:');
          console.log('Test Title:', testInfo.title);
          console.log('Job Title:', job.title);
          console.log('Access Code:', accessCode);

          const emailPromises = emails
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
                  testTitle: testInfo.title,
                  jobName: job.title,
                  startTime: start_time,
                  accessCode: accessCode,
                  testLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}`,
                });

                console.log(`📧 Email HTML rendered for ${email}, length: ${emailHtml.length} chars`);
                console.log(`📧 Calling sendEmail for ${email}...`);

                await sendEmail({
                  to: email,
                  subject: `Test Invitation: ${testInfo.title} - ${job.title}`,
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
            console.log(`Invited emails: ${emails.join(', ')}`);
            console.log(`Verified list: ${VERIFIED_EMAILS.join(', ')}`);
          }
        } else {
          console.error('❌ Failed to load test info');
        }
      } else {
        console.log('⚠️ Email sending skipped - conditions not met');
        console.log('Success:', result.success);
        console.log('Has access_code:', !!result.data?.access_code);
      }

      // 4. Return response ngay lập tức
      return res.status(201).json(result);

    } catch (error) {
      console.error('💥 Schedule test controller error:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}