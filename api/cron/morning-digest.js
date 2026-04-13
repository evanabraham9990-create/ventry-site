// Morning Digest — runs daily at ~8am ET via Vercel Cron
// Posts lead batch progress + call stats to #daily-digest

import { sendSlack } from '../slack-notify.js';

async function getCallStats() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const res = await fetch(
    `${url}/rest/v1/calls?created_at=gte.${since}&select=booked,outcome`,
    {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/New_York',
  });

  const counts = JSON.parse(process.env.LEAD_COUNTS || '{}');
  const currentNiche = process.env.CURRENT_NICHE || 'Unknown';

  let lines = [`*Good morning — ${today}*`, ''];

  // Call stats (last 24h)
  try {
    const calls = await getCallStats();
    if (calls && calls.length > 0) {
      const total = calls.length;
      const booked = calls.filter(c => c.booked === true).length;
      const rate = Math.round((booked / total) * 100);
      lines.push('*Calls (last 24h)*');
      lines.push(`Answered: ${total}  |  Booked: ${booked}  |  Rate: ${rate}%`);
      lines.push('');
    } else if (calls !== null) {
      lines.push('*Calls (last 24h):* None yet');
      lines.push('');
    }
  } catch (_) {
    // Supabase unavailable — skip call stats silently
  }

  // Lead batch progress
  if (Object.keys(counts).length > 0) {
    lines.push('*Lead Pipeline*');
    let total = 0;
    for (const [niche, count] of Object.entries(counts)) {
      const pct = Math.round(count / 1000 * 100);
      const filled = Math.round(pct / 10);
      const bar = '[' + '#'.repeat(filled) + '-'.repeat(10 - filled) + ']';
      const marker = niche === currentNiche ? ' <-- active' : '';
      lines.push(`${niche.padEnd(15)} ${bar} ${String(count).padStart(5)}/1000${marker}`);
      total += count;
    }
    lines.push('');
    lines.push(`*Total: ${total}/9000* (${Math.round(total / 9000 * 100)}%)`);
    lines.push('');
    lines.push(`*Today\'s batch:* ${currentNiche}`);
  } else {
    lines.push('No lead counts synced yet. Run a batch in Claude Code to update.');
  }

  lines.push('');
  lines.push('_Vercel Cron — runs daily at 8am ET_');

  await sendSlack(lines.join('\n'), 'daily-digest');

  return res.status(200).json({ ok: true, message: 'Morning digest sent' });
}
