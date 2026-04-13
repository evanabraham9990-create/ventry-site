// Shared Slack webhook helper for Vercel serverless functions

const CHANNELS = {
  'lead-gen': process.env.SLACK_WEBHOOK_URL,
  'hot-leads': process.env.SLACK_WEBHOOK_HOT_LEADS,
  'daily-digest': process.env.SLACK_WEBHOOK_DAILY_DIGEST,
  'errors': process.env.SLACK_WEBHOOK_ERRORS,
};

export async function sendSlack(text, channel = 'lead-gen') {
  const url = CHANNELS[channel] || CHANNELS['lead-gen'];
  if (!url) {
    console.log(`[slack] No webhook for #${channel}`);
    return false;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      console.log(`[slack] Sent to #${channel}`);
      return true;
    }
    console.log(`[slack] #${channel} status: ${res.status}`);
    return false;
  } catch (err) {
    console.log(`[slack] #${channel} error: ${err.message}`);
    return false;
  }
}

export function progressBar(pct, width = 10) {
  const filled = Math.round(pct / 100 * width);
  const empty = width - filled;
  return '[' + '#'.repeat(filled) + '-'.repeat(empty) + ']';
}
