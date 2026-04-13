# /weekly-review — Weekly Performance Review

Read the following context files before reviewing:
- `context/offer.md`
- `context/ideal-customers.md`
- `context/receptionist-system.md`

## What This Command Does

Evan pastes in his weekly Slack digest data (or describes the week in plain text). Claude produces a structured weekly review: what worked, what broke, top objection, one improvement to make, one content idea, and one outreach priority.

Run every Sunday after the weekly-rollup Slack message arrives.

## Input

Evan provides one or more of:
- Slack #daily-digest messages from the week
- Call/chat volume numbers
- Leads captured vs. booked
- Any calls that stood out (good or bad)
- Anything that felt broken or slow

## Output Format

Produce exactly this structure:

---

### Week Summary
- Calls / chats handled: [number or estimate]
- Leads captured: [number]
- Appointments booked: [number]
- Booking rate: [%]
- Calls lost (spam/disqualified): [number]

---

### What Worked
- 1–2 specific things that performed well this week
- Reference actual data where possible

---

### What Broke or Underperformed
- 1–2 specific friction points, drop-offs, or missed opportunities
- Root cause (if identifiable)

---

### Top Objection This Week
- The objection that came up most (or felt hardest)
- Current handling: [what the script does]
- Suggested improvement: [specific new language]

---

### One Improvement to Make
- The single highest-leverage change to make this week
- Which file/prompt/workflow to update
- Exact change (not vague guidance — specific text or action)

---

### One Content Idea
- Based on the week's conversations, one piece of content that would resonate with the target customer
- Format: short video / LinkedIn post / FAQ addition / blog post
- Angle: [specific hook or pain point to address]

---

### One Outreach Priority
- Based on ideal-customers.md and what worked this week:
- Industry to focus on next week
- Specific angle to lead with in outreach
- Any trigger events to look for (busy season, weather events, etc.)

---

## Notes

- If Evan has no data to share, produce the review based on first-principles reasoning (what would a typical week look like for a new Ventry AI deployment)
- Always end with the one improvement — that's the most important output
