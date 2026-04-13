# /onboarding-packet — New Client Setup Packet

Read the following context files before generating:
- `context/receptionist-system.md`
- `context/services-and-pricing.md`
- `context/objections.md`
- `docs/voiceflow-agent-instructions.md`

## What This Command Does

Given a new client's business details, produces a complete onboarding packet: custom Voiceflow greeting script, qualification questions to configure, FAQ answers to load, escalation rules, and a first-week checklist.

## Input

Evan provides:
- Business name
- Industry / niche
- Services offered (list)
- Business hours
- Service area (city/region)
- Owner name
- Owner phone/email for escalations
- Any special instructions (emergency line, seasonal services, pricing notes)

## Output Format

Produce all sections in sequence:

---

### 1. Voiceflow Greeting Script

```
"Thanks for calling [Business Name]! This is [AI name, e.g. 'Alex'], 
how can I help you today?"
```

Variations for:
- After hours: "Thanks for calling [Business Name]. We're currently closed but I'm here to help. What's the nature of your call?"
- High urgency opener: "Thanks for calling [Business Name] — are you dealing with an emergency right now, or is this for a scheduled service?"

---

### 2. Qualification Questions

List 5–7 questions the AI should ask, in order:

1. "What kind of [service] are you looking for?" (identify job type)
2. "And where are you located?" (confirm service area)
3. "Is this an emergency or can we schedule it?" (urgency)
4. "What's your name?" (lead capture)
5. "Best number to reach you?" (lead capture)
6. "And email address?" (lead capture — optional if they're hesitant)
7. [Industry-specific]: e.g., for HVAC: "Is it a repair or a new unit?"

---

### 3. FAQ Answers to Load

5–8 Q&As specific to this business:

- "What areas do you serve?" → [service area answer]
- "What are your hours?" → [hours answer]
- "Do you offer free estimates?" → [answer based on industry norms]
- "How much does [common service] cost?" → "Pricing depends on the job — let me get you set up with a free estimate call."
- "How quickly can you come out?" → [typical response time for niche]
- "Are you licensed and insured?" → "Yes — fully licensed and insured." (standard for all)

---

### 4. Escalation Rules

When to escalate to human callback:
- Caller reports: [list emergency types for this industry]
- Caller is asking for owner by name
- Caller mentions a previous appointment or existing work
- Caller is upset after 2 AI responses

Escalation script: "Let me have [Owner Name] reach out to you directly — what's the best number? They'll call within [X] hours."

Escalation contact: [owner phone from input]

---

### 5. First-Week Checklist

For Evan to complete:
- [ ] Forward [client's number] to Ventry AI number
- [ ] Confirm Voiceflow greeting sounds correct on first test call
- [ ] Verify Cal.com link works and calendar is synced
- [ ] Test lead capture → confirm Google Sheet / email notification received
- [ ] Monitor first 10 calls manually — adjust qualification questions if needed
- [ ] Send client Day 7 summary: calls handled, leads captured, bookings made

For client:
- [ ] Share calendar access for booking integration
- [ ] Confirm business hours are correct in system
- [ ] Test call the number from a cell phone and confirm experience
- [ ] Review first week summary with Evan on Day 7 call

---

## Notes

- Adjust qualification questions based on industry norms (HVAC ≠ law firm)
- Emergency services (roofing, plumbing, HVAC) should always have a high-urgency option in the greeting
- Med spas and law firms: do NOT mention pricing; always route to consultation
- If services are seasonal, note which services to emphasize by month
