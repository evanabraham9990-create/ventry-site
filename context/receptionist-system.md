# Ventry AI — Receptionist System

## How It Works (High Level)

1. Business owner forwards their phone number to the Ventry AI number
2. Incoming calls are answered by the AI within 2 rings
3. AI greets the caller using the business name and handles the conversation
4. Lead info is captured and appointment is booked (if applicable)
5. Call summary is sent to the owner immediately after
6. n8n handles follow-up automation

---

## Current Implementation

**Chat Widget (Live):**
- Voiceflow project ID: `69ce82c2b4c5bf250dcb32e2`
- Deployed on all pages via `chat-widget.js`
- Handles website visitors — not phone calls
- Lead capture → n8n webhook → Google Sheets + email

**Phone Receptionist (Phase 3 — Not Started):**
- Tool: Vapi (AI voice) + Twilio (phone number)
- Status: Not configured. Do not build until Phase 2 chat flow is proven.

---

## Call Flow (Target — for Voiceflow and future Vapi)

```
Incoming call/chat
  → Greeting: "Thanks for calling [Business Name], how can I help you?"
  → Identify need: "Are you looking for [service type] or something else?"
  → Qualify: urgency, location, job type
  → If caller asks pricing ("how much does it cost?"):
       → Collect job details: type, size/scope, location
       → Match to owner-defined estimate table
       → Send text: "Based on what you described, [job type] typically runs $X–$Y.
          We'll confirm exact pricing when we meet."
       → Log: estimate_sent = true
       → If job is complex/multi-service: flag for owner manual quote, continue to booking
  → Booking attempt: "Let me get you on the calendar..."
  → If booking fails: capture name + phone/email for callback
  → Call summary sent to owner
  → n8n triggers follow-up if not booked
```

---

## Escalation Rules

The AI escalates to human callback when:
- Caller explicitly asks to speak to a person
- Caller reports an active emergency (pipe burst, electrical fire, roof collapse)
- Caller is angry or confused after 2 AI responses
- Caller asks a question the AI is not scripted to handle

**Escalation response:** "Let me have someone from our team call you back within [X minutes/hours]. What's the best number to reach you?"

---

## What the AI Does NOT Do

- No custom pricing quotes — only sends owner-configured estimate ranges (templated). Complex jobs always route to owner
- No same-day schedule changes — "I'll have the team reach out to confirm"
- No claims about warranties or guarantees
- No competitor comparisons
- No refunds or dispute handling

---

## What Happens After Every Call/Chat

1. Lead info logged (name, phone, email, business, service needed, outcome, estimate_sent)
2. Call summary sent to `evan@ventryxai.com` via email
3. Slack notification posted to #hot-leads (if qualified)
4. n8n triggers:
   - If booked: confirmation email/SMS to caller
   - If qualified but not booked: follow-up queue (24-hour delay)
   - If lost/spam: logged, no action

---

## Configuration Per Client

Each client's Voiceflow build includes:
- Business name and custom greeting
- Services offered (exact list)
- Business hours + after-hours behavior
- Calendar integration (Cal.com or Google Calendar)
- Qualification questions specific to their industry
- FAQ answers for their most common questions
- Escalation contact (owner's cell or text number)

---

## Backend Architecture

Lead data flows through:
```
Voiceflow/Vapi → n8n webhook → Supabase (calls table) + Google Sheets
                              → Slack notification
                              → Email summary to owner
                              → Follow-up queue if not booked
```

API endpoints:
- `POST /api/lead-capture` — website form leads
- `POST /api/log-call` — call outcomes from Voiceflow/Vapi
