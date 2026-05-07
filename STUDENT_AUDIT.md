# Student-Facing Audit — Catalogue & Dashboard

Audit performed: 2026-05-07
Scope: `src/app/(student)/catalogue/**` and `src/app/(student)/dashboard/**`

---

## Part 1 — Catalogue

### Architecture
4-level navigation, all wired to API correctly:
```
/catalogue            → pick exam (WAEC/NECO/UTME)
/catalogue/:exam      → pick stream (Sciences/Arts/Languages/Commercial/Trade)
/catalogue/:exam/:stream         → subjects in that stream
/catalogue/:exam/:stream/:subject → topics + lessons
```
Plus global search on `/catalogue`. Watch page at `/watch/:lessonId`.

### Findings

#### 🔴 High — fix before scaling

**1. Topic-row N+1 fan-out**
[src/app/(student)/catalogue/[exam]/[stream]/[subject]/page.tsx:115](src/app/(student)/catalogue/[exam]/[stream]/[subject]/page.tsx#L115)
Every `TopicRow` independently calls `useLessons(topic.id)`. A subject with 10 topics fires 10 parallel requests on mount. As content grows this thrashes the API and Postgres. Backend should add a `GET /catalogue/subjects/:id/topics-with-lessons` endpoint that returns nested structure in one query, or accordion-collapse topics so lessons load only when expanded.

**2. No JSS entry point**
The marketing site advertises "JSS 1-3, WAEC, NECO, JAMB" but only WAEC/NECO/UTME are exam types in the catalogue. JSS students have nowhere to land. Either add `JSS` as an exam type or remove the marketing claim.

**3. Exam param not validated server-side**
[src/app/(student)/catalogue/[exam]/page.tsx](src/app/(student)/catalogue/[exam]/page.tsx)
Accepts any string as `:exam` and renders the streams page. `/catalogue/asdf` shows the streams UI then dead-ends. Return 404 for unknown exams (the stream page below already does this).

#### 🟡 Medium — UX gaps

**4. Search misses lessons + topics**
Only subject names are searchable. A student searching "Geometry" or "Quadratic Equations" finds nothing. Add a backend endpoint that searches across lessons by title/tags.

**5. No watched/progress indication**
Returning students see the same list every time. No "Continue watching" surfaced here, no checkmark on completed lessons, no progress bar. The `progress` table tracks this server-side; just isn't surfaced.

**6. Locked vs accessible isn't pre-checked**
Paid lessons show a Lock icon but clicking still navigates to `/watch/:id` which then 403s. Pre-check subscription status and either grey out or open a paywall modal directly.

**7. Lesson rows have no thumbnail**
`lesson.thumbnailKey` is in the DTO but never rendered. Adding the thumbnail (sub-100KB cached image) makes the list visually scannable.

**8. No `subscribed` filter on lessons**
A subscriber can't filter "show me only what I have access to" or "show me only free previews".

**9. Streams hardcoded twice**
Both `[exam]/page.tsx` and `[exam]/[stream]/page.tsx` maintain their own `STREAMS` array. Drift risk when one updates and the other doesn't. Extract to a shared constant in `src/lib/streams.ts`.

**10. Stream/exam display inconsistencies with marketing**
Homepage filter pills mix subjects (Biology, Chemistry) with streams (Arts, Sciences). Catalogue groups everything under streams. Confusing transition from marketing → catalogue.

#### 🟢 Low — polish

**11. No pagination**
`useSubjects` doesn't pass `limit/offset`. Fine while content is small (a few dozen subjects). Worth adding before the catalogue grows.

**12. No breadcrumb on subject list**
`/catalogue/:exam/:stream` jumps back to home with the back button only. Should have breadcrumb like the subject detail page does.

**13. Difficulty labels**
"beginner/intermediate/advanced" doesn't map to Nigerian schooling. Consider mapping to "JSS / SS1 / SS2 / SS3 / Exam-ready" or letting admins pick a tag instead.

**14. No "New" badge on recently added lessons**
Easy DB query (`createdAt > 7d ago`), big psychological win for return visits.

**15. Empty states have no email-capture**
When a stream has no subjects, the empty state says "check back soon" but doesn't capture the user's email for a notification.

#### ℹ️ Info — solid choices already made

- Loading skeletons everywhere ✅
- Breadcrumb on subject detail ✅
- Free badge + Lock icon ✅
- Search debounced via `length >= 2` ✅
- Empty states with helpful copy + back link ✅
- Stale-time of 5 minutes — appropriate for catalogue data ✅
- URL casing normalized (`waec` → `WAEC`, `sciences` → `Sciences`) ✅

---

## Part 2 — Dashboard

### Architecture
Single page at [src/app/(student)/dashboard/page.tsx](src/app/(student)/dashboard/page.tsx). Three data sections + one decorative element:
- Welcome header + (decorative) "10k+ students" strip
- Continue Watching grid (real data via `useContinueWatching`)
- Subscription strip (real data via `useMySubscription`)
- Study Insights — 4 stat cards (3 real via `useCompletionStats`, 1 hardcoded)

### Findings

#### 🔴 High — credibility issues

**1. Hardcoded "240+ Total tutorials"**
[page.tsx:131](src/app/(student)/dashboard/page.tsx#L131)
Sitting next to three real stats, this lies to users. If you have 5 lessons in the DB, students still see "240+". Either query a real count from the API (`SELECT COUNT(*) FROM lessons WHERE status='ready' AND deleted_at IS NULL`) or remove the card.

**2. Hardcoded "Join 10k+ active students"**
[page.tsx:48](src/app/(student)/dashboard/page.tsx#L48)
Marketing-style social proof on a *logged-in* dashboard, where users would notice the lie immediately. Replace with something genuine ("Welcome to your 3rd day in a row" / "12 lessons this week" / their actual streak), or remove entirely.

**3. No subscription skeleton**
[page.tsx:81](src/app/(student)/dashboard/page.tsx#L81)
While `sub.isLoading`, the strip shows "No active plan" — then flashes to the real plan when data arrives. Active subscribers see a "no plan" message every page load. Add `{sub.isLoading ? <SubscriptionSkeleton /> : ...}`.

#### 🟡 Medium — UX gaps

**4. Continue-watching cards have no real thumbnail**
Just a gradient with a play icon. `lesson.thumbnailKey` exists in the API but isn't fetched/used. Real thumbnails make the section visually scannable and dramatically more engaging.

**5. No exam countdown**
Nigerian students prep against fixed dates (WAEC May, NECO June, JAMB April). A "47 days until WAEC" widget would be one of the highest-engagement features you can add. Drives daily return visits.

**6. No streaks / gamification**
"Hours studied: 12.3h" is a lifetime total. No daily streak, no weekly goal, no badges, no "watched 5 days in a row". Exam-prep platforms live or die on habit formation.

**7. No quick-nav shortcuts**
Dashboard has zero direct links to subjects. To reach Physics you click `Browse catalogue` → exam → stream → subject (4 hops). Add a "My subjects" or "Pick up where you left off" strip.

**8. Subscription CTA doesn't differentiate states**
"Manage plan" or "View plans" only. Doesn't handle: expired, trial-ending-soon, payment-failed, cancelled-but-still-active. An expired subscriber should see "Renew now" prominently, not a generic "Manage plan".

**9. Empty continue-watching could recommend lessons**
Shows "Browse catalogue" CTA but doesn't surface specific recommendations. A new user would benefit from "Try this free Biology lesson" instead of being told to navigate elsewhere.

**10. `firstName` fallback is "Scholar"**
Fine, but "Welcome back, Scholar" sounds like a bug to anyone with a name. If user.name is empty, just say "Welcome back" without the name.

#### 🟢 Low — polish

**11. "LIVE" badge on stat cards is decorative**
[page.tsx:251](src/app/(student)/dashboard/page.tsx#L251) shows "LIVE" tag on every stat card with no actual live behavior. Either link it to a detailed analytics view or remove.

**12. `formatHours(0)` returns "0m"**
But the loading fallback is "—". A genuinely-new user with 0 watch time will see "0m" not "—". Minor consistency thing — for new users, "—" or "Start watching" is more inviting than "0m".

**13. No time-of-day greeting**
"Welcome back" is identical at 9am and 11pm. "Good morning"/"Good afternoon"/"Good evening" feels more personal and is trivial to add.

**14. Continue-watching limit of 6 + 3-column grid**
Last row may show only 1–2 cards instead of filling. Either pull `limit=6` (fills exactly 2 rows of 3) or `limit=3` (1 row, with a "see all" link).

**15. No "recently added" / "what's new" section**
After uploading a lesson, students have to actively search for it. A "New this week" carousel between continue-watching and stats would surface fresh content.

**16. No notifications area**
No way to signal "new lesson in your subscribed subject" or "your sub renews in 3 days".

#### ℹ️ Info — solid choices already made

- Real progress data via dedicated `useContinueWatching` / `useCompletionStats` hooks ✅
- React Query 30s staleTime on progress (right balance for live data) ✅
- Skeletons on most sections ✅
- Empty-state copy adapts to subscription state ✅
- Date formatting uses `en-NG` locale ✅
- `formatHours` cleanly handles < 1h, < 10h, ≥ 10h ✅
- Animation staggering via `style.animationDelay` ✅
- Subscription strip copy adapts to `autoRenew` (Renews vs Ends) ✅
- Mobile bottom nav + top bar layout via `(student)/layout.tsx` ✅

---

## Combined Priority Recommendations

### Ship now (credibility, ~half day)
- **Dashboard #1** — Replace hardcoded "240+" with real lesson count (small backend endpoint + frontend swap)
- **Dashboard #2** — Kill or replace "Join 10k+ active students"
- **Dashboard #3** — Add subscription strip skeleton
- **Catalogue #3** — 404 on unknown exam types
- **Catalogue #9** — Extract shared `STREAMS` constant

### Next sprint (UX wins, 2–3 days)
- **Catalogue #1** — Solve topic-row N+1 (combined endpoint or accordion-collapse)
- **Catalogue #5 + Dashboard #4** — Real lesson thumbnails on rows + cards
- **Dashboard #5** — Exam countdown widget
- **Dashboard #7** — Quick-nav cards on dashboard
- **Catalogue #6** — Pre-check subscription state on locked lessons

### Future (engagement, multi-week)
- **Dashboard #6** — Streaks/gamification system
- **Catalogue #4** — Lesson + topic search
- **Dashboard #15 / Catalogue #14** — "New this week" surfacing
- **Catalogue #2** — JSS exam type or remove from marketing

### Open questions
- Are JSS students an actual target audience or marketing copy that drifted?
- What's the source of truth for "what counts as social proof" on the dashboard?
- Is there an existing notifications system anywhere we can reuse, or does that need a new module?
