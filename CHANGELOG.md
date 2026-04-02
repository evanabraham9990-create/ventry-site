# Changelog — Ventry AI (ventryxai.com)

All notable changes to this project are documented here.

---

## [1.2.1] - 2026-04-02

### Added
- Production Voiceflow agent instructions with sales-focused conversation strategy, objection handling, lead capture flow, and n8n webhook integration (`docs/voiceflow-agent-instructions.md`)
- n8n lead capture workflow JSON for import (`docs/n8n-lead-capture-workflow.json`)

### Changed
- Voiceflow widget branding updated via API: title "Ventry AI", color #6C63FF, text-only chat

---

## [1.2.0] - 2026-04-02

### Added
- Cal.com "Free Missed Call Audit" event type (15 min, Cal Video, synced to Google Calendar)

### Changed
- Replaced all 14 Google Calendar booking links with Cal.com URL (`cal.com/evan-abraham-9cfgui/missed-call-audit`) across 6 pages

---

## [1.1.0] - 2026-04-01

### Added
- Voiceflow chat widget script (`chat-widget.js`) with placeholder project ID
- Chat widget embedded on all 14 HTML pages (6 main + 8 demos)
- CSP directives for Voiceflow (`cdn.voiceflow.com`, `general-runtime.voiceflow.com`), n8n (`hooks.n8n.cloud`), and Cal.com
- `frame-src` directive for Google Calendar and Cal.com embeds
- n8n webhook schema documentation (`docs/n8n-webhook-schema.md`)
- `PROJECT_STATUS.md` for tracking project state and next steps
- This changelog

### Fixed
- 4 broken CTA buttons (`href="#"`) on ai-receptionist, demo, faq, and how-it-works pages — now link to Cal.com booking

---

## [1.0.0] - 2026-04-01

### Added
- Security headers in `vercel.json`: HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, Content-Security-Policy

### Fixed
- Canvas animation crash on mobile (reduced star count, hidden GPU-heavy elements below 768px)
- Compressed callcover poster from 711KB to 76KB
- Optimized Unsplash images across all 8 demo pages

### Removed
- Dead 2MB `transparentlogo.png` from repo root
