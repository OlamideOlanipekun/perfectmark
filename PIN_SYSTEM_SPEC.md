# PIN Access System — Technical Specification

**Date:** 2026-05-14  
**Status:** Awaiting approval before implementation  
**Author:** Engineering (Claude Sonnet 4.6)

---

## 1. Overview

Replace the removed payment integration with a **PIN-based, class-level access model**. The admin generates batches of single-use 8-digit numeric PINs tied to a specific class level (e.g. SS1, JSS2), sells them offline (cash, bank transfer, WhatsApp, etc.), and students redeem a PIN at registration to unlock content **for that class level only**.

```
Admin generates PIN (with class level)  →  Admin sells PIN  →  Student registers with PIN  →  Student sees only their class level content
```

A student who registered with an SS1 PIN cannot access SS2, SS3, or any JSS content. Their class level is locked at registration by the PIN they use — they cannot change it themselves.

This means **zero payment gateway dependency** on the frontend or backend. The admin controls who gets access — and what level of access — by controlling which PIN they sell.

---

## 2. User Stories

| Role | Story |
|------|-------|
| Admin | I can generate a batch of PINs for a specific class level (e.g. SS1) from the admin dashboard |
| Admin | I can see all PINs — their code, class level, status, creation date, and which student used each one |
| Admin | I can copy a PIN code to clipboard or export all unused PINs to CSV for distribution |
| Admin | I can revoke a PIN that hasn't been used yet |
| Admin | I can search/filter PINs by status (unused / used / revoked) and by class level |
| Student | I enter my PIN during registration; if valid my account is created and I get access to my class level content only |
| Student | If I enter an invalid, already-used, or revoked PIN the form shows a clear error |
| Student | After registration, I cannot view lessons for class levels other than the one my PIN was issued for |

---

## 3. PIN Format

- **Length:** 8 digits
- **Charset:** digits `0–9` only
- **Display format:** grouped as `XXXX-XXXX` (cosmetic hyphen stripped before validation)
- **Example:** `4729-3816`
- **Generation:** cryptographically random — `Math.floor(Math.random() * 90_000_000) + 10_000_000` is **not** acceptable; use `crypto.randomInt(10_000_000, 99_999_999)` (Node) or equivalent CSPRNG on the backend
- **Collision probability:** 90,000,000 possible values — at scale (>10,000 PINs generated) the backend must check for uniqueness before inserting

---

## 4. Data Model

### `pins` table (backend)

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `code` | `varchar(8)` | Unique, digits only, no hyphens stored |
| `class_level` | `enum` | `JSS1` \| `JSS2` \| `JSS3` \| `SS1` \| `SS2` \| `SS3` — **required, set at generation time** |
| `status` | `enum` | `unused` \| `used` \| `revoked` |
| `created_by` | `uuid` FK → users | Admin who generated it |
| `used_by` | `uuid` FK → users \| null | Student who redeemed it |
| `used_at` | `timestamptz` \| null | When it was redeemed |
| `revoked_at` | `timestamptz` \| null | When it was revoked |
| `batch_label` | `varchar(80)` \| null | Optional admin note, e.g. "SS1 — May 2026 batch" |
| `created_at` | `timestamptz` | |

**Indexes:** `code` (unique), `class_level`, `status`, `created_by`, `used_by`

### How class level controls content access

When a student registers with a PIN, the backend writes `pin.class_level` onto their `users.class_level` field. Every subsequent request for protected content (stream, catalogue) checks `user.class_level` against the lesson/subject's `class_level` tag. If they do not match, the backend returns `403 Forbidden`.

> **Backend requirement:** Lessons and subjects must have a `class_level` field (or a mapping table) so the access gate knows what each piece of content belongs to. This is a backend schema concern — confirm with the backend team before implementation.

---

## 5. API Contract

All endpoints require a valid admin JWT (`Authorization: Bearer <token>`). The backend enforces `requireRole('admin')` independently of the middleware role hint.

---

### 5.1 Generate PINs

```
POST /admin/pins/generate
```

**Request body:**
```json
{
  "quantity": 10,
  "classLevel": "SS1",
  "batchLabel": "SS1 — May 2026 WhatsApp batch"   // optional
}
```

**Constraints:**
- `quantity` — integer between `1` and `500`, required
- `batchLabel` — string max 80 chars, optional

**Response `201`:**
```json
{
  "pins": [
    {
      "id": "uuid",
      "code": "47293816",
      "displayCode": "4729-3816",
      "classLevel": "SS1",
      "status": "unused",
      "batchLabel": "SS1 — May 2026 WhatsApp batch",
      "createdAt": "2026-05-14T10:00:00Z"
    }
    // ... more pins
  ],
  "count": 10
}
```

---

### 5.2 List PINs

```
GET /admin/pins?page=1&limit=50&status=unused&search=4729
```

**Query params:**

