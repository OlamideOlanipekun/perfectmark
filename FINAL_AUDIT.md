# PerfectMark Frontend — Final Security & Code Quality Audit

**Date:** 2026-05-14  
**Branch:** `main` (commit `338be6b`)  
**Scope:** All source files under `src/`, `next.config.mjs`, `package.json`, `.env.local.example`  
**Auditor:** Claude Sonnet 4.6 (automated static analysis)

---

## Summary

| Severity | Count |
|----------|-------|
| High     | 0     |
| Medium   | 3     |
| Low      | 4     |
| Info     | 4     |
| **Total**| **11**|

No critical vulnerabilities found. The codebase demonstrates mature security practices for a frontend-only Next.js application. The most impactful open item is that the Content Security Policy is still in Report-Only mode and therefore provides no active protection.

---

## Findings

### MEDIUM-01 — CSP is Report-Only (no enforcement)

**File:** `next.config.mjs`  
**Issue:** The header is `Content-Security-Policy-Report-Only`. It logs violations to the browser console but does **not** block anything. `unsafe-inline` and `unsafe-eval` are also allowed for `script-src`, meaning arbitrary inline scripts would execute even if CSP were enforced.  
**Risk:** XSS payloads are not blocked by CSP. An attacker who finds an injection point has full script execution.  
**Fix:**
1. Collect violation reports from dev/staging until they're clean.
2. Rename the header to `Content-Security-Policy`.
3. Remove `'unsafe-eval'` for production (it was noted as dev-mode-only in the config comment).
4. Replace `'unsafe-inline'` for scripts with a per-request nonce via Next.js middleware (`generateBuildId` + `nonce` strategy).

---

### MEDIUM-02 — Open redirect via `?next=` login parameter

**File:** `src/components/auth/login-form.tsx:58`  
**Code:**
```tsx
if (next && next.startsWith("/")) {
  router.replace(next);
}
```
**Issue:** `"//evil.com".startsWith("/")` returns `true`. A URL like `/login?next=//evil.com` passes the guard and redirects the user to an external domain after successful login.  
**Fix:** Use the stricter pattern `next.startsWith("/") && !next.startsWith("//")`, or parse with `new URL(next, window.location.origin)` and verify `origin` matches.

```tsx
// Safe fix
if (next && next.startsWith("/") && !next.startsWith("//")) {
  router.replace(next);
}
```

---

### MEDIUM-03 — Auth tokens in JavaScript-readable cookies

**File:** `src/lib/auth.ts`  
**Issue:** Both the access token (`pmtc_at`) and refresh token (`pmtc_rt`) are stored in non-`httpOnly` cookies so the JS client can read them for Bearer auth. This is intentional and documented, but it means any XSS vulnerability — however minor — can directly exfiltrate both tokens, including the 30-day refresh token.  
**Current mitigations:** `SameSite=Lax`, `Secure` in prod, no `dangerouslySetInnerHTML`, CSP (Report-Only, see MEDIUM-01).  
**Risk rating:** Medium (by design; acceptable if CSP is enforced and XSS surface is zero).  
**Recommendation:** Once CSP is enforced (MEDIUM-01 resolved), risk reduces to Low. No code change needed — track as accepted risk until then.

---

### LOW-01 — `console.error` leaks full error object to browser

**File:** `src/context/auth-context.tsx:85`  
**Code:**
```tsx
console.error("[auth] failed to hydrate user", err);
```
**Issue:** In production, this logs the full error object (including stack trace, API endpoint path, and response details) to the browser console, visible to any user who opens DevTools.  
**Fix:** Log only the message in production:
```tsx
if (process.env.NODE_ENV !== "production") {
  console.error("[auth] failed to hydrate user", err);
}
```

---

### LOW-02 — `unsafe-eval` in production CSP

**File:** `next.config.mjs` (inside the `csp` string)  
**Issue:** The comment reads *"unsafe-eval — Next.js dev mode + some libs; review for prod"*. This flag allows `eval()`, `new Function()`, and dynamic code execution across all scripts. It was never removed before the CSP was written.  
**Fix:** Remove `'unsafe-eval'` from `script-src`. Test the production build — Next.js 14 does not require `unsafe-eval` in production. If a third-party library requires it, consider replacing that library.

---

### LOW-03 — Upload file validation uses client-side MIME OR extension (OR logic)

**File:** `src/app/(admin)/admin/videos/upload/page.tsx:85`  
**Code:**
```tsx
if (!ACCEPTED_MIMES.includes(candidate.type) && !candidate.name.match(/\.(mp4|mov|mkv|webm|m4v)$/i)) {
```
**Issue:** The `||`-like fallback means a file with an arbitrary MIME type (`application/octet-stream`) passes validation if it has a `.mp4` extension. Client-side validation is best-effort, but the backend's transcoder should also reject invalid content.  
**Risk:** Low — the file goes to a transcoding pipeline (not executed), and the backend should enforce file type. Confirm that the backend `/admin/media/uploads` route validates content independently.

---

### LOW-04 — Admin route role gate is bypassable at the UI layer

