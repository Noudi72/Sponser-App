import { Resend } from 'resend';

async function main() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error('RESEND_API_KEY is not set. Set it before running this script.');
    process.exit(2);
  }
  const resend = new Resend(key);
  try {
    console.log('Sending test email via Resend...');
    const resp = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: process.env.TEST_TO || process.env.USER || 'n.guyaz@icloud.com',
      subject: 'Test-Mail von EHCB Sponser App',
      html: '<p>Dies ist eine Test-Mail, die mit dem RESEND_API_KEY gesendet wurde.</p>'
    });
    console.log('Resend response:', resp);
  } catch (e) {
    console.error('Error sending test email:', e);
    process.exit(1);
  }
}

main();
