# Ventry AI — Project Status

Last Updated: 2026-04-02
Version: 1.2.1

## Current Phase

**Phase 1: Website Chat Lead Capture** — Code complete, pending external account setup.

## Target Flow

```
Visitor -> Voiceflow Chat Widget -> Lead Captured -> n8n Webhook -> Alert to Evan
```

## Stack

| Service | Purpose | Status |
|---|---|---|
| Voiceflow | Website chat widget | Live — project ID deployed, branding set, instructions ready to paste |
| n8n Cloud | Automation hub, lead routing | Live — workflow imported, webhook active |
| Cal.com | Scheduling with webhooks (syncs to Google Calendar) | Live — event type created, links deployed |
| Vapi | AI phone agent | Phase 3 — not started |
| Twilio | Phone number + SMS | Phase 3 — not started |

## What's Done

- [x] Security headers in vercel.json (HSTS, CSP, X-Frame-Options, etc.)
- [x] Mobile canvas crash fix + image optimization
- [x] 4 broken CTA buttons fixed (now link to Cal.com booking)
- [x] Cal.com account connected to Google Calendar, "Free Missed Call Audit" event created
- [x] All 14 booking links switched from Google Calendar to Cal.com
- [x] CSP updated for Voiceflow, n8n, and Cal.com domains
- [x] Voiceflow chat widget script created (chat-widget.js)
- [x] Widget added to all 14 HTML pages (6 main + 8 demos)
- [x] n8n webhook schema documented (docs/n8n-webhook-schema.md)

## What's Next

### Evan's Setup (Phase 2)
1. ~~Create Cal.com account, connect Google Calendar, get booking URL~~ Done
2. ~~Replace all Google Calendar links with Cal.com URL site-wide~~ Done
3. Create Voiceflow account, build lead capture agent, get project ID
4. Update `chat-widget.js` with real Voiceflow project ID
5. Sign up for n8n Cloud Starter ($24/mo)
6. Build n8n webhook workflow: receive lead > Google Sheet > email alert
7. Test full flow end-to-end

### Phase 3 (After Chat Flow Proven)
- Buy Twilio number
- Set up Vapi with qualification flow
- Add call lead workflow to n8n

## Monthly Cost

| Phase | Cost |
|---|---|
| Current (Phase 1) | $0 |
| After setup (Phase 2) | ~$24/mo (n8n Cloud) |
| With phone (Phase 3) | ~$30-40/mo (+ Twilio + Vapi usage) |
