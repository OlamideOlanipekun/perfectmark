# Mock Data Audit — Frontend

**Date:** 2026-05-06
**Scope:** `c:\Users\Olamide\Desktop\perfectmark\src`
**Status:** 6 categories of hardcoded data identified

---

## Priority Legend

- 🔴 **Urgent** — misleading or potentially deceptive content (regulatory risk)
- 🟡 **High** — visible to all users, affects credibility
- 🟢 **Low** — internal/easy to live with for now

---

## Issues

### 1. 🔴 Inflated Platform Statistics

Hardcoded "social proof" numbers appear in **4 separate files** and claim metrics the platform has not yet earned. Risk: misleading advertising, especially if a Nigerian regulator (CPC, ARCON) reviews the site.

| File | Line | Claim |
|---|---|---|
| [src/components/marketing/features.tsx](src/components/marketing/features.tsx#L45) | 45–51 | 10,000+ Active Students, 2,000+ Video Lessons, 250+ Expert Tutors, 98% Pass Rate |
| [src/components/marketing/hero.tsx](src/components/marketing/hero.tsx#L207) | 207–225 | 2K+ Videos, 10K+ Students, 250+ Tutors |
| [src/app/(marketing)/about/page.tsx](<src/app/(marketing)/about/page.tsx#L141>) | 141–151, 219–236 | 10K+ Active Students, 98% success rate, 2,000+ video lessons |
| [src/app/(marketing)/courses/page.tsx](<src/app/(marketing)/courses/page.tsx#L13>) | 13–18 | 2,000+ courses, 18+ subjects, 4 levels, 250+ tutors |

**Action:** Choose one path:
- **A) Remove the numbers entirely.** Replace with qualitative copy ("Join Nigeria's newest exam prep platform", "Expert-led WAEC, NECO, JAMB tutorials").
- **B) Use honest numbers.** Show actual counts (could literally be `1` student to start).
- **C) Add a backend stats endpoint** (`GET /stats/public` returning `{ students, lessons, tutors }`) and pull live values via SWR. The pass rate cannot be fabricated — only show it once real graduating cohort data exists.

---

### 2. 🟡 Fake Testimonials

5 fabricated student reviews with stock-photo avatars from `i.pravatar.cc`.

- File: [src/components/marketing/testimonials.tsx:11-62](src/components/marketing/testimonials.tsx#L11)

**Action:** Remove the section entirely until real testimonials are collected, OR add a backend `testimonials` table + admin UI to manage them. Never publish testimonials attributed to people who don't exist.

---

### 3. 🟡 Fake Course Grid

18 fabricated courses with invented view counts (2.6K–5.1K), student counts (250–1.5K), ratings (4.4–4.9), instructor names, and durations.

- File: [src/components/marketing/course-grid.tsx:47-72](src/components/marketing/course-grid.tsx#L47)

**Action:** Replace with the existing `useFreeLessons()` hook (already used correctly in `course-showcase.tsx`). Show a tasteful empty state ("Lessons coming soon — be the first to enrol") if the catalogue is empty.

---

### 4. 🟡 Fake Tutor Profiles

6 fabricated tutors with names like "Mr. Adebayo Okafor" and invented credentials ("15 years experience, 48 lessons").

- File: [src/app/(marketing)/tutors/page.tsx:13-80](<src/app/(marketing)/tutors/page.tsx#L13>)

**Action:** Either:
- Hide the page from navigation until real tutors are onboarded, OR
- Build a `tutors` schema on the backend with admin CRUD, then fetch via `GET /tutors/public`.

---

### 5. 🟢 FAQ Page (Hardcoded but Real)

16 FAQ items across 4 categories. Content appears genuine, just not CMS-managed.

- File: [src/app/(marketing)/faq/page.tsx:9-43](<src/app/(marketing)/faq/page.tsx#L9>)

**Action:** Acceptable as-is. Only revisit if you want non-developers to edit FAQs without redeploying.

---

### 6. 🟢 Contact Page FAQ Duplicates

4 FAQs duplicated from the main FAQ page — risk of drift if one is updated and the other isn't.

- File: [src/app/(marketing)/contact/page.tsx:44-61](<src/app/(marketing)/contact/page.tsx#L44>)

**Action:** Either import the same data array from a shared module, or remove the duplicate and link to the main FAQ page.

---

## Already Correct ✓

These are already wired to the API and need no changes:

- Course showcase — uses `useFreeLessons()` → [src/components/marketing/course-showcase.tsx](src/components/marketing/course-showcase.tsx)
- Subscription plans — uses `usePlans()` → [src/app/(student)/subscriptions/page.tsx](<src/app/(student)/subscriptions/page.tsx>)
- Admin pricing — fetches `/admin/billing/plans` → [src/app/(admin)/admin/pricing/page.tsx](<src/app/(admin)/admin/pricing/page.tsx>)

---

## Recommended Order of Work

1. **Today:** Strip inflated stats (#1) — pure copy edit, no backend work.
2. **Today:** Remove fake testimonials section (#2) until real ones exist.
3. **This week:** Replace course-grid with `useFreeLessons` (#3).
4. **This week:** Hide tutors page from nav until onboarding flow exists (#4).
5. **Backlog:** Build tutors backend module + public testimonials.
6. **Backlog:** Move FAQs to a CMS or DB-backed table.

---

## Backend Endpoints to Add (Eventually)

| Endpoint | Purpose | Priority |
|---|---|---|
| `GET /stats/public` | Live student/lesson/tutor counts | Low (only if you keep stats on the page) |
| `GET /testimonials` | Public-facing reviews | Medium |
| `GET /tutors/public` | Tutor profiles for marketing page | Medium |
| `GET /faqs` | CMS-style FAQ list | Low |