| Param | Type | Default | Notes |
|-------|------|---------|-------|
| `page` | int | `1` | |
| `limit` | int | `50` | max `200` |
| `status` | string | (all) | `unused` \| `used` \| `revoked` |
| `classLevel` | string | (all) | `JSS1` \| `JSS2` \| `JSS3` \| `SS1` \| `SS2` \| `SS3` |
| `search` | string | — | Matches against PIN code prefix |

**Response `200`:**
```json
{
  "pins": [
    {
      "id": "uuid",
      "code": "47293816",
      "displayCode": "4729-3816",
      "classLevel": "SS1",
      "status": "unused",
      "batchLabel": "SS1 — May 2026 batch",
      "createdAt": "2026-05-14T10:00:00Z",
      "usedAt": null,
      "usedBy": null
    },
    {
      "id": "uuid",
      "code": "61054827",
      "displayCode": "6105-4827",
      "classLevel": "JSS2",
      "status": "used",
      "batchLabel": null,
      "createdAt": "2026-05-10T08:00:00Z",
      "usedAt": "2026-05-12T14:22:00Z",
      "usedBy": {
        "id": "uuid",
        "name": "Amara Okonkwo",
        "email": "amara@example.com"
      }
    }
  ],
  "total": 142,
  "page": 1,
  "limit": 50
}
```

---

### 5.3 Revoke a PIN

```
DELETE /admin/pins/:id
```

Only succeeds if the PIN's current status is `unused`. Attempting to revoke a `used` or already-`revoked` PIN returns `409 Conflict`.

**Response `200`:**
```json
{
  "pin": {
    "id": "uuid",
    "code": "47293816",
    "status": "revoked",
    "revokedAt": "2026-05-14T11:00:00Z"
  }
}
```

---

### 5.4 PIN Validation at Registration (existing endpoint, updated)

```
POST /auth/register
```

The existing register endpoint already accepts a `pin` field. The backend must:

1. Strip the hyphen and look up the PIN by `code`.
2. If not found → `400` with `code: "INVALID_PIN"`, message: `"Invalid access PIN."`
3. If `status === "used"` → `400` with `code: "PIN_ALREADY_USED"`, message: `"This PIN has already been used."`
4. If `status === "revoked"` → `400` with `code: "PIN_REVOKED"`, message: `"This PIN is no longer valid."`
5. If valid:
   - Create the user account
   - **Set `user.class_level = pin.class_level`** — the PIN determines the student's class, not what they typed in the form
   - Mark the PIN as `used`, set `used_by = new_user.id`, `used_at = now()`
   - All in a **single DB transaction**

**The PIN check and user creation must be a single DB transaction** to prevent race conditions where two concurrent registrations could both validate the same PIN before either marks it used.

> **Note on the `classLevel` field in the register form:** The student still sees and selects a class level in the UI (for UX clarity), but the backend **ignores** the submitted `classLevel` and instead uses `pin.class_level` as the authoritative value. This prevents a student from mismatching their form selection against the PIN they purchased.

---

## 6. Frontend — Admin Pages

### 6.1 New route: `/admin/pins`

A single page with two panels:

**Left panel — Generate PINs:**
- Dropdown: "Class level" — required, options: JSS1 / JSS2 / JSS3 / SS1 / SS2 / SS3
- Number input: "How many PINs?" (1–500, default 10)
- Text input: "Batch label" (optional, auto-suggested as e.g. "SS1 — May 2026")
- "Generate" button → calls `POST /admin/pins/generate`
- On success: shows the newly generated PINs in a copyable list with a "Copy all" button and a "Download CSV" button

**Right panel — All PINs table:**
- Filter row: Status tabs (All / Unused / Used / Revoked) + Class level dropdown (All / JSS1 / JSS2 / JSS3 / SS1 / SS2 / SS3)
- Search box (by PIN code)
- Paginated table columns: PIN Code | Class Level | Status | Batch Label | Created | Used By | Used At | Actions
- "Copy" icon per row (copies `displayCode` to clipboard)
- "Revoke" button per unused PIN (with confirmation)
- Summary stat at top: X unused · Y used · Z revoked

---

### 6.2 Admin Sidebar update

Add the Pins entry to the admin nav:

```
/admin/pins   label: "PIN Codes"   icon: KeyRound
```

Remove the stale `/admin/pricing` entry that was left behind from the payment removal.

---

### 6.3 Register form — PIN field UX improvements

The field already exists. Required changes:
- Update Zod schema from `z.string().min(4)` to `z.string().regex(/^\d{4}-?\d{4}$/, "Enter your 8-digit PIN")` — digits only, hyphen optional
- Auto-format input as `XXXX-XXXX` while typing (insert hyphen after 4th digit; cosmetic only, stripped before submission)
- `inputMode="numeric"` on the input element so mobile shows the number keyboard
- On `INVALID_PIN` / `PIN_ALREADY_USED` / `PIN_REVOKED` error codes from the API, surface a specific field-level error rather than a generic toast

