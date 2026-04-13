# /receptionist-prompt — Generate Voiceflow System Prompt

Read the following context files before generating anything:
- `context/receptionist-system.md`
- `context/services-and-pricing.md`
- `context/objections.md`
- `context/brand-voice.md`
- `docs/voiceflow-agent-instructions.md` (existing prompt — use as base, improve it)

## What This Command Does

Generates or rewrites the Ventry AI Voiceflow system prompt. Output is ready to paste directly into Voiceflow's agent instructions field.

## Inputs

The user will provide one of:
- "Rewrite the current prompt" — improve the existing prompt in docs/voiceflow-agent-instructions.md
- "Generate for [client name] in [industry]" — create a client-specific variant
- A specific section to improve (e.g. "improve the objection handling section")

## Output Format

Produce the full prompt in this order:

1. **# Identity** — who the agent is, what its job is
2. **# Tone** — how it communicates (pull from brand-voice.md)
3. **# Core Goal** — the one outcome it's optimizing for
4. **# Opening Behavior** — first message hooks
5. **# What You Know** — grounded business knowledge (services, pricing rules, setup, industries)
6. **# Conversation Strategy** — the 4-step sequence
7. **# Lead Capture** — mandatory fields, how to collect naturally
8. **# Objection Handling** — use objections.md verbatim as source
9. **# Rules** — hard constraints (never quote pricing, never invent answers, etc.)

## Quality Checks Before Output

- No jargon or tech buzzwords (check against brand-voice.md avoid list)
- Responses should be 1–3 sentences max
- Every section moves toward booking or lead capture
- Objection responses match objections.md exactly
- Pricing rule is explicit: never quote, always redirect to audit
