# Claude Instructions — Ventry AI

## Mission
Ventry AI is an inbound revenue system for service businesses. The product answers every call, qualifies every lead, books appointments, sends call summaries, and triggers follow-up — automatically. The website (ventryxai.com) is the sales engine. The backend is the delivery mechanism.

This is not just a website project. Claude is the operator of this system — writing prompts, building workflows, drafting copy, and maintaining the knowledge base.

---

## Stack

| Layer | Tool | Purpose |
|---|---|---|
| Hosting | Vercel | Static site + serverless functions + cron jobs |
| Chat / Receptionist | Voiceflow | Website chat widget + AI call flow |
| Automation | n8n Cloud | Webhook routing, Google Sheets, email alerts |
| Payments | Stripe | Subscription checkout, billing portal, webhook sync |
| Auth / Database | Supabase | User auth, subscriptions table, calls table |
| Booking | Cal.com | Free Missed Call Audit scheduling |
| Notifications | Slack | Multi-channel real-time alerts (4 channels) |
| Phone (Phase 3) | Vapi + Twilio | AI voice phone receptionist — NOT STARTED |

---

## Operating Rules

1. **Read context/ files before writing any copy, prompts, or scripts** — they are the source of truth for what Ventry AI does, who it serves, and how to talk about it
2. **Use existing api/ endpoints for data operations** — do not build new API routes if an existing one covers it
3. **Never modify vercel.json crons without checking the existing schedule** — 3 crons are active (morning-digest, health-check, weekly-rollup)
4. **Keep CLAUDE.md current** — if the stack, phase, or rules change, update this file immediately
5. **Phase discipline** — check PROJECT_STATUS.md before building Phase 3 work. Don't jump ahead
6. **Context files own the truth** — if website copy conflicts with a context file, fix the website copy

---

## File Map

```
CLAUDE.md                    # This file — read first every session
PROJECT_STATUS.md            # Current phase, what's done, what's next
CHANGELOG.md                 # Version history

context/                     # Business knowledge base — READ BEFORE WRITING ANYTHING
  offer.md                   # What we sell, core promise, differentiators
  ideal-customers.md         # Who buys, pain, trigger events
  objections.md              # Common pushback + rebuttals
  receptionist-system.md     # How the AI call flow works
  services-and-pricing.md    # Plans, pricing, what's included
  brand-voice.md             # Tone, words to use/avoid, writing style

docs/                        # Technical references
  voiceflow-agent-instructions.md   # Voiceflow chat prompt (ready to paste)
  n8n-lead-capture-workflow.json    # n8n workflow export (import into n8n)
  n8n-webhook-schema.md             # Lead payload schema
  backend-actions.md                # Standardized API action reference

api/                         # Vercel serverless functions
  lead-capture.js            # POST — capture lead → Slack + email
  log-call.js                # POST — log call outcome → Supabase + Slack
  create-checkout-session.js # POST — Stripe checkout
  create-portal-session.js   # POST — Stripe billing portal
  stripe-webhook.js          # POST — Stripe event handler → Supabase sync
  slack-notify.js            # Shared helper — multi-channel Slack
  update-counts.js           # POST — sync batch progress from Claude Code
  cron/
    morning-digest.js        # Runs 12:57pm ET daily
    health-check.js          # Runs 3:00pm ET daily
    weekly-rollup.js         # Runs 2:00pm ET Sundays

.claude/commands/            # Slash commands for Claude Code
  site-audit.md              # /site-audit — full site health check
  workflow-review.md         # /workflow-review — Claude usage audit
  receptionist-prompt.md     # /receptionist-prompt — generate Voiceflow system prompt
  call-analysis.md           # /call-analysis — analyze a call transcript
  generate-outreach.md       # /generate-outreach — sales outreach for a prospect
  weekly-review.md           # /weekly-review — weekly performance review
  onboarding-packet.md       # /onboarding-packet — new client setup packet
```

---

## Environment Variables Required

| Variable | Used By | Purpose |
|---|---|---|
| `SLACK_WEBHOOK_URL` | api/slack-notify.js | Default #lead-gen channel |
| `SLACK_WEBHOOK_HOT_LEADS` | api/lead-capture.js | Hot leads alerts |
| `SLACK_WEBHOOK_DAILY_DIGEST` | api/cron/morning-digest.js | Daily briefing |
| `SLACK_WEBHOOK_ERRORS` | api/cron/health-check.js | Error alerts |
| `CRON_SECRET` | api/cron/* | Vercel cron auth bearer token |
| `SYNC_API_KEY` | api/update-counts.js | Batch sync auth key |
| `LEAD_COUNTS` | api/cron/*.js | JSON of niche lead counts |
| `CURRENT_NICHE` | api/cron/*.js | Active niche name |
| `LAST_BATCH_DATE` | api/cron/health-check.js | ISO timestamp of last batch |
| `STRIPE_SECRET_KEY` | api/stripe-*.js | Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | api/stripe-webhook.js | Stripe webhook signature |
| `STRIPE_PRICE_STARTER` | api/create-checkout-session.js | Starter plan price ID |
| `STRIPE_PRICE_GROWTH` | api/create-checkout-session.js | Growth plan price ID |
| `NEXT_PUBLIC_SUPABASE_URL` | auth.js, dashboard.js | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | auth.js, dashboard.js | Supabase anon key |
| `RESEND_API_KEY` | api/lead-capture.js | Transactional email (optional) |
| `LEAD_NOTIFY_EMAIL` | api/lead-capture.js | Lead alert recipient (default: evan@ventryxai.com) |

---

## Current Phase

**Phase 1 — Complete:** Website live, Voiceflow chat widget deployed, Cal.com booking live, Stripe integrated, Supabase auth wired

**Phase 2 — In Progress:** n8n workflow imported, webhook active, Google Sheet pending link, Voiceflow project ID live

**Phase 3 — Not Started:** Vapi voice phone receptionist + Twilio number. Do not build until Phase 2 flow is proven end-to-end.

---

## General Preferences
- Concise and direct — no trailing summaries after completing a task
- No emojis unless explicitly asked
- Always check context/ files before writing copy or prompts
- Booking link: https://cal.com/evan-abraham-9cfgui/missed-call-audit
- Primary domain: https://ventryxai.com
- Primary contact: evan@ventryxai.com
