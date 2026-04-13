// POST /api/log-call
// Logs a Voiceflow/Vapi call outcome to Supabase and posts to Slack
// Called by n8n after every call/chat conversation ends

import { sendSlack } from './slack-notify.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const OUTCOME_EMOJI = {
  booked: '📅',
  qualified: '✅',
  lost: '❌',
  spam: '🚫',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Require API key from n8n/Voiceflow callers
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.LOG_CALL_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const {
    caller_phone,
    caller_name,
    business_name,
    service_needed,
    duration_seconds,
    outcome,
    booked,
    summary,
    transcript_url,
    booking_slot,
  } = req.body;

  if (!caller_phone || !outcome) {
    return res.status(400).json({ error: 'caller_phone and outcome are required' });
  }

  const validOutcomes = ['booked', 'qualified', 'lost', 'spam'];
  if (!validOutcomes.includes(outcome)) {
    return res.status(400).json({ error: 'outcome must be: booked, qualified, lost, or spam' });
  }

  const results = { supabase: false, slack: false };

  // Write to Supabase calls table
  if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/calls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          caller_phone,
          caller_name: caller_name || null,
          business_name: business_name || null,
          service_needed: service_needed || null,
          duration_seconds: duration_seconds || null,
          outcome,
          booked: booked === true,
          summary: summary || null,
          transcript_url: transcript_url || null,
          booking_slot: booking_slot || null,
        }),
      });
      results.supabase = response.ok;
    } catch (err) {
      console.error('[log-call] Supabase error:', err.message);
    }
  }

  // Post to Slack
  try {
    const emoji = OUTCOME_EMOJI[outcome] || '📞';
    const duration = duration_seconds
      ? `${Math.round(duration_seconds / 60)}m ${duration_seconds % 60}s`
      : 'unknown';

    const text = [
      `${emoji} *Call ${outcome.charAt(0).toUpperCase() + outcome.slice(1)}*`,
      caller_name ? `*Caller:* ${caller_name}` : null,
      business_name ? `*Business:* ${business_name}` : null,
      service_needed ? `*Service:* ${service_needed}` : null,
      `*Phone:* ${caller_phone}`,
      `*Duration:* ${duration}`,
      summary ? `*Summary:* ${summary}` : null,
      booking_slot ? `*Booked:* ${booking_slot}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    await sendSlack(text, 'daily-digest');
    results.slack = true;
  } catch (err) {
    console.error('[log-call] Slack error:', err.message);
  }

  return res.status(200).json({ success: true, ...results });
}
