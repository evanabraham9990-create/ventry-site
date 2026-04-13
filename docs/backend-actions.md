# Ventry AI — Backend Action Reference

This is the standardized API contract for every action the system can take.
All actions go through these endpoints. Do not build workarounds or direct DB calls from the frontend.

---

## Actions

### create_lead
**Endpoint:** `POST /api/lead-capture`
**Trigger:** Website form submission or Voiceflow lead capture
**Payload:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "company": "string",
  "phone": "string"
}
```
**Effects:** → Slack #hot-leads → email to evan@ventryxai.com (via Resend if configured)

---

### log_call_summary
**Endpoint:** `POST /api/log-call`
**Trigger:** Voiceflow conversation end / Vapi call end (Phase 3)
**Payload:**
```json
{
  "caller_phone": "string",
  "caller_name": "string",
  "business_name": "string",
  "service_needed": "string",
  "duration_seconds": "number",
  "outcome": "booked | qualified | lost | spam",
  "booked": "boolean",
  "summary": "string",
  "transcript_url": "string | null",
  "booking_slot": "string | null"
}
```
**Effects:** → Supabase `calls` table → Slack #calls → if lost: trigger follow-up webhook

---

### sync_batch_progress
**Endpoint:** `POST /api/update-counts`
**Auth:** `X-API-Key` header = `SYNC_API_KEY`
**Trigger:** Claude Code (cursorr) after completing a daily lead batch
**Payload:**
```json
{
  "counts": { "Roofing": 234, "HVAC": 567 },
  "currentNiche": "Roofing",
  "lastBatchDate": "2026-04-13"
}
```
**Effects:** → Slack #daily-digest with progress bar

---

### create_checkout
**Endpoint:** `POST /api/create-checkout-session`
**Trigger:** Pricing page signup buttons
**Payload:** `{ "plan": "starter | growth" }`
**Effects:** → Stripe checkout session → redirect to dashboard

---

### manage_billing
**Endpoint:** `POST /api/create-portal-session`
**Auth:** Bearer token (Supabase session)
**Trigger:** Dashboard "Manage Billing" button
**Effects:** → Stripe billing portal session

---

### stripe_event
**Endpoint:** `POST /api/stripe-webhook`
**Trigger:** Stripe events (auto-called by Stripe)
**Handled events:**
- `checkout.session.completed` → Supabase subscriptions table, calculate trial end
- `customer.subscription.updated` → update status/dates
- `customer.subscription.deleted` → mark canceled
- `invoice.payment_failed` → mark past_due

---

## Supabase Tables

### `subscriptions`
| Column | Type | Notes |
|--------|------|-------|
| user_id | uuid | Foreign key to auth.users |
| stripe_customer_id | text | |
| stripe_subscription_id | text | |
| plan | text | starter / growth / enterprise |
| status | text | active / canceled / past_due / trialing |
| trial_ends_at | timestamptz | |
| current_period_end | timestamptz | |

### `calls` (to be created)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| user_id | uuid | FK to auth.users (null for pre-auth calls) |
| caller_phone | text | |
| caller_name | text | |
| business_name | text | |
| service_needed | text | |
| duration_seconds | integer | |
| outcome | text | booked / qualified / lost / spam |
| booked | boolean | |
| summary | text | |
| transcript_url | text | nullable |
| booking_slot | text | nullable |
| created_at | timestamptz | default now() |

---

## Slack Channels

| Channel | Webhook Env Var | Purpose |
|---------|----------------|---------|
| #lead-gen | `SLACK_WEBHOOK_URL` | Batch progress, milestones |
| #hot-leads | `SLACK_WEBHOOK_HOT_LEADS` | Website form leads, Voiceflow captures |
| #daily-digest | `SLACK_WEBHOOK_DAILY_DIGEST` | Morning briefing, call stats |
| #errors | `SLACK_WEBHOOK_ERRORS` | Health check alerts, failures |