---

## 7. Frontend — Hooks & Lib

New file: `src/hooks/use-pins.ts`
- `useAdminPins(filters)` — React Query hook for `GET /admin/pins`
- `useGeneratePins()` — mutation for `POST /admin/pins/generate`
- `useRevokePin()` — mutation for `DELETE /admin/pins/:id`

New file: `src/lib/pins.ts`
- `adminPins.list(params)` — typed API wrapper
- `adminPins.generate(body)` — typed API wrapper
- `adminPins.revoke(id)` — typed API wrapper
- `formatPinDisplay(code: string): string` — `"47293816"` → `"4729-3816"`
- `normalisePinInput(input: string): string` — strips hyphens/spaces, keeps only digits

---

## 8. Types to add to `src/types/index.ts`

```ts
export type PinStatus = "unused" | "used" | "revoked";
export type ClassLevel = "JSS1" | "JSS2" | "JSS3" | "SS1" | "SS2" | "SS3";

export interface Pin {
  id: string;
  code: string;
  displayCode: string;
  classLevel: ClassLevel;
  status: PinStatus;
  batchLabel: string | null;
  createdAt: string;
  usedAt: string | null;
  usedBy: { id: string; name: string; email: string } | null;
}

export interface GeneratePinsResponse {
  pins: Pin[];
  count: number;
}

export interface PinsListResponse {
  pins: Pin[];
  total: number;
  page: number;
  limit: number;
}
```

---

## 9. Security Considerations

| Risk | Mitigation |
|------|-----------|
| PIN brute-force at registration | Backend rate-limits `/auth/register` per IP (already assumed present); each failed PIN attempt counts toward that limit |
| Race condition — two users register with same PIN simultaneously | PIN check + user creation in a single DB transaction with a `SELECT ... FOR UPDATE` or unique constraint on `used_by` |
| Admin generates unlimited PINs to probe system | `quantity` capped at 500 per request; rate limit on the generate endpoint |
| PIN leaked in server logs | Ensure backend does not log the raw PIN value in request body logs |
| Admin page accessible by non-admins | Middleware role-hint redirect + backend `requireRole('admin')` on every `/admin/pins/*` call |
| PIN codes guessable | 90,000,000 possible 8-digit values; feasible to brute-force without rate limiting — **backend must enforce strict rate limiting on `/auth/register`** (e.g. 5 attempts per IP per minute) |

---

## 10. CSV Export Format

When the admin clicks "Download CSV" after generating (or from the table), the file contains:

```
PIN,Class Level,Status,Batch Label,Created At,Used By,Used At
4729-3816,SS1,unused,SS1 — May 2026 batch,2026-05-14T10:00:00Z,,
6105-4827,JSS2,used,,2026-05-10T08:00:00Z,Amara Okonkwo,2026-05-12T14:22:00Z
```

CSV is generated **client-side** (no extra endpoint) from the data already in the React Query cache using a `Blob` + `URL.createObjectURL` pattern.

---

## 11. Implementation Checklist

**Backend (out of scope for this ticket — hand to backend team):**
- [ ] Create `pins` table migration
- [ ] `POST /admin/pins/generate` endpoint
- [ ] `GET /admin/pins` endpoint with pagination + filters
- [ ] `DELETE /admin/pins/:id` revoke endpoint
- [ ] Update `POST /auth/register` to validate PIN atomically
- [ ] Rate limiting on generate + register endpoints
- [ ] Unit tests for PIN validation edge cases (used, revoked, race condition)

**Frontend (this repo — pending approval):**
- [ ] Add `PinStatus`, `Pin`, `GeneratePinsResponse`, `PinsListResponse` to `src/types/index.ts`
- [ ] Create `src/lib/pins.ts` with API wrappers and format helpers
- [ ] Create `src/hooks/use-pins.ts` with three React Query hooks
- [ ] Create `src/app/(admin)/admin/pins/page.tsx` (generate panel + table)
- [ ] Update `src/components/layout/admin-sidebar.tsx` — replace stale `/admin/pricing` with `/admin/pins`
- [ ] Update `src/components/layout/nav-items.ts` — same replacement
- [ ] Update `src/components/auth/register-form.tsx` — auto-format PIN input + specific error codes
- [ ] Update `src/middleware.ts` matcher — no change needed (PIN page is under `/admin/*`, already covered)

---

## 12. Out of Scope (for now)

- PIN expiry dates (can be added later as an optional `expires_at` column)
- Upgrading a student's class level after registration (admin would need to manually update the user record)
- Student self-service PIN top-up (no payment gateway)
- Bulk import of externally-generated PINs
- Email delivery of PINs to students (admin handles distribution offline)
- Cross-class-level access (a student is always locked to exactly one class level)

---

*This document is a specification only. No code has been written. Awaiting client sign-off before implementation begins.*
