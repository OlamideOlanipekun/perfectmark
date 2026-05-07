# Security Audit — Site & Video

Audit performed: 2026-05-07
Scope: backend API (`api/src/**`), frontend (`src/**`), video pipeline (upload → transcode → R2 → playback), webhook handlers, database query patterns, session/concurrency controls.

---

## Headline

**Strong foundations, three concerns to address.** The auth layer is well-designed (Argon2id + refresh-token rotation + family reuse detection + admin MFA), webhook HMAC is correct (timing-safe), and DB access is uniformly parameterised through Drizzle. The three issues to treat as urgent:

1. **CSP is disabled while tokens live in JS-readable cookies** — XSS gets them.
2. **HLS bucket is fully public via the custom domain** — leaked URLs stream forever.
3. **MFA has no backup codes** — losing the admin device means losing the account.

---

## 🔴 High — fix soon

### 1. CSP disabled + tokens in JS-readable cookies
[api/src/plugins/security.ts:13](api/src/plugins/security.ts#L13) sets `contentSecurityPolicy: false`. [src/lib/auth.ts:13](src/lib/auth.ts#L13) acknowledges tokens are "intentionally NOT httpOnly" and says "protect by sanitizing inputs + strict CSP" — but CSP is disabled, so that defense doesn't exist. Any XSS (a single `dangerouslySetInnerHTML`, a third-party widget compromise) can steal both tokens and impersonate the user for 30 days.

**Fix:** enable a strict CSP. Start in report-only to find violations, then enforce. Minimum directives:
```
default-src 'self';
script-src 'self' 'unsafe-inline';
connect-src 'self' https://<api-host> https://<media-host>;
img-src 'self' data: https:;
media-src 'self' https://<media-host>;
frame-ancestors 'none';
```
Even imperfect CSP dramatically narrows XSS impact.

### 2. HLS bucket is fully public via custom domain
After the recent fix, `media.perfectmarktutorschoolproject.com` serves the HLS bucket publicly — anyone with a manifest URL streams forever (or until the bucket is rotated). The mitigations in place (auth-gated `/stream` issuance, random unguessable lesson IDs, per-user watermark, 3-concurrent-stream cap) are real but not airtight: a determined leaker can screen-record once and post the file anywhere.

**Trade-off accepted to ship:** signed URLs don't work with HLS without per-segment signing. The current setup is appropriate for MVP, but for production at scale you want one of:
- **Cloudflare Worker in front of the bucket** — verifies a short-lived JWT cookie/header per request, enforces the same access checks as `/stream`. Best long-term answer.
- **Per-segment signed URLs** — backend rewrites the manifest at request time, signing each variant playlist + segment. Preserves URL secrecy but more complex.
- **Stream cap tightening** — drop to 1–2 concurrent and shorten heartbeat TTL so leaked-URL streaming is more disruptive.

Document the trade-off in CLAUDE.md.

### 3. MFA has no backup codes
`api/src/modules/auth/mfa.service.ts` uses TOTP only. If an admin loses their phone, the account is locked out. There are no recovery codes, no email-based fallback, no `mfa_disable` admin endpoint visible. For a single-admin app this is an existential risk.

**Fix:** generate 8–10 single-use backup codes at MFA enrollment, store hashed (Argon2id), let admin verify with one if they lose their authenticator. Display once at enrollment, never show again. Also add a documented (offline) DB-level recovery path: an SQL command another admin can run to clear `mfaSecret`.

---

## 🟡 Medium — address in the next pass

### 4. Refresh token vulnerable to XSS
[src/lib/auth.ts:42](src/lib/auth.ts#L42) reads the refresh token via `Cookies.get(REFRESH_TOKEN_COOKIE)` — same JS-readable cookie pattern. Refresh tokens are 30-day, so XSS leak is far more dangerous than access-token leak. Family-based reuse detection mitigates: when a stolen token is rotated, the legitimate user's next refresh trips the check and revokes the family. But there's a window where the attacker has a fresh chain.

**Fix:** put the refresh token in an `httpOnly` cookie (frontend can still call `/auth/refresh` because the browser auto-attaches it). Keep the access token JS-readable for Bearer-header auth. Frontend just calls `/auth/refresh` without a body — server reads the httpOnly cookie. Small refactor, significant XSS risk reduction.

### 5. CORS origin `*` is too permissive
[api/src/plugins/security.ts:21](api/src/plugins/security.ts#L21) sets `origin: "*"`. Acceptable in principle because tokens are in headers not cookies, but it means any browser, anywhere, can hit your public endpoints (e.g., enumerate `/catalogue/subjects`). Explicit allowlist is safer.

**Fix:**
```ts
origin: [
  "https://www.perfectmarktutorschoolproject.com",
  "https://perfectmarktutorschoolproject.com",
  ...(isDev ? ["http://localhost:3000"] : [])
],
```

### 6. No per-user rate limiting
Rate limits are per-IP only ([api/src/plugins/security.ts:34](api/src/plugins/security.ts#L34)). A single user behind a NAT + many users on the same network share the bucket; a single user on multiple IPs (mobile + wifi) gets independent buckets. Per-user limits on `/auth/login`, `/auth/refresh`, `/me/export` prevent abuse from authenticated attackers.

**Fix:** add `keyGenerator: (req) => req.auth?.sub ?? req.ip` to authed-route rate limiters; keep IP-based on unauthed.

### 7. Password schema strength check
Worth verifying `api/src/modules/auth/auth.schemas.ts` enforces enough beyond min length: at least one digit/letter, no breached-password check (e.g., HIBP integration). A breached-password lookup against HIBP's range API costs nothing and catches a significant attack vector.

### 8. No login notifications
Successful logins from new devices don't trigger an email. If a refresh token is leaked and used, the legitimate user has no way to know until they actively check or the family-reuse check trips them. Add: on first login from a new IP+UA pair, email "We saw a new sign-in to your account from Lagos / iPhone — wasn't you? [link to revoke]".

### 9. Watermark is deterministic per user
[api/src/modules/media/media.service.ts:215](api/src/modules/media/media.service.ts#L215) uses `sha256("pmtc:" + userId).slice(0,8)` — same user gets the same 8-char watermark every time. If a leaker is identified once, the same watermark on a future leak adds no information. Two students sharing one account have **identical** watermarks → can't distinguish them.

**Fix:** include lesson ID + a per-stream nonce in the watermark, and store the nonce → user mapping in the audit log. Or include the device ID (already known from `claimStreamSlot`), so credential-sharing leaves a trail.

### 10. No CSRF protection on cookie-based actions
The role-hint cookie `pmtc_role` is `SameSite=Lax`, which protects against most CSRF, but if you ever add cookie-authenticated state-changing endpoints, CSRF tokens will be needed. Worth a comment in the security plugin so future-you doesn't accidentally add a cookie-authed endpoint without CSRF.

---

## 🟢 Low — polish

### 11. `R2_PUBLIC_HLS_BASE` used unconditionally
[api/src/modules/media/media.service.ts:189](api/src/modules/media/media.service.ts#L189) uses the public URL whenever the env var is set, with no kill-switch. If you ever need to revoke a lesson urgently, you must rotate the bucket or move all keys. Consider adding a per-lesson `playbackPolicy: 'public' | 'signed' | 'blocked'` column for emergency takedowns.

### 12. HSTS, X-Frame-Options not explicitly configured
Helmet's defaults handle most security headers, but with CSP off you should explicitly verify the others are on. Quick check via `curl -I` the API — confirm `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`.

### 13. Audit log has no PII scrubbing layer
`api/src/lib/audit.ts` writes whatever the caller passes in `before`/`after`. A bug in a future caller could leak passwords/tokens. Defense-in-depth: have the audit helper recursively redact field names matching `passwordHash|password|token|secret|mfa` regardless of caller hygiene.

### 14. No 2FA enrollment requirement for admins
Admins *can* enable MFA but aren't *required* to. For an app where admin can soft-delete every lesson via a single endpoint, MFA should be mandatory at enrollment. Block admin actions for users who haven't enabled it.

### 15. No video encryption / DRM
HLS segments are clear-text MPEG-TS. Anyone with manifest access can `ffmpeg -i master.m3u8 -c copy out.mp4` and have the lesson. Real DRM (Widevine/FairPlay) is expensive and complex; for the price-point and audience this is probably acceptable, but worth deciding consciously and writing it down.

### 16. R2 keys are predictable from lessonId
[api/src/modules/media/keys.ts:30](api/src/modules/media/keys.ts#L30) — `hls/<lessonId>/master.m3u8`. If lesson IDs leak (e.g., via the `/admin/audit` endpoint), all manifest URLs are computable. Lesson IDs are 22-char nanoid-ish, so brute force is infeasible; just be aware that exposing lesson IDs to lower-trust contexts effectively shares the asset.

### 17. No rate limit on the proxy upload `/data` endpoint
[api/src/modules/media/media.admin.routes.ts:95](api/src/modules/media/media.admin.routes.ts#L95) — bodyLimit is 5GB but no rate-limit override. A compromised admin token could exhaust R2 + bandwidth. Add `config: { rateLimit: { max: 20, timeWindow: '1 hour' } }`.

---

## ℹ️ Info — solid choices already made

- **Argon2id** with OWASP 2024 params + dummy-hash on missing user (timing equalisation against enumeration) ✅
- **Refresh token family + reuse detection** — a stolen token gets caught the moment the legitimate user refreshes ✅
- **HMAC-SHA512 + `timingSafeEqual`** on Paystack webhook ✅
- **Raw body captured before parsers** so HMAC sees exact bytes ✅
- **All Fastify routes use Zod schemas** for params/body/query ✅
- **Drizzle ORM everywhere** — zero raw SQL with user input ✅
- **JWT validation** (HS256, issuer + audience checked) ✅
- **MFA for admins** (TOTP, RFC 6238) ✅
- **Stream concurrency cap** (3 per user, Redis sorted sets) ✅
- **Heartbeat re-checks access** — subscription expiring mid-playback is caught ✅
- **Soft-delete + 30-day grace + anonymisation cron** — NDPR-compliant ✅
- **Worker temp paths use crypto-random salts** — no path traversal ✅
- **Sentry reports terminal failures only** (not transient retries) ✅
- **`hideOptionsRoute: true` on CORS** so preflights don't hit auth hooks ✅
- **Audit log on every mutation** ✅
- **Failed login lockout** (5 strikes / 15 min window) ✅
- **R2 client uses `requestChecksumCalculation: WHEN_REQUIRED`** ✅
- **`forcePathStyle: true` on S3 client** — correct for R2 ✅
- **Account deletion lock** (`lockedUntil` set 100 years out) — defense if a stolen access token tries to undo deletion ✅

---

## Priority Recommendations

### Ship within a week
1. **#1** — Enable CSP (start report-only)
2. **#3** — MFA backup codes
3. **#5** — Tighten CORS to allowlist

### Next sprint
4. **#4** — Move refresh token to httpOnly cookie
5. **#6** — Per-user rate limiting
6. **#9** — Per-stream watermark with nonce
7. **#13** — Audit-log recursive PII scrubber
8. **#14** — Mandatory MFA for admins

### Strategic / multi-week
9. **#2** — Cloudflare Worker auth in front of HLS bucket (the proper fix for the "public bucket" trade-off)
10. **#15** — Decide DRM strategy (likely "no, accept the leakage risk")

---

## Open questions

- Single admin or multiple? If single, **#3 (backup codes)** moves up to Critical — losing the phone bricks the system.
- Acceptable amount of video piracy? Informs whether **#2** is worth the engineering investment now or later.
- On Cloudflare's paid plan? Some suggested fixes (Worker auth gate, advanced rate limiting) need it.
- Security incident playbook documented? Worth writing one before you need it: how to revoke all sessions, rotate JWT secret, force-logout everyone.