**File:** `src/middleware.ts:44-50`  
**Issue:** The `/admin/*` route gate reads the `pmtc_role` cookie, which is a client-readable, JavaScript-settable cookie. A user could manually set `pmtc_role=admin` to see the admin UI shell.  
**Current mitigation:** The comment correctly notes: *"The backend independently enforces admin role on every /admin/* API call via requireRole('admin')."* Every panel would return 403 immediately.  
**Risk:** Cosmetic only — no actual data is accessible. Still worth noting as the middleware's role gate is security theatre at the browser level.  
**Fix:** Accept as a known limitation, or move role storage to a server-side session. The backend enforcement is what matters.

---

### INFO-01 — `@tanstack/react-query-devtools` in `dependencies`, not `devDependencies`

**File:** `package.json`  
**Issue:** The devtools package is conditionally rendered only in development (`process.env.NODE_ENV === "development"`) but is listed under `dependencies`. Next.js tree-shaking handles this, but it increases production `node_modules` size and may appear in bundle analysis tools.  
**Fix:** Move to `devDependencies`:
```bash
npm install --save-dev @tanstack/react-query-devtools
```

---

### INFO-02 — `controlsList="nodownload"` does not prevent video download

**File:** `src/components/player/video-player.tsx`  
**Issue:** `controlsList="nodownload"` hides the browser's native download button in Chrome, but the HLS segments (`.ts` files) remain directly accessible via DevTools → Network tab. This is not a code defect — it's a platform limitation of browser-based HLS.  
**Current mitigations:** Signed, short-lived manifest URLs (TTL-based re-fetch), per-user watermark overlay for traceability, concurrent-stream cap.  
**Recommendation:** The existing signed-URL + watermark approach is the correct production defence. No code change needed.

---

### INFO-03 — Device ID in `localStorage` (minor XSS surface)

**File:** `src/lib/media.ts:36`  
**Issue:** `pmtc_device_id` is stored in `localStorage`. An XSS attacker who also steals the auth token (from cookies) could read the device ID to impersonate the exact device slot.  
**Risk:** Negligible in isolation — the device ID is only meaningful alongside a valid auth token. Auth token theft (MEDIUM-03) is the primary concern.  
**Recommendation:** No change needed.

---

### INFO-04 — `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` exposed client-side

**File:** `src/lib/paystack.ts:16`, `.env.local.example`  
**Issue:** The Paystack public key is bundled into the client-side JavaScript.  
**Risk:** None — Paystack public keys are designed to be public. The secret key lives on the backend only. This is correct usage.

---

## What Is Done Well

| Area | Detail |
|------|--------|
| No XSS vectors | Zero uses of `dangerouslySetInnerHTML`, `eval()`, or raw `innerHTML` across all 100+ source files |
| Security headers | HSTS (2-year, preload), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` all set globally |
| HTTPS redirect | `next.config.mjs` redirects all `x-forwarded-proto: http` requests to HTTPS (permanent 308) |
| Token refresh | Single-flight refresh pattern prevents concurrent refresh calls from triggering server-side reuse detection |
| Zod validation | All auth forms (login, register, forgot-password) use Zod schema validation with `react-hook-form` |
| Password policy | Minimum 10 characters enforced at the form and schema level |
| MFA support | Two-step login flow with 6-digit TOTP, distinguishes MFA-required from invalid-credentials 401s |
| Rate limiting UX | All auth forms surface a user-readable message on HTTP 429 |
| Open redirect partial fix | `next` param validated against `startsWith("/")` — just needs the `//` edge case closed (LOW-02) |
| No secrets committed | `.env*.local` gitignored; `.env.local.example` contains only placeholders |
| `NEXT_PUBLIC_` hygiene | All exposed env vars are genuinely safe to expose (API URL, app URL, Paystack public key) |
| Stream signing | HLS manifest URLs are short-lived and signed; re-requested automatically before expiry |
| Concurrent-stream cap | Heartbeat + release on unmount enforces the server-side stream slot |
| Video watermark | Per-user identifier overlay deters casual piracy and enables traceability |
| Device ID cleared on logout | `clearDeviceId()` called in the logout flow |
| Upload pipeline | Pre-signed 3-step flow (sign → PUT → complete); frontend enforces 2 GB cap with UX advice |
| Admin role double-enforcement | Middleware redirect (UX) + backend `requireRole('admin')` (security) are correctly separated |
| `encodeURIComponent` on payment reference | `billing.getPaymentStatus` URL-encodes the Paystack reference correctly |

---

## Priority Action List

| Priority | Item | Effort |
|----------|------|--------|
| 1 | Fix `//` open redirect in `login-form.tsx` (MEDIUM-02) | 5 min |
| 2 | Remove `console.error` full object in production (LOW-01) | 5 min |
| 3 | Remove `unsafe-eval` from CSP (LOW-02) | 10 min |
| 4 | Enforce CSP — flip `Report-Only` to `Content-Security-Policy` (MEDIUM-01) | 1–2 days (test cycle) |
| 5 | Move `react-query-devtools` to `devDependencies` (INFO-01) | 5 min |

Items 1–3 and 5 are trivial changes that can ship in the next commit. Item 4 requires a proper violation-report review cycle but is the highest-impact security improvement remaining.

---

*Audit generated by static code analysis of the frontend repository only. Backend API security (authentication enforcement, rate limiting, SQL injection prevention, webhook signature verification) is out of scope for this review.*
