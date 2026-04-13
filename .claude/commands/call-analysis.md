# /call-analysis — Analyze a Call Transcript or Summary

Read the following context files before analyzing:
- `context/receptionist-system.md`
- `context/objections.md`
- `context/ideal-customers.md`

## What This Command Does

Given a call transcript or summary (pasted in by Evan), produce a structured analysis that identifies outcome, objections, follow-up actions, and improvement opportunities for the receptionist.

## Input

Evan will paste a call transcript, Voiceflow session log, or written summary of a conversation.

## Output Format

Produce exactly this structure:

### Outcome
- Classification: `booked` | `qualified` | `lost` | `spam` | `unknown`
- Booked: yes / no
- If booked: what service, what time slot (if visible)
- If lost: at what point in the conversation did it fall apart?

### Caller Profile
- Business type (if identifiable)
- Fit assessment: strong / moderate / weak / disqualified
- Estimated call value (if bookable job type, estimate rough revenue range)

### Objection Detected
- List any objections raised (match to objections.md where possible)
- How did the AI handle it? (effective / missed / not present in script)

### Follow-Up Action
- Recommended next step: `send booking link` | `call back within 24h` | `send pricing info` | `no action`
- Urgency: high / medium / low
- Suggested Supabase update command:
  ```
  POST /api/log-call { caller_phone: "X", outcome: "X", follow_up_needed: true/false, notes: "X" }
  ```

### Improvement Suggestion
- One specific change to the receptionist prompt that would have improved this conversation
- Which section of the Voiceflow prompt to update
- Exact new language to use

---

## Notes

- If the transcript is a website chat (Voiceflow), assess the chat flow
- If it's a phone call (future Vapi integration), same structure applies
- Always end with a concrete improvement suggestion — even a good call teaches something
