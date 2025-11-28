// apps/backend/src/emails/TestInvitationEmail.ts
import { render } from '@react-email/render';
import * as React from 'react';

interface TestInvitationEmailProps {
  candidateName: string;
  testTitle: string;
  jobName: string;
  startTime: string;
  accessCode: string;
  testLink: string;
}

export async function renderTestInvitationEmail(props: TestInvitationEmailProps): Promise<string> {
  const {
    candidateName = "Candidate",
    testTitle = "Technical Assessment",
    jobName = "Senior Frontend Engineer",
    startTime,
    accessCode,
    testLink = "http://localhost:3000/",
  } = props;

  const formattedDate = new Date(startTime).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const styles = {
    main: { backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif', padding: '20px' },
    container: { margin: '0 auto', padding: '20px 0 48px', maxWidth: '560px', backgroundColor: '#ffffff', borderRadius: '8px' },
    heading: { fontSize: '24px', color: '#1a1a1a', textAlign: 'center' as const, margin: '30px 0' },
    paragraph: { fontSize: '16px', lineHeight: '26px', color: '#525f7f', margin: '16px 0' },
    section: { backgroundColor: '#f8fafc', padding: '24px', borderRadius: '8px', margin: '24px 0', border: '1px solid #e2e8f0' },
    sectionHeading: { fontSize: '18px', color: '#1a1a1a', marginBottom: '16px', fontWeight: 'bold' as const },
    info: { fontSize: '16px', margin: '8px 0', color: '#2d3748' },
    codeBox: {
      backgroundColor: '#f0fff4',
      border: '2px dashed #10b981',
      borderRadius: '12px',
      padding: '16px',
      textAlign: 'center' as const,
      fontSize: '32px',
      fontWeight: 'bold' as const,
      color: '#10b981',
      letterSpacing: '4px',
      margin: '16px 0',
    },
    buttonContainer: { textAlign: 'center' as const, margin: '32px 0' },
    button: {
      backgroundColor: '#6366f1',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '16px',
      fontWeight: 'bold' as const,
      textDecoration: 'none',
      textAlign: 'center' as const,
      display: 'inline-block',
      padding: '14px 32px',
    },
    hr: { border: 'none', borderTop: '1px solid #e6ebf1', margin: '32px 0' },
    footer: { color: '#8898aa', fontSize: '12px', lineHeight: '20px', marginTop: '16px', textAlign: 'center' as const },
  };

  return await render(
    React.createElement('html', { lang: 'en' },
      React.createElement('head', null,
        React.createElement('meta', { charSet: 'utf-8' }),
        React.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }),
        React.createElement('title', null, 'Test Invitation')
      ),
      React.createElement('body', { style: styles.main },
        React.createElement('div', { style: styles.container },
          
          React.createElement('h1', { style: styles.heading }, 
            "You're Invited to Take a Test!"
          ),

          React.createElement('p', { style: styles.paragraph },
            `Hi ${candidateName},`
          ),

          React.createElement('p', { style: styles.paragraph },
            `You've been invited to complete a technical assessment for the position of `,
            React.createElement('strong', null, jobName),
            '.'
          ),

          React.createElement('div', { style: styles.section },
            React.createElement('h2', { style: styles.sectionHeading }, 
              'Test Details'
            ),
            React.createElement('p', { style: styles.info },
              React.createElement('strong', null, 'Test: '),
              testTitle
            ),
            React.createElement('p', { style: styles.info },
              React.createElement('strong', null, 'Date & Time: '),
              formattedDate
            ),
            React.createElement('p', { style: styles.info },
              React.createElement('strong', null, 'Access Code:')
            ),
            React.createElement('div', { style: styles.codeBox },
              accessCode
            )
          ),

          React.createElement('div', { style: styles.buttonContainer },
            React.createElement('a', { 
              href: testLink, 
              style: styles.button 
            },
              'Start Test Now'
            )
          ),

          React.createElement('hr', { style: styles.hr }),

          React.createElement('p', { style: styles.footer },
            'This is an automated message. The test will be available at the scheduled time using the access code above.'
          )
        )
      )
    )
  );
}