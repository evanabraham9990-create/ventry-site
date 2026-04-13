# /site-audit — Ventry Site Health Check

Run a full audit of the Ventry AI website. Check for bugs, broken references, nav consistency, performance red flags, and UX issues. Report findings grouped by severity.

---

## Step 1 — Asset Integrity

Grep all HTML files for local `src=` and `href=` references (excluding http/https). For each referenced path, verify the file exists on disk.

Key assets to always check:
- `assets/transparentlogo.png`
- `assets/agent-avatar.svg`
- `assets/voices/professional.mp3`, `friendly.mp3`, `warm.mp3`
- `style.css`
- `script.js`, `auth.js`, `dashboard.js`, `chat-widget.js`, `signup.js`

Flag any missing file as **Critical**.

---

## Step 2 — Nav Consistency

Every non-auth page (`index.html`, `pricing.html`, `faq.html`, `how-it-works.html`, `demo.html`, `demo-sites.html`, `ai-receptionist.html`, `ai-vs-virtual.html`) must have:
- `id="theme-toggle"` button
- `<span id="nav-auth-links"></span>` for auth.js injection
- `id="nav-cta-audit"` Get Started / Dashboard button
- NO static `<a href="login.html" class="nav-sign-in">` (auth.js owns this slot)

Auth pages (`login.html`, `signup.html`, `dashboard.html`) have simplified navs — skip the above checks for them.

---

## Step 3 — Theme Flash Prevention

Every HTML file `<head>` must contain the inline flash-prevention script before the first render:
```
(function(){var t=localStorage.getItem('ventryTheme');if(t!=='dark')document.documentElement.setAttribute('data-theme','light');})();
```

Flag any page missing it as **Warning** (users will see dark flash on light mode).

---

## Step 4 — Internal Link Validity

Grep for all `href="*.html"` patterns across all pages. Verify each linked `.html` file exists. Also check for `href="/"` on pages that are served as flat files (should be `href="index.html"`).

---

## Step 5 — Footer Legal Links

All pages with a footer must have working Privacy Policy and Terms of Service links pointing to `privacy.html` and `terms.html` respectively — not `href="#"`.

---

## Step 6 — JS Error Risks

Scan `script.js`, `auth.js`, `dashboard.js` for `getElementById`, `querySelector`, and `querySelectorAll` calls. Cross-reference the IDs and classes against the HTML files they're used in. Flag any reference that doesn't match an existing element.

---

## Step 7 — Duplicate IDs

Grep each HTML file for IDs that appear more than once in the same file. Duplicate IDs cause unpredictable behavior in JS.

---

## Step 8 — Performance Red Flags

Check `index.html` and all pages for:
- Unoptimized large images (check file sizes in `assets/` — flag anything > 500KB)
- Multiple render-blocking `<script>` tags in `<head>` without `defer` or `async`
- External fonts/scripts loaded without `preconnect` hints
- Any `<video autoplay>` without `muted` attribute (browsers block unmuted autoplay)

---

## Step 9 — UX / Accessibility

Quick checks:
- All `<img>` tags have `alt` attributes
- All interactive `<button>` elements have `aria-label` or visible text
- Color contrast: any hardcoded hex colors on text — flag if they look like they'd fail contrast in light mode (e.g., light gray text on white bg)

---

## Output Format

Report as:

### Critical (site broken or major feature non-functional)
- File:line — description

### Warning (degraded UX, broken minor feature)
- File:line — description

### Info (polish / best practice)
- File:line — description

### Clean
List what was checked and found clean.

Keep report concise. File + line number for every finding. No fluff.
