// apps/backend/src/utils/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const { to, subject, html } = options;

  try {
    console.log(`📧 Attempting to send email to: ${to}`);
    console.log(`📧 Subject: ${subject}`);

    const { data, error } = await resend.emails.send({
      from: 'HireMeAI <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error('❌ Resend error:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', data?.id);
    console.log('📧 To:', to);
    console.log('---');
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
}