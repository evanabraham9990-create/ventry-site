import { sendSlack } from './slack-notify.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, company, phone } = req.body;

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: 'First name, last name, and email are required.' });
  }

  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

  // 1. Slack notification
  const slackMsg = [
    `:rotating_light: *New Lead from Website*`,
    `*Name:* ${firstName} ${lastName}`,
    `*Email:* ${email}`,
    company ? `*Company:* ${company}` : null,
    phone ? `*Phone:* ${phone}` : null,
    `*Submitted:* ${timestamp}`,
  ].filter(Boolean).join('\n');

  const slackSent = await sendSlack(slackMsg, 'hot-leads');

  // 2. Email notification via Resend (if configured)
  let emailSent = false;
  if (process.env.RESEND_API_KEY) {
    try {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Ventry AI <notifications@ventryxai.com>',
          to: process.env.LEAD_NOTIFY_EMAIL || 'evan@ventryxai.com',
          subject: `New Lead: ${firstName} ${lastName}${company ? ` — ${company}` : ''}`,
          html: `
            <h2>New Website Lead</h2>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <p><strong>Submitted:</strong> ${timestamp}</p>
          `,
        }),
      });
      emailSent = emailRes.ok;
    } catch (err) {
      console.log(`[email] Error: ${err.message}`);
    }
  }

  return res.status(200).json({
    success: true,
    slack: slackSent,
    email: emailSent,
  });
}
