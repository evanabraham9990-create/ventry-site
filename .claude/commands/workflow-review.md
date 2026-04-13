# /workflow-review — Claude & Cursor Usage Review

Audit how this project is using Claude Code and Cursor. Surface token waste, context bloat, inefficient patterns, and site quality issues that slow down development velocity. Then make targeted improvements.

---

## Step 1 — Context Bloat Check

Read `.claude/settings.local.json`. Check which plugins are enabled. Each enabled plugin loads its full documentation into every session context.

Flag any plugin enabled that is not relevant to the current project stack (e.g., Vercel plugin enabled on a non-Vercel project, frontend-design plugin on a backend-only project).

Recommend disabling irrelevant plugins with the exact JSON change needed.

---

## Step 2 — CLAUDE.md Quality Review

Read the `CLAUDE.md` file (if it exists in the project root). Evaluate:
- Is the mission clear and specific?
- Are the operating rules concrete enough to change Claude's behavior, or are they vague?
- Are there rules that contradict each other?
- Is there anything missing that Claude keeps having to re-derive from scratch each session (patterns, decisions, file locations)?
- Is there stale content (references to old file names, deprecated workflows)?

Suggest specific additions, removals, or rewrites. Do not rewrite the whole file — pinpoint the changes.

---

## Step 3 — Memory Index Review

Read `/Users/evanabraham/.claude/projects/[project-slug]/memory/MEMORY.md`. Evaluate:
- Are all memory entries still accurate? (Check the referenced facts against current file state)
- Any stale or contradicted entries that should be removed?
- Any important patterns from this project that are missing from memory and would save re-derivation time in future sessions?

---

## Step 4 — Repeated Work Detection

Look at the git log for the last 20 commits. Identify:
- Any file that was edited more than 3 times (churn indicator — the abstraction or plan wasn't clear enough)
- Any commit message pattern suggesting re-doing something that was already done ("fix nav again", "re-add theme", etc.)
- Files that are very long (> 500 lines) that could be split to reduce re-read cost per session

Report: "X was touched Y times — likely cause: Z. Consider: [concrete suggestion]."

---

## Step 5 — Site Quality Snapshot

Do a quick pass on the current site for issues that slow Claude down because they keep breaking:
- Are there hardcoded colors or values in HTML/CSS that should be CSS variables? (Every hardcoded value = potential future bug that creates a session)
- Are there inline `<style>` blocks in HTML files that duplicate or fight with `style.css`?
- Are there `console.log` statements left in production JS files?
- Are there TODO/FIXME comments in the code that represent unfinished work?
- Are there placeholder `href="#"` links remaining (excluding intentional UI elements)?

---

## Step 6 — Token Efficiency Recommendations

Based on findings from steps 1-5, produce a prioritized action list:

**Format each item as:**
> [Priority: High/Med/Low] **What**: description  
> **Why it saves tokens**: how this reduces re-derivation or context load  
> **How to fix**: exact change or command

---

## Step 7 — Apply Approved Changes

After presenting findings, ask which items to fix immediately. Then apply them directly — do not just describe what to do. Make the edits, run the verification, confirm clean.

---

## Guiding Principles

- Token efficiency = fewer re-derivations per session. The goal is for Claude to walk into any session with full context from CLAUDE.md + memory, not re-read 10 files to understand the project.
- Code quality = fewer bug sessions. Every hardcoded value, `href="#"`, or missing file is a future Claude session spent fixing it.
- Clarity = speed. Vague CLAUDE.md rules = Claude guessing = wrong output = correction session.
