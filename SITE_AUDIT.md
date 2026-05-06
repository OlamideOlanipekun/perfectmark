# PerfectMark Site Audit
**Date:** 2026-05-06  
**Scope:** Full codebase — Next.js frontend (`src/`) + Fastify backend (`api/src/`)

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 1 |
| High     | 3 |
| Medium   | 4 |
| Low      | 5 |
| Info     | 2 |

---

## CRITICAL

### 1. Profile page calls non-existent backend endpoints
**Files:** [src/app/(student)/profile/page.tsx](src/app/(student)/profile/page.tsx#L29), [api/src/modules/me/me.routes.ts](api/src/modules/me/me.routes.ts)

The profile page makes two API calls that have no matching routes on the backend:
- `PATCH /me` — called on line 29 to update the user's name
- `POST /me/change-password` — called on line 44 to change password

The `/me` router (`api/src/modules/me/me.routes.ts`) only defines `GET /export` and `DELETE /`. Neither `PATCH` nor `POST /me/change-password` exist. Both the "Save Changes" button and the "Change Password" form are completely broken — they will always return 404.

**Fix:** Add `PATCH /me` (update name/phone/classLevel/stream) and `POST /me/change-password` (verify current password, hash new one, revoke sessions) routes to the `/me` router, plus the corresponding service functions.

---

## HIGH

### 2. WhatsApp widget not hidden on student dashboard routes
**File:** [src/components/layout/whatsapp-widget.tsx](src/components/layout/whatsapp-widget.tsx#L15)

```ts
const isDashboard = pathname.startsWith("/admin") || pathname.startsWith("/student") || pathname.startsWith("/watch");
```

The path prefix `/student` does not exist in this app. Student routes live at `/dashboard`, `/catalogue`, `/subscriptions` — not under a `/student` parent. So the widget incorrectly appears on the student dashboard, catalogue, and subscriptions pages. The git commit message (`feat: hide WhatsApp widget on admin/student/watch dashboard pages`) confirms the intent was to hide it there.

**Fix:** Replace the check with the actual route prefixes:
```ts
const isDashboard =
  pathname.startsWith("/admin") ||
  pathname.startsWith("/dashboard") ||
  pathname.startsWith("/catalogue") ||
  pathname.startsWith("/subscriptions") ||
  pathname.startsWith("/watch");
```

---

### 3. Password minimum length mismatch between frontend and backend
**Files:** [src/app/(student)/profile/page.tsx](src/app/(student)/profile/page.tsx#L41), [api/src/modules/auth/auth.passwords.ts](api/src/modules/auth/auth.passwords.ts#L68)

The profile page validates `newPassword.length < 8` and shows placeholder text "Minimum 8 characters". But the backend enforces a 10-character minimum (`if (plaintext.length < 10)`). A user who sets an 8 or 9 character password will pass the client-side check but receive a validation error from the server with no clear explanation.

**Fix:** Update the frontend check to `< 10` and update the placeholder text to "Minimum 10 characters".

---

### 4. Admin users page subscriber counts are computed from the current page only
**File:** [src/app/(admin)/admin/users/page.tsx](src/app/(admin)/admin/users/page.tsx#L72)

The summary cards "Active Subscribers" and "No Subscription" are computed by filtering `users.data.users` — which contains only the current page of results (20 users), not the full user base. If there are 1,000 users, the counts reflect only those 20 currently loaded. These numbers are misleading to an admin.

**Fix:** Either compute these totals on the backend (add counts to the API response alongside `total`) or remove the summary cards and rely solely on the `/admin/stats` endpoint which does full-table counts.

---

## MEDIUM

### 5. `/profile` route is not protected by the Next.js middleware
**File:** [src/middleware.ts](src/middleware.ts#L67)

The `matcher` in `middleware.ts` includes `/dashboard/:path*`, `/catalogue/:path*`, `/watch/:path*`, `/subscriptions/:path*`, and `/admin/:path*` — but **not** `/profile`. An unauthenticated user can navigate to `/profile` without being redirected to `/login`. The page degrades gracefully (shows a skeleton when `user` is null), but the route should still redirect to login.

**Fix:** Add `/profile` (and any future authenticated-only pages) to both `STUDENT_PREFIXES` and the `matcher` array in `middleware.ts`.

---

### 6. Admin billing plan update does not validate `req.params` with Zod
**File:** [api/src/modules/admin/admin.routes.ts](api/src/modules/admin/admin.routes.ts#L135)

```ts
const { id } = req.params as { id: string };
```

Every other route in the codebase parses params through a Zod schema (e.g., `z.object({ id: z.string().min(1).max(64) }).parse(req.params)`). This one uses a raw type cast, which skips length/format validation on the plan ID.

**Fix:**
```ts
const { id } = z.object({ id: z.string().min(1).max(64) }).parse(req.params);
```

---

### 7. Testimonials admin routes have no audit logging
**File:** [api/src/modules/testimonials/testimonials.routes.ts](api/src/modules/testimonials/testimonials.routes.ts#L34)

All other admin mutation routes (catalogue, media, users) call `audit(req, { ... })` after every create/update/delete. The testimonials admin routes (`testimonialsAdminRoutes`) do not. Admin testimonial changes are invisible in the audit log.

**Fix:** Add `audit()` calls to the POST, PATCH, and DELETE handlers in `testimonialsAdminRoutes`, matching the pattern used in `catalogueAdminRoutes`.

---

### 8. "View pricing" button on the marketing courses page links to `/register`
**File:** [src/app/(marketing)/courses/page.tsx](src/app/(marketing)/courses/page.tsx#L63)

```tsx
<Link href="/register">View pricing</Link>
```

The button is labelled "View pricing" but routes to the registration page, not a pricing page. This is confusing and will frustrate users who want to compare plans before registering.

**Fix:** Change to `href="/subscriptions"` or a dedicated `/pricing` page if one exists.

---

## LOW

### 9. "Save" and "Share" buttons on the watch page are non-functional stubs
**File:** [src/app/(student)/watch/[lessonId]/page.tsx](src/app/(student)/watch/[lessonId]/page.tsx#L44)

The "Save" (bookmark) and "Share" buttons render and are clickable but have no `onClick` handlers — nothing happens when they are pressed. If this functionality is not planned imminently, the buttons should be hidden to avoid user confusion. If planned, they need implementation.

**Fix:** Either implement the handlers, or temporarily remove the buttons until the feature is built.

---

### 10. Avatar upload hover state is non-functional
**File:** [src/app/(student)/profile/page.tsx](src/app/(student)/profile/page.tsx#L82)

The profile avatar renders a camera icon on hover with `cursor-pointer` styling, implying the user can upload a photo. There is no `onClick` handler or file input attached. This creates a false affordance.

**Fix:** Either wire up a file input and upload endpoint, or remove the hover overlay until the feature is implemented.

---

### 11. `METRICS_BEARER_TOKEN` not enforced as required in production
**File:** [api/src/plugins/metrics.ts](api/src/plugins/metrics.ts#L156)

```ts
if (!env.METRICS_BEARER_TOKEN && env.NODE_ENV === "production") {
  logger.warn("METRICS_BEARER_TOKEN is not set in production — /metrics is OPEN");
}
```

In production the `/metrics` endpoint is only protected when `METRICS_BEARER_TOKEN` is set. Without it, any caller can scrape infrastructure metrics (DB pool sizes, queue depths, revenue counters). This is only a warning, not a startup failure.

**Fix:** Either change `METRICS_BEARER_TOKEN` in `env.ts` from `z.string().min(16).optional()` to required when `NODE_ENV === "production"` (fail fast on startup), or confirm the token is always set in the deployment environment.

---

### 12. Profile page "Save Changes" does not refresh the in-memory user context
**File:** [src/app/(student)/profile/page.tsx](src/app/(student)/profile/page.tsx#L24)

After `PATCH /me` (once that endpoint is added), `handleSaveProfile` shows a success toast but never calls `refreshUser()` from `useAuth()`. The user's name in the sidebar and any other places that read from auth context would remain stale until the next page reload.

**Fix:** After a successful `PATCH /me`, call `refreshUser()` to re-sync the auth context.

---

## INFO

### 13. Content Security Policy disabled on the API server
**File:** [api/src/plugins/security.ts](api/src/plugins/security.ts#L14)

`contentSecurityPolicy: false` is set in the Helmet config. The API server does not serve HTML, so this has limited practical impact. However, if the API ever returns inline content that a browser might render (e.g., in error pages or Swagger docs), the absence of CSP increases XSS risk. The frontend (Next.js) should have its own CSP headers configured separately.

---

### 14. CORS set to wildcard (`origin: "*"`)
**File:** [api/src/plugins/security.ts](api/src/plugins/security.ts#L20)

The comment explains this is intentional (`app uses JWT in Authorization header, no cookies`). Since no credentials are sent via cookies, the wildcard is technically safe. However it means any website can silently proxy API calls through a user's browser session. If a future feature ever adds cookie-based auth, this would become a high-severity issue.

**Recommendation:** When the production domain is stable, restrict to `process.env.CORS_ORIGINS` (already defined in `env.ts`) rather than `"*"`.

---

## What's working well

- **Auth security is solid:** Argon2id hashing, refresh-token rotation with reuse detection, per-family revocation, lockout policy, MFA for admins, timing-safe dummy hash for non-existent users.
- **Payment webhook is well-defended:** Signature verification, idempotency via unique event ID in DB, server-side amount verification against Paystack's `/verify` API, atomic DB transactions.
- **Rate limiting is properly layered:** Global limit (300/min), per-route limits on auth endpoints, Redis-backed so it works across instances.
- **Admin routes are properly gated:** All `/admin/*` routes require both `authenticate` + `requireRole('admin')` at the scope level.
- **Audit log coverage is thorough:** Every admin mutation (except testimonials — see issue #7) writes to the audit log.
- **NDPR compliance:** Data export and account deletion endpoints are implemented with correct data exclusions (no password hash, no MFA secret).
- **JWT handling:** Short-lived access tokens (15 min), opaque refresh tokens hashed with SHA-256 at rest, issuer/audience validation.
