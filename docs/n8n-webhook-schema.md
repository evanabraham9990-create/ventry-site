# n8n Webhook Schema — Voiceflow Chat Lead Capture

Last Updated: 2026-04-01
Version: 1.0

## Overview

When a visitor completes the lead capture flow in the Voiceflow chat widget, Voiceflow sends a POST request to your n8n webhook URL with the following payload.

## Setup

1. In n8n Cloud, create a new workflow with a **Webhook** trigger node
2. Copy the webhook URL (e.g., `https://your-instance.hooks.n8n.cloud/webhook/lead-capture`)
3. In Voiceflow, add an **API** step at the end of your lead capture flow
4. Set method to POST, paste the n8n webhook URL, and map the variables below to the JSON body

## Payload Schema

```json
{
  "source": "voiceflow-chat",
  "timestamp": "2026-04-01T14:30:00.000Z",
  "lead": {
    "name": "John Smith",
    "business": "Smith Roofing LLC",
    "phone": "+14105551234",
    "email": "john@smithroofing.com",
    "service_needed": "AI receptionist for after-hours calls"
  },
  "page_url": "https://ventryxai.com/ai-receptionist.html",
  "transcript_summary": "Visitor asked about AI receptionist pricing and after-hours call handling. Interested in a demo."
}
```

## Field Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `source` | string | Yes | Always `"voiceflow-chat"` — distinguishes from future Vapi call leads |
| `timestamp` | string | Yes | ISO-8601 timestamp of conversation end |
| `lead.name` | string | Yes | Visitor's full name |
| `lead.business` | string | Yes | Business name |
| `lead.phone` | string | Yes | Phone number (E.164 format preferred) |
| `lead.email` | string | Yes | Email address |
| `lead.service_needed` | string | Yes | What service the visitor is interested in |
| `page_url` | string | No | Which page the visitor was on when they chatted |
| `transcript_summary` | string | No | AI-generated summary of the conversation |

## Recommended n8n Workflow

```
Webhook Trigger
  -> Google Sheets: Append row to "Ventry Leads" sheet
  -> Gmail: Send alert email to evan@ventryxai.com
  -> (Future) Twilio: Send SMS alert to Evan's phone
  -> (Future) IF no booking within 30 min: send follow-up email to lead
```

## Testing

1. Use n8n's "Listen for test event" on the Webhook node
2. In Voiceflow, use the Test Agent to trigger the lead capture flow
3. Verify the webhook fires and n8n receives the correct payload
4. Check that Google Sheet row is appended and alert email is sent
