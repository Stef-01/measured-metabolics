# Measured Metabolics — UI Polish 10-Week Plan

> **Status:** Approved 2026-05-22 · execution scheduled · all 10 game-changer features committed · Feature #11 Billing Intelligence (phased) added 2026-05-22
> **Companion to:** `docs/planning.md` (Stages 1–8) · `docs/plans/patient-detail-nutrium.md` (Patient Detail v2)
> **North star:** Measured should look — and feel — like a product Apple's Health team would ship. Less blocky, more typographic, more photographic, more motion that earns its keep. Nothing on-screen unless it carries weight.
> **Non-goals:** No new clinical surfaces. No backend reshape. No design system from scratch. We are _polishing_ the existing surfaces, not reinventing them. The 10 AI features layer on top of the existing Stage 6 safety / audit / RLS infrastructure — they do not reshape it.

---

## Why this plan exists

Stages 1–8 produced a **functionally complete v1.0.0**: three personas, AI safety gates, RLS, audit, PDF reports, telemetry — all the muscle. The visual layer is honest but reads as **vibe-coded**: rectangular cards, equal weights everywhere, emoji where photographs belong, motion only at page-edges.

Apple-grade minimalism is not "fewer features" — it's **fewer competing voices on the page** at any moment. One heading speaks, one action invites, one photograph carries the room, the rest is whitespace. This plan walks every surface in turn and brings it to that bar.

---

## The four design moves

Every week's work refers back to these four moves. If a change doesn't advance one of them, we don't make it.

**1. Typography does the work, not the box.**
Replace card-heavy layouts with typographic hierarchy. Hairline 1px borders only when they earn their pixel. Depth via shadow + soft tint, not borders.

**2. Photography over decoration.**
A real meal photograph beats an emoji every time. A clean kitchen image is calmer than a coloured chip. Photography is data — the meal _is_ its picture, not a label.

**3. Motion carries meaning.**
Spring physics on every state change, not just route boundaries. `cubic-bezier(0.16, 1, 0.3, 1)` for "ease-out-expo" — the curve Apple uses on every dismiss, every modal, every drawer.

**4. One voice per screen.**
A screen has one heading, one primary action, one moment of photography, and a quiet rail of secondary actions. If two things are shouting, we pick.

---

## Architectural transitions

### Design tokens (Week 1 lands these; rest of plan consumes them)

| Token group    | Current                    | After Week 1                                                     |
| -------------- | -------------------------- | ---------------------------------------------------------------- |
| Type scale     | 11–34px adhoc              | Modular scale 11/12/13/14/15/17/20/24/28/34/44/56                |
| Type — display | `font-serif` everywhere    | Display = serif, body = system, micro-label = SF-Mono fallback   |
| Borders        | 1px solid border default   | Hairline `0.5px` on retina via `border-image`; soft-tint cards   |
| Shadows        | `--shadow-card`, `-raised` | + `--shadow-floating`, `--shadow-popover`, `--shadow-modal`      |
| Radii          | 12 / 16 / 24 px            | 14 / 20 / 28 px (rounder = friendlier, per Apple HIG)            |
| Motion         | `easeOut` / `spring`       | `--ease-out-expo`, `--ease-in-out-quart`, `--spring-default`     |
| Photography    | none                       | `<Photo>` primitive: blur-up, lazy, `aspect-ratio`, alt-required |
| Empty states   | Plain text                 | Illustration or photograph + 1-line copy + 1 secondary action    |

### File-level scope

```
src/
  app/globals.css                ← + design tokens, motion vars, hairline mixin
  components/ui/
    photo.tsx                    ← NEW: <Photo /> primitive (blur-up, aspect, alt)
    section-header.tsx           ← NEW: typographic section header (eyebrow + display)
    hairline.tsx                 ← NEW: <hr> replacement that snaps to 0.5px on retina
    empty-state.tsx              ← NEW: photo/illustration + copy + secondary action
    chip.tsx                     ← refactor: thinner, hairline border, no shadow
    surface-card                 ← (already exists in CSS) restyle: tint over border
  components/patient/screens/    ← Weeks 3–4 polish pass
  components/dietitian/screens/  ← Weeks 5–7 polish pass (incl. CGM glance Week 7)
  components/gp/cards/           ← Week 8 polish pass
  app/admin/                     ← Week 9 polish pass
  components/shared/motion.tsx   ← NEW: shared layout transitions, page enter/exit
public/images/
  meals/, hero/, personas/       ← already seeded; expand by 20 images Week 2
  empty-states/                  ← NEW: 8 illustrations / photographs for empty UIs
```

### Acceptance bar (every week)

- Lighthouse Performance ≥ 95, Accessibility ≥ 100 on the touched surfaces.
- No layout shift > 0.05 CLS introduced.
- 60fps on iPhone 12 / mid-tier Android during all primary interactions.
- All photography lazy-loaded, blur-up placeholder, `<Photo>` primitive only.
- All decorative photography has `alt=""` and `aria-hidden`. All meaningful photography has descriptive alt text.
- Reduced-motion pref (`prefers-reduced-motion`) respected everywhere — springs collapse to opacity fades.

---

## Bulletproof framework — every AI feature must pass

Every game-changer feature in this plan ships **only after** passing all 15 of the checks below. The checklist is enforced at the end of the feature's week (Loop B / Thu) and re-verified at Sat smoke. If any item is red, the feature stays behind its feature flag — the surrounding polish work still ships, but the feature itself does not flip on for users until the gate is green.

This framework exists for one reason: a clinical product cannot have an AI feature that _sometimes_ misfires. The compounding cost of one bad output (lost trust, audit incident, regulatory exposure) is higher than the value of ten good outputs. We gate aggressively.

| #   | Gate                          | Where it lives                                                                                                     | Who fails it                                                      |
| --- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| 1   | Zod schema with audit triplet | New schema in `src/ai/schemas.ts` extends `confidence_score` + `requires_human_review` + `safety_flags`            | A worker that emits raw LLM JSON without parsing                  |
| 2   | `applySafety()` gate          | `src/ai/safety.ts` — confidence < `CONFIDENCE_THRESHOLD` (0.7, raised to 0.9 in calibration mode) hides the output | A worker that persists/emits before calling `applySafety()`       |
| 3   | `LLMUnconfiguredError` path   | Worker catches and returns a static fallback                                                                       | A surface that crashes when `OPENAI_API_KEY` is unset (vibe mode) |
| 4   | `recordAudit()` invocation    | `src/server/audit.ts` — every AI invocation writes an `audit_events` row                                           | An untracked invocation                                           |
| 5   | RLS leakage test              | `tests/permissions/<feature>.test.ts` proves no cross-patient access path                                          | Any feature that joins across patient_id without an RLS check     |
| 6   | Cost cap                      | Upstash counter `cost:{patient_id}:{feature}:{yyyymmdd}` checked before LLM call                                   | A feature that calls the LLM unconditionally on every render      |
| 7   | Idempotency key               | `feature:resource_id:resource_updated_at` — identical key inside cache TTL skips the LLM call                      | A feature that re-bills on every retry                            |
| 8   | Cache TTL chosen + documented | TTL stated in the per-feature spec below                                                                           | A feature without a stated TTL                                    |
| 9   | Reduced-motion respected      | Playwright run with `prefers-reduced-motion: reduce` proves springs collapse                                       | A feature that animates when the user asked us not to             |
| 10  | Keyboard accessible           | Every interaction reachable in ≤ 2 keystrokes; focus trap on popovers; Escape closes                               | A mouse-only interaction                                          |
| 11  | Screen-reader announcements   | `aria-live="polite"` on dynamic content; descriptive labels on icons                                               | A feature that updates DOM silently                               |
| 12  | Eval gate ≥ 90%               | Labeled set of ≥ 30 cases scored by Maya (clinical) or Stefan (product); results in `docs/evals/*.md`              | A feature flipped on without an eval pass                         |
| 13  | Visual regression snapshot    | `@playwright/test` `toHaveScreenshot()` baseline committed                                                         | A feature whose UI silently changes between runs                  |
| 14  | User-side reversibility       | One-tap dismiss, "not interested", or undo                                                                         | A feature that pushes content with no escape hatch                |
| 15  | Telemetry registered          | New event added to `src/lib/analytics/events.ts` registry; named in the feature's spec                             | A feature we can't measure adoption / abandonment for             |

**One-line rule:** if a feature would fail any of 1–15 in production, it does not flip on. The polish work around it still ships — the feature lives behind its flag until the gate is green.

---

## Recursive testing layer (on top of the existing build / test / fix / smoke rhythm)

The existing **Loop A (Mon–Wed build) → Loop B (Thu test) → Loop C (Fri fix) → Loop D (Sat smoke)** rhythm carries forward unchanged. The bulletproof framework adds four obligations on top, each tied to a specific loop day:

1. **Eval gate (Thu, Loop B):** every new AI feature has its labeled eval set scored. Results live in `docs/evals/wk-NN-<feature>.md`. Pass rate < 90% → feature flag stays off, week is allowed to ship the surrounding polish but the feature itself defers to a fix-pass week (see Sun overflow).
2. **Cost ceiling exercise (Fri, Loop C):** the Friday fix-pass includes one deliberate test that exercises the Upstash cost cap — i.e., simulate the patient hitting the daily budget and verify the surface degrades gracefully (cached output, static fallback, or a clear "rate-limited, try again tomorrow" message).
3. **Audit assertion (Sat, Loop D):** Saturday smoke includes a SQL probe (`SELECT count(*) FROM audit_events WHERE actor_user_id = $demo AND created_at > NOW() - INTERVAL '1 day' AND event_type LIKE '<feature>.%'`) that proves the demo path wrote at least one audit row.
4. **Sun overflow rule:** if Loop B (Thu) surfaces ≥ 3 acceptance failures _or_ the eval gate fails, the week extends to Sun for an additional fix pass. If any week overruns by > 1 day twice, we add an explicit **W11 buffer** week before Week 10 ships. Default plan stays 10 weeks; the buffer is contingency, not committed.

### Dual-track weeks

Weaving 10 features into the existing 10 polish weeks means several weeks now run two parallel build tracks: the **polish track** (the original surface work) and the **feature track** (the new AI feature). The dual-track weeks are **W3, W4, W6, W7, W8, W9** — explicitly called out at the top of each affected week. The convention:

- **Polish track owns Mon–Tue.** Surface polish is the foundation; features land on top.
- **Feature track owns Wed–Thu.** Build the worker / engine / surface, run eval gate Thu.
- **Loop C (Fri)** pulls from both tracks; whichever is redder is fixed first.
- **Loop D (Sat)** smokes both. If only one track is green, the green one ships, the red one defers to W11.

### Cost ceiling — concrete numbers

For sanity, here is the projected daily LLM spend at pilot scale (50 patients, 1 dietitian, 4 meals/day):

| Feature                  | Invocations/patient/day              | Cache hit rate (target) | Net LLM calls/day  | Notes                                              |
| ------------------------ | ------------------------------------ | ----------------------- | ------------------ | -------------------------------------------------- |
| #1 Meal micro-improver   | up to 4 hovers/meal × 4 meals = 16   | 95%                     | ~ 40 / 50 patients | 7d cache, idempotent on `meal_id:updated_at`       |
| #2 Kitchen scanner       | ~ 0.3 (occasional)                   | 0%                      | ~ 15               | Scans are unique; 1h cache on photo SHA            |
| #3 Same-as similarity    | 0 (pure-logic, pgvector cosine)      | n/a                     | 0                  | Embedding generated by #1's existing meal-vision   |
| #4 Voice symptom parser  | ~ 0.2 (a few/week)                   | 0%                      | ~ 10               | Whisper + Claude per recording; raw audio 30d TTL  |
| #5 Ingredient swapper    | ~ 1 / dietitian-touched-meal         | 80%                     | ~ 10               | 30d cache on `(food, cuisine, restrictions_hash)`  |
| #6 GP briefing           | 1 per GP card open                   | 95%                     | ~ 5                | 24h cache, invalidated by triggers                 |
| #7 Cuisine-fit matcher   | 0 (pure-logic, deterministic)        | n/a                     | 0                  | Engine-only; no LLM                                |
| #8 Meal lesson composer  | 1 per approved meal                  | 100% (forever)          | ~ 50               | Per-meal-id forever; only newly-approved meals run |
| #9 Calibration threshold | 0 (raises threshold; not a new call) | n/a                     | 0                  | Configures #1, #5, #8 — no extra calls             |
| #10 Weekly photograph    | 1 / patient / week                   | 100% (per ISO-week)     | ~ 7 / day          | Sunday cron; idempotent per (patient, ISO-week)    |
|                          |                                      |                         | **~ 137 / day**    |                                                    |

At GPT-4o-mini structured-output rates (~ $0.0015 per call avg), that is **~ $0.21/day for the entire 50-patient pilot**, or **~ $6/month**. The Upstash counters exist not to control spend but to detect anomalies (a runaway worker, a cache miss storm, a malicious request).

> Each week follows the same recursive cadence we used in Stages 1–8: **build Mon–Wed, test Thu, fix Fri, smoke-test on Sat**. Exit gate at the end of each week.

---

### Week 1 · Design tokens + motion language + Photo primitive

> Foundation week. Nothing visible to the user until Week 2, but every later week consumes this.

**Mon** — Audit existing tokens. Catalogue every literal color / radius / shadow used anywhere. Land the new scale in `globals.css` behind a feature flag.
**Tue** — Motion vars (`--ease-out-expo`, `--spring-default`) + Framer Motion config helper.
**Wed** — `<Photo>` primitive: aspect-ratio container, `next/image` under the hood, dominant-color blur-up, optional caption slot, optional crop hint.
**Thu** — Light pass test: visually diff the existing surfaces against the new tokens with the flag on, snapshot any regressions.
**Fri** — Promote tokens (drop the flag), fix regressions, write `docs/design/tokens.md`.
**Sat** — Smoke: build + lint + 174 tests + 33 routes still 200.

**Exit gate:** New tokens live in `globals.css`. `<Photo>` primitive ships with Storybook-style page at `/dev/components/photo`. Lighthouse on `/p/home` ≥ 95.

---

### Week 2 · Photography system expansion

**Mon** — Expand the photography library: 12 → 32 images. Add 8 portraits for personas, 8 empty-state illustrations, 4 abstract gradient backdrops.
**Tue** — `mealImageFor()` and `mealImageBySlug()` get a third resolver: `mealImageForFoods(foods)` — picks based on the _contents_ of an AI vision result, not the slug.
**Wed** — Lazy-load + blur-up across all existing meal queue thumbnails.
**Thu** — Empty-state pass: every `<EmptyState>` in the codebase gets an illustration or photograph.
**Fri** — Image registry test: every path in `src/lib/images.ts` resolves to a real file.
**Sat** — Smoke + Lighthouse.

**Exit gate:** 0 emoji-only thumbnails left in the patient PWA, dietitian queue, or recipe pages. All empty states have a visual.

#### Feature spec — #10 Weekly photograph card · pipeline scaffold

> The full delivery (Sunday cron + push) lands in W10. This week scaffolds the offline-renderable composition pipeline so W10 only has to wire the cron and the push. Splitting it gives us a 6-week eval window for the visual quality of the rendered card.

| Field           | Value                                                                                                                                                                                                                                                                             |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Surface         | Renderable React component `MealCollage` (1080 × 1920 portrait PNG). Preview page at `/dev/components/meal-collage` shows live previews against demo cohort data.                                                                                                                 |
| Engine          | `src/lib/engine/meal-of-week.ts` — pure-logic. `mealOfWeek(meals, cgm, approvals)` returns the highest-scoring meal of the past 7 days. Score = `cgmStability * 0.4 + dietitianApprovalSpeed * 0.2 + macroBalance * 0.2 + visualQuality * 0.2`. Deterministic, fully unit-tested. |
| Composition     | `src/lib/imagegen/meal-collage.tsx` — `satori` SVG → `@resvg/resvg-js` PNG. Reuses `<Photo>` primitive's blur-up dominant-color. 4-photo collage layout: hero meal top, three smaller below, one-line lesson sentence overlaid.                                                   |
| Sentence source | Reuses **#8 meal-lesson-composer** worker prompt with a `weekly_summary` variant (composes "this week" copy from the selected meal's lesson + the patient's time-in-range delta).                                                                                                 |
| Schema          | `MealOfWeekSchema = z.object({ pickedMealId: z.string(), score: z.number(), breakdown: z.object({ cgmStability, dietitianApprovalSpeed, macroBalance, visualQuality }), candidatePool: z.array(z.string()).max(7) })` (engine output, no LLM in this week).                       |
| Cache           | Output keyed `weekcard:{patient_id}:{iso_week}`. Idempotent re-runs (e.g. retried cron) return the same PNG bytes.                                                                                                                                                                |
| Idempotency     | `(patient_id, iso_week)` — same week, same patient, same selection (selection function is deterministic given the week's data).                                                                                                                                                   |
| Fallbacks       | Zero approved meals this week → emit no card; the W10 delivery worker sends a one-line nudge instead. PNG generation fails → fall back to first meal photo + sentence as a single-image card.                                                                                     |
| Eval            | `docs/evals/wk-02-weekly-card.md` — render the past 6 weeks for the 5-patient demo cohort (30 cards). Hand-review for visual quality (typography, photo crop, contrast). Pass if ≥ 27/30 are "would screenshot and share."                                                        |
| Audit           | This week is engine-only — no audit yet. W10 adds `weekly_card.generated`, `weekly_card.viewed`, `weekly_card.shared`.                                                                                                                                                            |
| RLS             | Engine reads only `meals.where(patient_id = $self)`. RLS test: `tests/permissions/weekly_card.test.ts` proves a patient cannot see another patient's card bucket path.                                                                                                            |
| Telemetry       | `weekly_card_rendered` (engine), `weekly_card_render_failed` (with error class).                                                                                                                                                                                                  |
| A11y            | The PNG ships with an alt-text generated alongside it: "Your week in food: {meal_name} on {weekday}, plus {n} other meals."                                                                                                                                                       |

**Failure points to watch:**

1. **Visual quality regression.** A future change to `<Photo>` blur-up or `satori` font-loading silently breaks the rendered card. **Mitigation:** Playwright visual regression (`toHaveScreenshot()`) against 3 baseline weeks of the demo cohort. Fails the build on > 0.1% pixel diff.
2. **Photo crop disasters.** Auto-cropping a tall portrait into a square hero crops the food out. **Mitigation:** every meal photo in `public/images/meals/` has a `focalPoint` field in `src/lib/images.ts` (default `center`); compositions respect it.
3. **Selection stability.** The score is deterministic but sensitive to noisy CGM data. **Mitigation:** the `cgmStability` term smooths over a 24h window, not the meal moment. Documented in the engine.
4. **Locale/RTL.** Sentence overlay uses LTR-only fonts in scaffold; W10 swaps to a font stack with Arabic/Devanagari fallbacks before flipping the feature.
5. **"Best meal" feels arbitrary.** If two meals score within 0.05, the card states "one of your best this week" instead of "your best." Tone-tested as part of the eval.

**Recursive testing for this scaffold:**

- **Loop A:** build engine + composition; preview page; baseline screenshots committed.
- **Loop B:** unit tests for `mealOfWeek` (deterministic given fixture); visual regression against the 30 cards in the eval.
- **Loop C:** fix anything Loop B surfaces; if visual regression baseline disagrees with hand-review, re-baseline (not the other way round).
- **Loop D:** smoke includes `pnpm exec satori-test` (renders 5 cards, asserts file > 50KB, dimensions 1080×1920) plus the standard build+lint+tests+routes.

---

### Week 3 · Patient PWA polish — Home, Meal, Plan · **DUAL-TRACK**

> **Polish track (Mon–Tue):** `/p/home` and `/p/meal` surface polish.
> **Feature track (Wed–Thu):** ship **#2 Ask the kitchen** and **#3 Same-as one-tap log**, both on `/p/meal`.

**Mon** — `/p/home`: rework the hero card. Hero photo + display heading + one CTA. Secondary actions reduced to a hairline rail. Apple-style "good morning" feel.
**Tue** — `/p/meal`: capture flow gets a proper full-bleed camera preview, blur-up frame on capture, success state photograph. `/p/plan`: each plan day is a horizontal rail of meal photos (not cards). Tap a photo to open the recipe. Add scroll-driven parallax on the recipe hero.
**Wed** — Feature track: ship **#2 Ask the kitchen**. Build `kitchen-scanner` worker; add the secondary chip + camera mode on `/p/meal`.
**Thu** — Feature track: ship **#3 Same-as tap**. Add the `vision_embedding` column + backfill; build `meal-similarity` engine; add the chip above the camera button. Run the eval gate for both.
**Fri** — Fix pass — both tracks.
**Sat** — Smoke — both tracks.

**Exit gate:** `/p/home`, `/p/meal`, `/p/plan`, `/p/plan/[slug]` all read as Apple-grade on a phone. **#2 and #3 flags flipped on for the demo cohort.**

#### Feature spec — #2 "Ask the kitchen" (pantry photo → tonight's meal)

| Field          | Value                                                                                                                                                                                                                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Surface        | Secondary chip on `/p/meal` ("Open the kitchen"), opens the same camera surface but pipes the result to the kitchen scanner instead of the meal-vision worker. Result UI: a single "you have everything for {plan_item}" card with a one-tap "show me how" that opens `/p/plan/{slug}`.                |
| Worker         | `src/inngest/workers/kitchen-scanner.ts` — Inngest function. Reuses `runStructured()` from `src/ai/provider.ts`.                                                                                                                                                                                       |
| Schema         | `KitchenScanSchema = z.object({ visibleItems: z.array(z.string()).max(20), planMatches: z.array(z.object({ planItemId: z.string(), confidence: z.number().min(0).max(1), missingItems: z.array(z.string()) })).max(3), ...auditTriplet })` — added to `src/ai/schemas.ts`.                             |
| Prompt         | Added to `src/ai/prompts.ts` as `kitchen_scan` entry. Inputs: vision image + the patient's approved plan items. Output: `planMatches` ranked. The prompt MUST NOT propose meals outside the plan — restriction enforced by post-prompt validator.                                                      |
| Cache          | 1h Upstash key `scan:photo_sha256:{sha256}`. Re-scanning the same photo returns the cached result.                                                                                                                                                                                                     |
| Idempotency    | Same key. Cheap to re-issue — patient may scan, close, re-open within minutes.                                                                                                                                                                                                                         |
| Fallbacks      | Bare fridge (`visibleItems.length < 3`) → "Time for a shop" copy + a quick-add to the patient's grocery list. No plan items configured → feature suppressed entirely (chip hidden). No confident match (all `confidence < 0.6`) → top 3 partial matches with a clear "missing: lemons, dal" chip rail. |
| Eval           | `docs/evals/wk-03-kitchen-scan.md` — 30 fixture pantry photos labeled with the expected match (or "no match"). Pass if ≥ 27/30 correct.                                                                                                                                                                |
| Audit          | `kitchen.scan.invoked`, `kitchen.scan.match_shown`, `kitchen.scan.opened_recipe`.                                                                                                                                                                                                                      |
| RLS            | Worker reads only `plans.where(patient_id = $self)`. Storage upload to `pantry-scans` bucket with 7d auto-expire policy added to `supabase/migrations/0003_storage.sql`.                                                                                                                               |
| Telemetry      | `kitchen_scan_attempted`, `kitchen_scan_matched`, `kitchen_scan_opened_recipe`. Funnel reported in `/admin/kpi`.                                                                                                                                                                                       |
| A11y           | Camera surface inherits `/p/meal` accessibility. Result card is `role="status"` with `aria-live="polite"`.                                                                                                                                                                                             |
| Reduced motion | Match-found celebration is opacity-only when `prefers-reduced-motion: reduce`.                                                                                                                                                                                                                         |

**Failure points to watch:**

1. **Cuisine drift / restriction violation.** Suggesting a meal outside the patient's halal/vegan/allergen restrictions. **Mitigation:** the prompt is fed `patient.restrictions[]` as a hard exclusion list; a post-prompt validator re-checks every match against the same list and drops violators silently. RLS test enforces the restriction list cannot be omitted.
2. **Misidentified packaged goods.** Hallucinating "tomato paste" from a Coles pasta jar. **Mitigation:** require ≥ 3 visible items before proposing any match; below threshold, fall back to the "what we see" list with no recipe suggestion.
3. **Privacy leakage.** Fridge photos contain personal info (med bottles, family photos, prescriptions stuck on the door). **Mitigation:** `pantry-scans` bucket has 7d auto-expire (storage migration); the photo is **never** persisted to the patient's meal log; only the `visibleItems` text array is retained for audit.
4. **Cold start.** A patient on day 1 has no plan yet. **Mitigation:** chip hidden until `plan.items.length > 0`. Same-pattern as #3 below.
5. **Cost cap exhaustion.** A frustrated patient re-scans 20 times. **Mitigation:** 1h cache on photo SHA collapses identical re-scans; daily Upstash cap at 10 unique scans/patient → exceed → "Maya will help you pick" message that opens the message thread.

**Recursive testing:**

- **Loop A:** worker + chip + result card.
- **Loop B (Thu eval):** 30 fixture photos through the worker; manually score; eval doc updated. Playwright: open `/p/meal`, tap "Open the kitchen", upload a fixture, see the match.
- **Loop C:** fix any < 90% eval drag.
- **Loop D:** Sat smoke includes the audit assertion (kitchen.scan.\* row exists) + the cost cap exercise (11th scan returns the rate-limited path).

#### Feature spec — #3 "Same as Monday lunch?" one-tap log

| Field            | Value                                                                                                                                                                                                                                                                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Surface          | Chip rendered above the camera button on `/p/meal`, only when an embedding-similar meal exists in the patient's last 14 days. Tap → log without re-photographing.                                                                                                                                                                           |
| Engine           | `src/lib/engine/meal-similarity.ts` — pure-logic, no LLM in the hot path. Cosine similarity over the patient's last 14d of meal-vision embeddings. Threshold 0.85 (feature-flagged).                                                                                                                                                        |
| Schema change    | New migration `supabase/migrations/0006_meal_embeddings.sql`: `ALTER TABLE meals ADD COLUMN vision_embedding vector(1536)` (pgvector). New index: `CREATE INDEX meals_vision_embedding_idx ON meals USING ivfflat (vision_embedding vector_cosine_ops) WITH (lists = 100)`. Backfill via one-shot Inngest worker against existing meals.    |
| Embedding source | Existing `meal-vision` worker is extended to emit `vision_embedding` alongside its current schema. The embedding is generated from the photo via the same vision call (no extra cost).                                                                                                                                                      |
| Cache            | None at request-level (the embedding is in Postgres). Engine output cached at the chip render in TanStack Query for 60s.                                                                                                                                                                                                                    |
| Idempotency      | n/a — pure-logic.                                                                                                                                                                                                                                                                                                                           |
| Fallbacks        | Cold start (< 7 days of meals OR < 5 meals total) → chip hidden. Embedding model deprecated → vendor abstraction in `src/ai/provider.ts` re-emits embeddings on next vision call; pre-deprecation embeddings stay valid for 30d. No similar meal found → chip hidden (silent — never show "no match" for a feature designed to be ambient). |
| Eval             | `docs/evals/wk-03-same-as.md` — 100 labeled meal pairs (50 same / 50 different). Tune threshold for ≥ 92% precision @ 0.85; recall is secondary (false-negative just means user takes a new photo, no harm done).                                                                                                                           |
| Audit            | `meal.same_as.suggested`, `meal.same_as.accepted`, `meal.same_as.dismissed`.                                                                                                                                                                                                                                                                |
| RLS              | Engine reads only `meals.where(patient_id = $self)`. RLS test: `tests/permissions/meal_similarity.test.ts` proves no cross-patient embedding access.                                                                                                                                                                                        |
| Telemetry        | `same_as_chip_shown`, `same_as_chip_accepted`, `same_as_chip_dismissed`. Tracked alongside #2 in the camera-flow funnel.                                                                                                                                                                                                                    |
| A11y             | Chip is a real `<button>` with descriptive label "Log the same as your Monday lunch — chicken curry with rice". Screen reader gets the full referent meal name, not just "Same as".                                                                                                                                                         |
| Reduced motion   | Chip reveal is opacity-only when reduced motion is set.                                                                                                                                                                                                                                                                                     |

**Failure points to watch:**

1. **False positive match.** A different meal that looks similar (rice + dal vs rice + chana). **Mitigation:** the chip never replaces the camera button — it sits above it, and the camera button is the larger CTA. The chip is "if this is right, save a step"; the photo is "if not, take a new one." The default UX never penalises a wrong chip.
2. **Embedding drift.** OpenAI deprecates `text-embedding-3-small` (current vision-paired embedding model) and replaces it. **Mitigation:** the migration framework supports `vision_embedding_model_version` column; on model change, a one-shot worker regenerates all active patients' embeddings under a feature flag, with cosine sim recomputed on the new vectors.
3. **pgvector index quality at scale.** ivfflat with `lists = 100` is fine to ~ 100K rows but degrades. **Mitigation:** documented; we'll move to HNSW at the 100K-meal mark (decision noted in the doc, not done now).
4. **Backfill cost.** Existing meals have no embedding. **Mitigation:** one-shot Inngest backfill rate-limited to 100 meals/min; safety: skipped if `OPENAI_API_KEY` unset (vibe mode no-ops, chip stays hidden).
5. **"Same-as" fatigue.** Patient sees the chip every meal, ignores it, hates it. **Mitigation:** suppression rule — if the patient dismisses the chip 3 times in a 7d window, the chip auto-mutes for 14 days. Re-emerges quietly when a new highly-similar meal appears.

**Recursive testing:**

- **Loop A:** migration + backfill + engine + chip.
- **Loop B (Thu eval):** the 100-pair eval set; tune threshold; commit `docs/evals/wk-03-same-as.md`. Vitest for the cosine math; integration test for the cold-start hide rule.
- **Loop C:** fix.
- **Loop D:** Sat smoke includes embedding-backfill verification (`SELECT count(*) FROM meals WHERE vision_embedding IS NOT NULL` — must be ≥ 80% of historical meals).

---

### Week 4 · Patient PWA polish — Metrics, Symptoms, Messages, Privacy · **DUAL-TRACK**

> **Polish track (Mon–Tue):** the four screen polishes below.
> **Feature track (Wed–Thu):** ship **#4 Voice-note symptoms** (lives on `/p/symptoms`) and **#8 Why-this-works** patient nudge (lives on `/p/plan` and `/p/home`).

**Mon** — `/p/metrics`: CGM line gets a soft area fill, hairline grid only, target band as a tinted strip. Numbers in display weight, not card-heavy. `/p/symptoms`: faces / icons in a single row that responds to selection with spring scale, not bordered tiles. Severity slider replaces the segmented control.
**Tue** — `/p/messages`: bubble-less chat. Maya's messages anchored left in serif, patient replies anchored right in system. Quiet timestamps. Read-receipts as faint glyph. `/p/settings/privacy`: 3-tier consent presented as toggles with one paragraph each, no card chrome.
**Wed** — Feature track: ship **#4 Voice-note symptoms**. Build `symptom-voice-parser` worker; add hold-to-record button; new Storage bucket with 30d auto-expire.
**Thu** — Feature track: ship **#8 Why-this-works**. Build `meal-lesson-composer` worker; trigger on `meal.approved`; render the one-line lesson on `/p/plan` items and post-capture on `/p/home`. Run eval gates for both.
**Fri** — Fix pass — both tracks.
**Sat** — Smoke — both tracks.

**Exit gate:** Patient PWA — every screen — feels like one product, not eight. **#4 and #8 flags flipped on for the demo cohort.**

#### Feature spec — #4 Voice-note symptom logging

| Field          | Value                                                                                                                                                                                                                                                                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Surface        | Hold-to-record button on `/p/symptoms` (the typed-form path remains as the secondary fallback). Drag-up-to-cancel gesture, like iOS voice messages. Live waveform during recording.                                                                                                                                                                 |
| Capture        | `MediaRecorder` API → Opus blob → `POST /api/voice/upload` → Supabase Storage `voice-notes` bucket → Inngest event `symptom.voice.uploaded`.                                                                                                                                                                                                        |
| Worker         | `src/inngest/workers/symptom-voice-parser.ts`. Steps: (1) Whisper transcription, (2) Claude structured extraction via `runStructured()`, (3) `applySafety()` gate, (4) write to `symptoms` table with `source: "voice"`.                                                                                                                            |
| Schema         | `SymptomVoiceSchema = z.object({ rawTranscript: z.string(), structuredSymptoms: z.array(z.object({ symptom: z.string(), severity: z.enum(["mild","moderate","severe"]), durationMin: z.number().nullable(), triggerCandidate: z.string().nullable() })), language: z.string(), ...auditTriplet })` — added to `src/ai/schemas.ts`.                  |
| Storage        | New `voice-notes` Storage bucket via migration extension to `supabase/migrations/0003_storage.sql`: 30d auto-expire, RLS policy "patient can read/write own voice notes," dietitian read-only via `auth_can_see_patient`.                                                                                                                           |
| Cache          | None (each recording is unique).                                                                                                                                                                                                                                                                                                                    |
| Idempotency    | `(patient_id, blob_sha256)` — accidental double-upload of the same blob (e.g. retry on flaky network) reuses the prior parse.                                                                                                                                                                                                                       |
| Fallbacks      | Recording < 2s → ignore. Whisper confidence < 0.6 → "Couldn't quite hear that — try again or type it" with one tap to the typed form, raw audio retained for 24h for the patient to listen back. Non-English with `language` not in `patient.locales[]` → still parse, but show a translate-back banner. LLMUnconfigured → fall back to typed form. |
| Eval           | `docs/evals/wk-04-voice-symptoms.md` — 40 audio fixtures across accents (AU English, Indian English, Mandarin-accented, Spanish-accented), noise levels (quiet kitchen, TV background, car), and content variations. ≥ 85% structured extraction accuracy.                                                                                          |
| Audit          | `symptom.voice.uploaded`, `symptom.voice.parsed`, `symptom.voice.confirmed`, `symptom.voice.discarded`.                                                                                                                                                                                                                                             |
| RLS            | Strict bucket policy + `symptoms` row RLS. RLS test: `tests/permissions/voice_notes.test.ts` proves a patient cannot list another patient's voice-notes prefix.                                                                                                                                                                                     |
| Telemetry      | `voice_recording_started`, `voice_recording_completed`, `voice_recording_cancelled`, `voice_recording_failed`, `voice_parse_succeeded`, `voice_parse_low_confidence`.                                                                                                                                                                               |
| A11y           | Hold-to-record has a typed-form fallback chip always visible. Live transcript announced via `aria-live="polite"` at 1Hz. Recording state announced as "Recording, hold to continue, swipe up to cancel."                                                                                                                                            |
| Reduced motion | The recording indicator pulses via opacity (0.5 → 1.0), not scale.                                                                                                                                                                                                                                                                                  |

**Failure points to watch:**

1. **Mis-extraction of severity.** "I felt a bit off" parsed as `severe`. **Mitigation:** the prompt uses anchored severity examples; the post-prompt validator caps inferred severity at `mild` if the transcript contains hedging words ("a bit", "kinda", "sort of"). Severe must be explicitly evidenced.
2. **Battery drain on long records.** Patient holds the button accidentally, 5-min recording. **Mitigation:** 30s hard cap; UI banner at 25s "wrap up — recording ends in 5s."
3. **Storage cost.** 50 patients × 1 voice/day × 30d retention = 1500 audio blobs. **Mitigation:** auto-delete raw audio at 30d; structured `symptoms` row retained indefinitely. Average blob ~ 80KB → ~ 120MB total.
4. **Accidental long-press.** Patient leans on the screen during a phone call. **Mitigation:** drag-up-to-cancel gesture; recordings < 2s auto-discarded; visual press feedback so it's obvious recording started.
5. **Privacy of voice content.** Patients say things they didn't mean to log. **Mitigation:** show the parsed extraction _before_ persisting; confirm-or-discard step always required. Discarded voice notes purged immediately, not at 30d.
6. **Multi-lingual hallucination.** Whisper auto-detects Tamil but Claude's prompt is English-only. **Mitigation:** if `language ≠ "en"` and not in `patient.locales[]`, route to a translate-then-parse chain; results displayed in both languages for confirmation.

**Recursive testing:**

- **Loop A:** worker + button + storage bucket + schema parse.
- **Loop B (Thu eval):** the 40-fixture eval set. Vitest for the severity-hedge validator. Playwright: hold the record button, swipe to cancel, hold and release, see parsed extraction, confirm, see new symptoms row.
- **Loop C:** fix any < 85% eval drag.
- **Loop D:** Sat smoke includes (a) audit row assertion, (b) cost cap exercise (11th recording in a day rate-limited), (c) storage policy verification (`SELECT id FROM storage.objects WHERE bucket_id = 'voice-notes' AND created_at < NOW() - INTERVAL '30 days'` — must be 0).

#### Feature spec — #8 "Why this works" patient nudge (one-line lesson per meal)

| Field          | Value                                                                                                                                                                                                                                                                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Surface        | One line under every approved meal on `/p/plan` and immediately after a captured meal on `/p/home` ("This kept your glucose flat. Notice the legumes — they slow the rice."). Maximum 80 characters. Always quoted in serif italic to signal "this is the dietitian translating the AI."                                                          |
| Worker         | `src/inngest/workers/meal-lesson-composer.ts`. Triggered on `meal.approved` event from the dietitian queue (existing event from Stage 6). Reuses `runStructured()`.                                                                                                                                                                               |
| Schema         | `MealLessonSchema = z.object({ lesson: z.string().max(80), foodReferenced: z.string().min(1), tone: z.enum(["explain","celebrate","encourage"]), ...auditTriplet })` — added to `src/ai/schemas.ts`. Note: `foodReferenced` is required; if absent or empty, the worker rejects and re-prompts once, else suppresses the lesson.                  |
| Prompt         | `meal_lesson` entry in `src/ai/prompts.ts`. Inputs: meal-vision result + glucose-impact summary + the dietitian's approval rationale (free-text from the queue review). Output: a single sentence ≤ 80 chars that **MUST** reference at least one food in the meal. Tone exemplars provided in the prompt to anchor warmth without condescension. |
| Cache          | Per-meal-id forever (the lesson is the meal's lesson). Key: `lesson:meal:{meal_id}`. Never expires; only invalidated on `meal.edited` events.                                                                                                                                                                                                     |
| Idempotency    | Same key. Dietitian re-approving the same meal returns the cached lesson.                                                                                                                                                                                                                                                                         |
| Fallbacks      | Confidence < 0.7 → suppress (no nudge is better than a generic one). Validator fails (`foodReferenced` missing) → re-prompt once with stricter wording; still failing → suppress. LLMUnconfigured → suppress.                                                                                                                                     |
| Eval           | `docs/evals/wk-04-meal-lesson.md` — 80 meals from Maya's caseload reviewed for (a) tone (not condescending — 0 violations allowed), (b) specificity (`foodReferenced` actually appears in the meal), (c) clinical accuracy (the mechanism claimed is correct). Pass if ≥ 90% across all three dimensions.                                         |
| Audit          | `meal.lesson.generated`, `meal.lesson.viewed`, `meal.lesson.dismissed`.                                                                                                                                                                                                                                                                           |
| RLS            | Worker reads only the meal it's processing. Patient reads only own lessons. RLS test: `tests/permissions/meal_lesson.test.ts`.                                                                                                                                                                                                                    |
| Telemetry      | `meal_lesson_shown`, `meal_lesson_dismissed`. The dismissal rate is the early signal of tone-failure; > 30% dismissal triggers a prompt review.                                                                                                                                                                                                   |
| A11y           | Lesson is rendered as a real `<p>` with `cite` attribute referencing the meal-id. Screen reader picks it up naturally as part of the meal entry.                                                                                                                                                                                                  |
| Reduced motion | The lesson fades in (opacity), no slide. Done.                                                                                                                                                                                                                                                                                                    |

**Failure points to watch:**

1. **Generic platitudes.** "Good choice!" with no food reference. **Mitigation:** the `foodReferenced` field is required by Zod; the validator additionally checks the value appears in the meal-vision food list (case-insensitive substring match). Fail → suppress.
2. **Condescending tone.** "Well done — you ate vegetables today!" **Mitigation:** tone exemplar list in `src/ai/prompts.ts` shows 10 anchor good examples + 5 explicit anti-examples. Eval set tests this dimension; > 0 condescension violations means the prompt fails the gate and the feature flag stays off.
3. **Wrong language / locale.** Lesson in English to a Cantonese-only patient. **Mitigation:** prompt receives `patient.locale`; output language is asserted by Whisper-style language ID; mismatch → suppress and log `meal_lesson_locale_mismatch`.
4. **Clinical over-claim.** "This will lower your HbA1c" (it won't, predictably). **Mitigation:** prompt explicitly forbids predictive numeric claims. Post-prompt validator regex-rejects `\b(will|guaranteed|cure|prevent)\b` in the lesson sentence.
5. **Stale lessons.** A meal is later flagged for safety review; the lesson goes with it. **Mitigation:** `meal.flagged` event invalidates the lesson cache and hides the rendering on `/p/plan` until reapproval.

**Recursive testing:**

- **Loop A:** worker + render + cache.
- **Loop B (Thu eval):** the 80-meal eval scored across the three dimensions; commit `docs/evals/wk-04-meal-lesson.md`.
- **Loop C:** prompt iteration if eval < 90%.
- **Loop D:** Sat smoke verifies cache hit on a re-trigger of the same meal (no new audit row written).

---

### Week 5 · Dietitian Web polish — Dashboard, Patients, Referrals · feature: #7 matcher engine

> Polish work is the full-week focus. The **#7 cuisine-fit matcher engine** is pure-logic and ships alongside `/d/referrals` polish on Wed without expanding the week — the engine has no LLM, no UI surface yet (the GP-side UI lands in W8).

**Mon** — `/d/dashboard`: ditch the four equal stat cards. One headline metric in display, three supporting metrics as quiet text rows. Open queue CTA gets the only real shadow on the page.
**Tue** — `/d/patients`: list view with photo avatars, hairline rows, sticky header with one search input that filters live.
**Wed** — `/d/referrals`: timeline view, each referral a row with patient photo + cuisine chip + GP name + "open" affordance only on hover. **Ship the #7 matcher engine** — pure-logic, fully unit-tested.
**Thu** — Keyboard-first audit: every action reachable in ≤ 2 keystrokes, visible ⌘+key hints in a pill at the top of the screen. Run #7 eval matrix.
**Fri** — Fix pass.
**Sat** — Smoke.

**Exit gate:** Dietitian feels like a power-user web product, not a dashboard. **#7 engine passes its 20×12 eval matrix; the engine is callable but not yet exposed to GPs (UI lands W8).**

#### Feature spec — #7 Cuisine-fit referral matcher · engine (UI lands W8)

| Field          | Value                                                                                                                                                                                                                                                                                                                                                             |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Surface        | This week: engine only. Callable from `src/server/services/index.ts` as `matchDietitiansForReferral(patient, options)`. UI surface lands W8 in the GP referral card.                                                                                                                                                                                              |
| Engine         | `src/lib/engine/dietitian-matcher.ts` — pure-logic, no LLM. `match(patient, dietitians)` returns top 3 by score `cuisineMatch * 0.5 + workloadAvail * 0.3 + outcomeFit * 0.2`. Deterministic; same inputs always produce same outputs.                                                                                                                            |
| Schema         | `DietitianMatchSchema = z.object({ matches: z.array(z.object({ dietitianId: z.string(), score: z.number().min(0).max(1), breakdown: z.object({ cuisineMatch: z.number(), workloadAvail: z.number(), outcomeFit: z.number() }) })).max(3), matchedAt: z.string().datetime() })` — added to `src/ai/schemas.ts` (no LLM, but standardised).                         |
| Sub-functions  | `cuisineMatch(patient.cuisine, dietitian.cuisineCompetencies)` — overlap fraction, range 0..1. `workloadAvail(dietitian)` — `1 - (current_caseload / max_caseload)`, range 0..1. `outcomeFit(patient.conditions, dietitian.outcomeHistory)` — historical TIR-improvement weight; defaults to **0.5** for dietitians with < 10 closed cases (the "newcomer" rule). |
| Cache          | None (deterministic + cheap).                                                                                                                                                                                                                                                                                                                                     |
| Idempotency    | n/a — pure-logic.                                                                                                                                                                                                                                                                                                                                                 |
| Fallbacks      | All dietitians at capacity (no `workloadAvail > 0.05`) → return `{matches: [], reason: "all_at_capacity"}`; GP UI in W8 escalates to admin. No cuisine match (all `cuisineMatch < 0.1`) → fall back to **language match** (uses `dietitian.languages` overlap with `patient.languages`); breakdown surfaces this so the GP knows.                                 |
| Eval           | `docs/evals/wk-05-matcher.md` — 20 patient profiles × 12 dietitian profiles = 240 scoring rows hand-ranked by Maya. Compare engine output to her ranking using **Spearman correlation ≥ 0.85**. Spot-check the top-1 match: must agree with her pick on ≥ 85% of patients.                                                                                        |
| Audit          | This week: no audit (no user-facing invocation yet). W8 adds `referral.match.suggested`, `referral.match.accepted`, `referral.match.rejected_for_other`.                                                                                                                                                                                                          |
| RLS            | Engine input filtered by `dietitian.org_id IN participating_clinics(patient.org_id)` **before** scoring. RLS test: `tests/permissions/matcher_no_cross_org_leak.test.ts` proves a dietitian outside the patient's network never appears in the result.                                                                                                            |
| Telemetry      | `matcher_invoked`, `matcher_returned_zero` (capacity-exhausted path). UI telemetry in W8.                                                                                                                                                                                                                                                                         |
| A11y           | n/a (engine).                                                                                                                                                                                                                                                                                                                                                     |
| Reduced motion | n/a (engine).                                                                                                                                                                                                                                                                                                                                                     |

**Failure points to watch:**

1. **Privacy boundary leak.** A dietitian outside the patient's clinic network appears in the result. **This is the highest-stakes risk in the entire plan.** **Mitigation:** the participating-clinics filter runs **before** scoring, not after — even a bug in scoring cannot leak outside-network dietitians. The RLS test is named explicitly and its failure is a build-blocker.
2. **Gaming risk.** All referrals routed to the highest-scoring dietitian → that dietitian's `workloadAvail` plummets → the next referral routes elsewhere → "rich get richer" instability. **Mitigation:** `workloadAvail` re-checked at **accept time** (W8), not just suggestion time. Mid-flight rebalance if the suggested dietitian crosses into red.
3. **Outcome-history bias against new dietitians.** A new APD with 0 closed cases gets `outcomeFit = 0`, never appears. **Mitigation:** the < 10 cases default to 0.5 (neutral), not 0. Documented and tested.
4. **Cuisine label sparsity.** Patient `cuisine` is "Tamil" but dietitians' `cuisineCompetencies` use "South Asian" → no overlap. **Mitigation:** cuisine taxonomy with **parent → child mappings** (Tamil ⊂ South Indian ⊂ South Asian); overlap fraction climbs the tree.
5. **Determinism vs ties.** Two dietitians score identically. **Mitigation:** stable tie-break: alphabetical by `dietitian_id`. Documented; ranks stay deterministic for audit.

**Recursive testing:**

- **Loop A:** engine + Vitest unit tests + cuisine taxonomy fixture.
- **Loop B (Thu eval):** 240-row matrix; Spearman ≥ 0.85; commit `docs/evals/wk-05-matcher.md`.
- **Loop C:** if Spearman drags, tune the weights (50/30/20 → 45/35/20 etc.) — re-eval before committing the new weights.
- **Loop D:** Sat smoke runs the RLS test explicitly: `pnpm vitest run tests/permissions/matcher_no_cross_org_leak.test.ts` must be green.

---

### Week 6 · Patient Detail v2 (executes the Nutrium plan) · **DUAL-TRACK**

> Implements `docs/plans/patient-detail-nutrium.md` against the Week 1–2 token + photo system.
>
> **Polish track (Mon–Wed):** Patient Detail v2 build. **Feature track (Thu):** ship **#5 Dietitian swap-drag** as the meal-log interaction layer. The swap-drag _is_ the headline interaction of Patient Detail v2 — it lives inside the per-meal expanded row, so it ships in this week's exit gate.

**Mon** — Pure-logic landings: `cuisine-fit.ts` + `mbs-rule-engine.ts`, both with full Vitest coverage.
**Tue** — Two-pane layout: left = day strip + meal log, right = macro panel + cuisine fit + GP coordination strip.
**Wed** — Per-meal expanded log: photograph, AI summary, macros, dietitian-editable note. GP coordination strip + billing autopilot strip pinned right.
**Thu** — Feature track: ship **#5 Swap-drag**. Build `ingredient-swapper` worker; wire long-press + Framer drag on each food chip in the meal log; popover with the 3 swaps; "send to patient as note" action. Run eval gate.
**Fri** — Fix pass — both tracks.
**Sat** — Smoke — both tracks.

**Exit gate:** `/d/patients/[id]` reads as the heart of the dietitian product. Nutrium-class density, Measured-class restraint. **#5 swap-drag flag flipped on for the demo cohort.**

#### Feature spec — #5 Dietitian "swap-drag" (drag any ingredient → 3 cuisine-aligned swaps)

| Field          | Value                                                                                                                                                                                                                                                                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Surface        | Patient Detail v2 meal log. Dietitian long-presses any food chip in any meal → Framer Motion `drag` with elastic resistance → release → popover anchored to the chip with 3 swap cards. Each card shows: from → to, macro deltas, cuisine-fit %, mechanism sentence, effort badge. One-tap "send to patient" composes a thread message via the existing service layer.   |
| Worker         | `src/inngest/workers/ingredient-swapper.ts`. Reuses `runStructured()`. Inputs: `food` + `meal_context` (the other foods in the meal) + `cuisine` + `patient.restrictions[]` + `patient.dislikes[]`.                                                                                                                                                                      |
| Schema         | `IngredientSwapsSchema = z.object({ swaps: z.array(z.object({ from: z.string(), to: z.string(), macroDelta: z.object({ kcal: z.number(), carb_g: z.number(), protein_g: z.number(), fibre_g: z.number() }), cuisineFitDelta: z.number().min(-1).max(1), mechanism: z.string().max(140), effort: z.enum(["zero","swap","extra-step"]) })).length(3), ...auditTriplet })`. |
| Prompt         | `ingredient_swap` entry in `src/ai/prompts.ts`. Hard rules embedded in the prompt: (a) no swap that violates `patient.restrictions[]`, (b) no swap that introduces a `patient.dislikes[]` item, (c) no swap outside `cuisine` family unless explicitly cleared by `cross_cuisine_ok` flag.                                                                               |
| Cache          | 30d Upstash key `swapper:{food_normalised}:{cuisine}:{restrictions_hash}:{dislikes_hash}`. Same food, same cuisine, same restrictions → cached.                                                                                                                                                                                                                          |
| Idempotency    | Same key.                                                                                                                                                                                                                                                                                                                                                                |
| Fallbacks      | Confidence < 0.7 → "Maya will write the swap by hand" + opens the message composer with the food pre-quoted. Validator rejects all 3 swaps (e.g. all violate restrictions) → re-prompt once with stricter wording; still failing → fall back to "Maya will write" path. LLMUnconfigured → fall back to a curated swap table for the top 50 foods × 8 cuisines.           |
| Eval           | `docs/evals/wk-06-swap.md` — 50 (food, cuisine) pairs reviewed by Maya for: (a) cultural appropriateness — **0 violations allowed** (any halal/vegan/allergen miss is a hard fail), (b) macro accuracy ± 15%, (c) practicality (swap is realistically purchasable in AU). Pass if all three at ≥ 90%, with culture at 100%.                                              |
| Audit          | `meal.swap.suggested` (worker write), `meal.swap.viewed` (popover render), `meal.swap.sent_to_patient` (message composer submit), `meal.swap.dismissed`.                                                                                                                                                                                                                 |
| RLS            | Worker reads only the meal it's processing. Dietitian must have `auth_can_see_patient(meal.patient_id)`. RLS test: `tests/permissions/swap_drag.test.ts`.                                                                                                                                                                                                                |
| Telemetry      | `swap_drag_initiated`, `swap_drag_cancelled`, `swap_popover_opened`, `swap_sent_to_patient`, `swap_dismissed`. The send-to-patient rate is the headline KPI.                                                                                                                                                                                                             |
| A11y           | The drag interaction has a **keyboard equivalent**: arrow-keys on a focused food chip + Enter opens the same popover. Long-press is mouse/touch only — keyboard never relies on it.                                                                                                                                                                                      |
| Reduced motion | Drag elastic disabled (jumps directly to popover); popover fades in (opacity), no scale.                                                                                                                                                                                                                                                                                 |

**Failure points to watch:**

1. **Cultural inappropriateness — top risk.** Suggesting pork to a halal patient. **Mitigation (defence-in-depth):** (a) pre-prompt restriction filter in the worker; (b) restrictions embedded in the prompt itself; (c) post-prompt validator re-checks every swap against `patient.restrictions[]` and silently drops violators; (d) the eval is the gate — culture must be at 100%, not 90%, and any single violation rolls the feature back behind the flag.
2. **Drag-vs-tap accidental trigger.** Dietitian intends to read the chip, accidentally drags. **Mitigation:** 200ms hold threshold before drag activates; visual press-feedback (chip darkens at 100ms, lifts at 200ms) so the dietitian knows they're now in drag mode; release without movement = no popover.
3. **Over-medicalising tone.** "Swap white rice for diabetic-formulated low-GI rice product XYZ." **Mitigation:** prompt forbids brand names + medicalised product framing. Tone exemplars provided. Validator regex-rejects `brand|product|formulated|prescription`.
4. **Macro inaccuracy.** Claimed -200 kcal, actually -50 kcal. **Mitigation:** macro deltas stated as ranges (`±15%` band) in the UI; prompt instructed to use canonical AUSNUT food values; eval scores macro accuracy as a hard dimension.
5. **Hover-fatigue / accidental long-press during scroll.** Dietitian scrolls the meal log on touch device, presses too long. **Mitigation:** scroll detection — if the touch moves > 8px before the 200ms threshold, drag is cancelled and the gesture treated as scroll.
6. **Swap suggested mid-meal-edit.** Dietitian is editing the meal vision result; swap-drag fires on a not-yet-saved food. **Mitigation:** swap-drag disabled while the meal is in edit mode (`editing` state from the existing dietitian queue store).

**Recursive testing:**

- **Loop A:** worker + drag interaction + popover + message-composer wiring.
- **Loop B (Thu eval):** the 50-pair eval. Vitest for the post-prompt restriction validator. Playwright: long-press a food in Patient Detail v2, see drag begin, release, see popover, click "send to patient", verify a thread message was created and audited.
- **Loop C:** prompt iteration if any culture violations; re-eval before promoting.
- **Loop D:** Sat smoke runs the RLS test + the audit assertion + a one-shot eval (`pnpm vitest run tests/ai/swap_culture.test.ts`) that re-runs 5 known-violating fixtures and confirms 0 leaked through.

---

### Week 7 · ⭐ CGM glance — meal hover popout with AI micro-improvements

> The "game-changer" feature called out in the brief. This is the week.

**The interaction:**
On `/p/metrics` (patient view) and `/d/patients/[id]` (dietitian view, inside Patient Detail v2), the CGM line graph shows a small dot at every meal logged. **Hover** (or **tap-and-hold** on touch) any dot, and a popover floats next to the meal showing:

1. **The meal photograph** — full-bleed top of the popover.
2. **The food + macro summary** — three lines from the AI vision result.
3. **Glucose impact** — peak Δ mmol/L · time-to-peak · time-back-to-baseline.
4. **AI micro-improvement card** — three concrete, ranked, non-prescriptive ideas. Examples:
   - "Swap white rice → brown basmati. Cuts peak Δ ~ 0.6 mmol/L. Same recipe, same cuisine."
   - "Add 1 tbsp lemon juice + 2 tsp olive oil. Lowers GI by ~ 15%."
   - "Eat the dal first, rice second. Same meal, smaller spike."
5. **One-tap actions** — _Send to patient as note_ (dietitian view) · _Add to next plan_ · _Mark not interested_.

**Daily breakdown:**

**Mon** — `<MealHoverPopover>` primitive. Floating UI (`@floating-ui/react`) for placement. Built on `<Photo>`. Pure-presentational; takes a `MealLog + MicroImprovements[]`.
**Tue** — `mealMicroImprover()` AI worker — Inngest function reusing the Stage 6 LLM provider. Zod schema:

```ts
z.object({
  improvements: z
    .array(
      z.object({
        headline: z.string().max(80),
        mechanism: z.string().max(140),
        cuisineFitDelta: z.number().min(-1).max(1),
        glucoseDeltaEstMmol: z.number().nullable(),
        effort: z.enum(["zero", "swap", "extra-step"]),
      }),
    )
    .length(3),
  confidence: z.number().min(0).max(1),
});
```

Safety gate: `confidence < 0.7` → suppress, show "Maya will review and add suggestions" instead. Same `applySafety()` used for meal vision.
**Wed** — Wire popover into `/p/metrics` CGM chart (Recharts custom dot + tooltip override). Dietitian "Send to patient" creates a thread message via the existing service layer; audited.
**Thu** — Wire popover into `/d/patients/[id]` Patient Detail v2 — same component, dietitian view exposes the action row.
**Fri** — Tests:

- Vitest for `mealMicroImprover` schema + safety gate.
- Playwright on `/p/metrics`: hover dot → popover visible → photograph loaded → 3 cards present.
- Reduced-motion: popover slides off, no spring.
  **Sat** — Smoke + accessibility audit (popover must be keyboard-reachable: arrow keys to navigate dots, Enter opens, Escape closes).

**Exit gate:** Stefan looks at the CGM graph, hovers a meal, sees the photograph, reads the three suggestions, clicks "send to patient" — entire flow under 4 seconds, no jank, AI gated.

#### Feature spec — #1 CGM ↔ Meal hover popout (flagship)

| Field          | Value                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Surface        | `<MealHoverPopover>` rendered on `/p/metrics` (patient view, no action row) and inside Patient Detail v2 on `/d/patients/[id]` (dietitian view, full action row). Recharts `<Customized>` layer overlays a `<MealDot>` per meal-time on the CGM line; hover (or tap-and-hold on touch) opens the popover via `@floating-ui/react` with `flip()` + `shift()` middleware so it never clips the viewport edge. |
| Worker         | `src/inngest/workers/meal-micro-improver.ts`. Triggered by either (a) the dietitian opening Patient Detail v2 (warmer for the day's meals), (b) on-demand on first hover (cold path). Reuses `runStructured()`.                                                                                                                                                                                             |
| Schema         | `MicroImprovementsSchema = z.object({ improvements: z.array(z.object({ headline: z.string().max(80), mechanism: z.string().max(140), cuisineFitDelta: z.number().min(-1).max(1), glucoseDeltaEstMmol: z.number().nullable(), effort: z.enum(["zero","swap","extra-step"]) })).length(3), ...auditTriplet })` — added to `src/ai/schemas.ts`.                                                                |
| Prompt         | `meal_micro_improver` entry in `src/ai/prompts.ts`. Inputs: meal-vision result + glucose impact (peak Δ, time-to-peak, return-to-baseline) + `patient.restrictions[]` + `patient.cuisine`. Output: 3 improvements, ranked by `effort: zero → swap → extra-step` (cheapest first). The prompt forbids prescriptive numeric promises ("will lower X by Y").                                                   |
| Cache          | 7d Upstash key `improver:meal:{meal_id}:{meal.updated_at}`. Re-hovers within 7d (or until the meal is edited) return cached output.                                                                                                                                                                                                                                                                         |
| Idempotency    | Same key. Identical input never re-bills the LLM.                                                                                                                                                                                                                                                                                                                                                           |
| Fallbacks      | Confidence < 0.7 → "Maya will review and add suggestions" copy + the photograph + macro summary still render. LLMUnconfigured → fall back to a curated 3-swap table indexed on `(top_food, cuisine)`. AI cost spike (Upstash counter exhausted) → serve last cached output even if expired; if no cached output, fall back to the curated table.                                                            |
| Eval           | `docs/evals/wk-07-cgm-hover.md` — 50 meals across the 8 cuisines, each scored by Maya for: (a) clinical safety (no risky advice — 0 violations allowed), (b) cuisine fit (suggestion is realistically same-cuisine), (c) actionability (the patient or dietitian can do it without specialist knowledge). Pass at ≥ 90% across all three.                                                                   |
| Audit          | `meal.improvements.generated`, `meal.improvements.viewed`, `meal.improvements.sent_to_patient`, `meal.improvements.added_to_plan`, `meal.improvements.dismissed`.                                                                                                                                                                                                                                           |
| RLS            | Worker reads only the meal it's processing. Dietitian must have `auth_can_see_patient(meal.patient_id)`; patient sees only own meals. RLS test: `tests/permissions/cgm_hover.test.ts`.                                                                                                                                                                                                                      |
| Telemetry      | `cgm_dot_hovered`, `cgm_popover_opened`, `cgm_improvement_sent_to_patient`, `cgm_improvement_added_to_plan`, `cgm_improvement_dismissed`. Time-to-action measured for the 4-second flow target.                                                                                                                                                                                                             |
| A11y           | Arrow keys cycle dots on the CGM line; Enter opens the popover; Tab cycles within the popover (focus-trapped); Escape closes and restores focus to the dot. Screen reader announces "meal at 12:34, peak delta 1.2 mmol/L, three suggestions available" when a dot receives focus.                                                                                                                          |
| Reduced motion | Popover slides off (opacity), no spring scale. Dot focus indicator is a hairline ring, not a pulsing aura.                                                                                                                                                                                                                                                                                                  |

**Failure points to watch:**

1. **Dot cluster overlap.** Two meals within 15 minutes of each other → dots overlap → user can't pick one. **Mitigation:** clustering rule — meals within 15 min are rendered as a single **cluster glyph** (a small "2" badge); hover on the cluster opens a sub-popover listing the meals; keyboard navigates into the cluster with right-arrow.
2. **Photograph fails to load.** CDN hiccup or the meal predates the photo system. **Mitigation:** popover degrades gracefully — blur-up placeholder + AI summary + macro chips are always shown; only the hero image is conditional.
3. **Cost spike from automated hover-scroll.** A dietitian scrolls a long history, hovering every dot. **Mitigation:** worker pre-warms on Patient Detail v2 open (one batched call for all meals in viewport); subsequent hovers are pure cache reads. Daily cap at 100 unique meal-improver calls per dietitian.
4. **"Send to patient" sent in error.** No undo would be cruel. **Mitigation:** **5-second undo banner** after send (matches the existing toast pattern). Server-side, the message is created with a `pending_send_until` timestamp; the actual delivery to the patient happens after the 5s window unless cancelled.
5. **Suggestion drift from clinical guidance.** Maya's reading clinical evidence and the model has stale training. **Mitigation:** prompt instructed to defer to dietitian-approved language; eval gate is the safeguard; quarterly re-run of the eval set as a regression check.
6. **CGM data sparsity.** New patient with < 3 days of CGM → glucose impact unreliable. **Mitigation:** if `cgm_data_completeness < 0.5` for the meal window, popover hides the glucose-impact section but still shows the photograph and improvements (the improvements call doesn't depend on CGM).

**Recursive testing:**

- **Loop A:** schema + worker + popover + Recharts `<MealDot>` + cluster rule.
- **Loop B (Thu eval):** the 50-meal eval. Vitest for safety gate. Playwright: hover dot, see popover, photograph loads, 3 cards present, click send-to-patient, verify undo banner appears and message is delayed 5s. Reduced-motion run.
- **Loop C:** any < 90% eval drag → prompt or cache iteration.
- **Loop D:** Sat smoke includes (a) audit row assertion for the demo path, (b) cost cap exercise (101st invocation rate-limited), (c) RLS test for cross-patient leakage, (d) keyboard accessibility full pass — arrow-keys cycle dots, Enter opens, Escape closes, focus returns to dot.

---

### Week 8 · GP Sidebar polish + 30-second briefing · **DUAL-TRACK**

> **Polish track (Mon–Tue):** all six GP cards. **Feature track (Wed–Thu):** ship **#6 30-second briefing** (lives at the top of the GP context card) and **#7 cuisine-fit referral routing UI** (lives in the GP referral card; engine landed W5).

**Mon** — `/gp/[patientId]/context`: bullet density reduced 40%. `/gp/[patientId]/transcript`: serif quote treatment, hairline divider per turn, AI-SOAP draft folds out only on hover.
**Tue** — `/gp/[patientId]/billing`: MBS hints as quiet pills, one row per item, "copy to clinic note" as the only loud action. `/gp/[patientId]/care-plan` + `/gp/[patientId]/referral`: identical typography, identical spacing, identical motion.
**Wed** — Feature track: ship **#6 30-second briefing**. Build `briefing-composer` worker; trigger on the three regenerate events; render at the top of the GP context card with the "AI summary, click to verify" affordance.
**Thu** — Feature track: ship **#7 referral routing UI**. Wire the matcher engine (from W5) into the GP referral card; show 3 suggested dietitians with photo + cuisine match badge + workload indicator; one-tap accept. Run eval gates for both.
**Fri** — Fix pass — both tracks.
**Sat** — Smoke — both tracks.

**Exit gate:** GP can review a patient in 30 seconds without scrolling past the briefing. **#6 and #7 flags flipped on for the demo cohort.**

#### Feature spec — #6 GP 30-second briefing (auto-summary at top of context card)

| Field          | Value                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Surface        | Top of the GP context card at `/gp/[patientId]/context`. One sentence ≤ 180 characters in serif, with a tiny "AI summary, click to verify" affordance below that expands the **evidence array** as a 1–3-row citation list (each row links to the meal/symptom/thread that was the basis).                                                                                                                 |
| Worker         | `src/inngest/workers/briefing-composer.ts`. Triggered by `meal.approved`, `symptom.created.severe`, or `thread.message.from_dietitian`. Reuses `runStructured()`.                                                                                                                                                                                                                                          |
| Schema         | `BriefingSchema = z.object({ briefing: z.string().max(180), updatedAt: z.string().datetime(), evidence: z.array(z.object({ kind: z.enum(["meal","symptom","thread"]), id: z.string(), excerpt: z.string().max(80) })).min(1).max(3), ...auditTriplet })`. Note: `evidence.length ≥ 1` is enforced by Zod — if the model can't cite, it can't claim.                                                        |
| Prompt         | `gp_briefing` entry in `src/ai/prompts.ts`. Inputs: last 7 days of meals/symptoms/dietitian-thread + last dietitian-approved summary. Output: one sentence, conversational-clinical register. **Hard prompt rules**: (a) never include numeric clinical claims that can't be cited from labs/CGM, (b) never use future-tense predictive language, (c) every claim must point to one of the evidence items. |
| Cache          | 24h Upstash key `briefing:{patient_id}`. Invalidated immediately on the three trigger events. So a fresh meal approval at 2pm produces a re-generated briefing within minutes, not 24h.                                                                                                                                                                                                                    |
| Idempotency    | `(patient_id, hash(input_window))`. Same input window → same briefing.                                                                                                                                                                                                                                                                                                                                     |
| Fallbacks      | Confidence < 0.7 → fall back to the **template briefing**: `"Last contact with Maya: {dietitian_last_message_at_relative}. {pending_review_count} meals awaiting review."` LLMUnconfigured → same template. Validator fails (no evidence cited) → suppress the AI briefing, show the template.                                                                                                             |
| Eval           | `docs/evals/wk-08-briefing.md` — 30 patient-week scenarios (synthetic, derived from the demo cohort) reviewed by a GP advisor for: (a) **clinical defensibility** — 0 over-claims allowed, (b) **information density** — does the sentence carry weight?, (c) **tone** — peer-clinician, not corporate. Pass if all three at ≥ 90%, with defensibility at 100%.                                            |
| Audit          | `gp.briefing.generated`, `gp.briefing.viewed`, `gp.briefing.evidence_expanded`.                                                                                                                                                                                                                                                                                                                            |
| RLS            | Worker reads only the patient it's processing. GP sees only patients in their org's network. RLS test: `tests/permissions/gp_briefing.test.ts`.                                                                                                                                                                                                                                                            |
| Telemetry      | `gp_briefing_shown`, `gp_briefing_evidence_expanded`, `gp_briefing_template_fallback`. The template-fallback rate is the silent quality signal — if it climbs > 20%, the prompt needs review.                                                                                                                                                                                                              |
| A11y           | Briefing is rendered as a `<p>` with `aria-describedby` linking to the evidence list. Evidence affordance is a real `<button aria-expanded>`. Screen reader announces the briefing on card open, then announces "AI summary, three citations available."                                                                                                                                                   |
| Reduced motion | Evidence list expands without animation when reduced motion is set; the briefing itself is static text.                                                                                                                                                                                                                                                                                                    |

**Failure points to watch:**

1. **Over-claiming clinical conclusions.** "HbA1c is improving" when no recent labs exist. **Mitigation:** prompt explicitly forbids claims of clinical metrics not present in the input window. Post-prompt validator regex-rejects `\b(HbA1c|A1C|glucose|fasting|cholesterol|triglyceride|BMI|weight)\b\s+(is|are|has|have)\s+(improving|worsening|stable|trending|increasing|decreasing)` unless the evidence array contains a `kind: "meal"` with a CGM reading or a synthetic-lab event.
2. **Under-informative.** "Asha is doing well." → useless. **Mitigation:** Zod requires `evidence.length ≥ 1`; the prompt requires each clause to be backed by an evidence item. Empty evidence → suppress.
3. **GP relies on it as ground truth.** Stops reading the rest of the card. **Mitigation:** the "AI summary" affordance is **not optional** and **not a hover** — it's an always-visible label below the briefing. Evidence is always one click away. We never present the briefing as authoritative.
4. **Stale briefing on a busy patient.** 24h cache misses a fresh symptom report. **Mitigation:** the three trigger events invalidate immediately; the GP card refresh on open also checks `cached.updatedAt < lastEventAt` and forces regeneration.
5. **Tone drift toward corporate.** "Patient is engaging with the program." **Mitigation:** tone exemplars ("Asha logged 5 of 7 dinners this week — Maya messaged her about the Tuesday curry."). Eval scores tone as a hard dimension.
6. **Evidence excerpt leaks PHI inappropriately.** A symptom excerpt contains identifiable language. **Mitigation:** excerpt sanitiser strips known PHI patterns (phone numbers, addresses, email) before persistence. Evidence excerpts capped at 80 chars.

**Recursive testing:**

- **Loop A:** worker + render + evidence expansion + template fallback.
- **Loop B (Thu eval):** the 30-scenario eval. Vitest for the over-claim regex validator. Playwright: open `/gp/asha/context`, see briefing, click "AI summary", see evidence list, verify citations link to the right meals/symptoms.
- **Loop C:** prompt iteration if defensibility < 100%; the bar is **zero** over-claims.
- **Loop D:** Sat smoke includes (a) audit assertion, (b) RLS test, (c) the trigger-invalidation test (approve a meal, briefing regenerates within 60s).

#### Feature spec — #7 Cuisine-fit referral routing · GP UI (engine landed W5)

| Field          | Value                                                                                                                                                                                                                                                                                                                                                                                                |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Surface        | GP referral card at `/gp/[patientId]/referral`. After GP fills in the patient's reason for referral, the card calls `matchDietitiansForReferral(patient)` (W5 engine) and renders three suggested dietitians as horizontal photo cards: portrait + name + cuisine match badge ("Tamil ✓") + workload indicator ("Available now" / "3-day wait" / "Booking 2 weeks") + one-tap "Refer to {name}" CTA. |
| Engine         | `src/lib/engine/dietitian-matcher.ts` (landed W5). UI calls it through `src/server/services/index.ts:matchDietitiansForReferral()` which adds RLS scoping.                                                                                                                                                                                                                                           |
| Schema         | `DietitianMatchSchema` (landed W5). UI consumes the existing schema; no new fields.                                                                                                                                                                                                                                                                                                                  |
| Cache          | 1h Upstash key `matcher:{patient_id}:{participating_clinics_hash}`. Workload changes within the hour invalidate.                                                                                                                                                                                                                                                                                     |
| Idempotency    | n/a — pure-logic engine.                                                                                                                                                                                                                                                                                                                                                                             |
| Fallbacks      | All dietitians at capacity → card shows "All dietitians in your network are at capacity. {admin_contact} has been notified" + admin gets a ticket. No cuisine match → shows language match with a transparent "(language match — no cuisine specialist available)" sub-label.                                                                                                                        |
| Eval           | UI part: 10 fixture referrals walked by Maya + a real GP — does the GP intuitively pick the top-1 match? Pass if ≥ 8/10. Engine eval is W5's matrix.                                                                                                                                                                                                                                                 |
| Audit          | `referral.match.suggested`, `referral.match.accepted`, `referral.match.rejected_for_other`, `referral.match.zero_capacity`. Rejection reasons captured to feed back into the matcher's outcome history.                                                                                                                                                                                              |
| RLS            | The W5 engine's privacy-boundary filter is the gate. RLS test rerun in W8: `tests/permissions/matcher_no_cross_org_leak.test.ts` runs in CI for every PR touching the GP card.                                                                                                                                                                                                                       |
| Telemetry      | `referral_match_shown`, `referral_match_top1_accepted`, `referral_match_top2_accepted`, `referral_match_top3_accepted`, `referral_match_other_picked`, `referral_match_zero_capacity_shown`. Top-1 acceptance rate is the headline KPI.                                                                                                                                                              |
| A11y           | Three dietitian cards are a `role="radiogroup"`; arrow-keys move between them; Enter accepts. Cuisine badge has a tooltip; workload indicator has descriptive `aria-label` ("Available now: 0 patients in queue").                                                                                                                                                                                   |
| Reduced motion | Card hover-lift becomes a hairline outline change instead of a translate.                                                                                                                                                                                                                                                                                                                            |

**Failure points to watch:**

1. **Workload race.** Two GPs accept the same dietitian simultaneously; both see "Available now"; the dietitian's actual capacity flips while one is mid-confirm. **Mitigation:** at accept-time, the service layer re-checks `workloadAvail` and rejects with "{dietitian} just filled up — try one of these instead" if it dropped below threshold. Optimistic UI rollback.
2. **GP overrides every suggestion ("I always use Maya").** The matcher's value collapses. **Mitigation:** track override rate; if > 60% sustained, surface a quiet admin signal — the matcher is being trained against, possibly because the cuisine taxonomy is wrong for that org.
3. **Suggested dietitian reveals their org name leaking org-internal info.** **Mitigation:** photos and names are public; org name only shown if the dietitian's org has consented to cross-clinic referrals (boolean on `organizations.cross_clinic_visible`).
4. **Cold-start: no outcome history at all.** Newcomer rule covers this for individual dietitians (W5); for an entirely new clinic, all `outcomeFit = 0.5` and the cuisine + workload terms dominate. Documented and acceptable.
5. **Patient cuisine mis-tagged.** A patient's cuisine label was wrong from the start. **Mitigation:** the matcher result page has a small "wrong cuisine?" link that opens a quick re-tag affordance for the GP — the re-tag updates `patients.cuisine` and re-runs the matcher.

**Recursive testing:**

- **Loop A:** UI cards + service-layer wrapping the W5 engine + accept flow.
- **Loop B (Thu eval):** the 10 walkthroughs with Maya + a GP. Playwright: open `/gp/asha/referral`, see 3 suggestions, accept top-1, verify referral row created with `dietitian_id` matching the suggestion.
- **Loop C:** UI fix pass.
- **Loop D:** Sat smoke runs the cross-org leak RLS test + the workload-race test (two simulated accepts; one wins, one rolls back).

---

### Week 9 · Admin polish + KPI page + empty states · **DUAL-TRACK**

> **Polish track (Mon–Tue):** five admin pages. **Feature track (Wed–Thu):** ship **#9 Pilot calibration mode** — schema migration, engine, threshold injection in `applySafety()`, admin cohort view, patient banner, dietitian queue badge.

**Mon** — `/admin/kpi`: hero metric in display (north-star — "patients with HbA1c improvement at 90 days"), supporting metrics as quiet rows, sparkline using the design-token palette. `/admin/audit`: timeline of events with actor, target, time. Filter pill row above. Empty state when filter narrows to zero.
**Tue** — `/admin/organizations`, `/admin/users`, `/admin/patients`, `/admin/referrals`: identical row treatment, identical spacing, hairlines. `/admin/settings`: settings as a single column of toggles with paragraph context, not a panel of cards.
**Wed** — Feature track: ship **#9 Pilot calibration**. Migration `0007_calibration.sql`; engine `src/lib/engine/calibration.ts`; thread the calibration boolean into `applySafety()` so the threshold raises 0.7 → 0.9 per-patient. Admin cohort view at `/admin/calibration`.
**Thu** — Feature track: patient-side calibration banner on `/p/home` ("you are new — Maya is watching closely"); dietitian queue badge on calibration meals. Run eval gate.
**Fri** — Fix pass — both tracks.
**Sat** — Smoke — both tracks.

**Exit gate:** Admin console reads like a product page, not a CRUD app. **#9 calibration mode flag flipped on for the demo cohort; the calibration cohort visible at `/admin/calibration`.**

#### Feature spec — #9 Pilot calibration mode

| Field          | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Surface        | Admin: `/admin/calibration` shows the cohort + outcomes ("3 patients in calibration, average TIR delta vs comparable established patients"). Patient: banner on `/p/home` ("Welcome — your first 2 weeks are calibration. Maya is reviewing every meal closely.") with a one-line opt-out via dietitian message. Dietitian queue: a small "calibration" badge on each calibration meal so the dietitian knows the threshold is raised and they should review even apparently-clean outputs. |
| Engine         | `src/lib/engine/calibration.ts` — pure-logic. `isInCalibration(patient, now)` = `(now < patient.calibration_until)` OR `(now < patient.calibration_overridden_until)`. `effectiveThreshold(patient, now, defaultThreshold)` returns 0.9 in calibration, default otherwise.                                                                                                                                                                                                                  |
| Schema change  | New migration `supabase/migrations/0007_calibration.sql`: `ALTER TABLE patients ADD COLUMN calibration_until timestamptz NOT NULL DEFAULT (created_at + INTERVAL '14 days'), ADD COLUMN calibration_overridden_until timestamptz`. Backfill: existing patients get `calibration_until = NOW() + 14 days` only if `created_at > NOW() - 7 days`; older patients get `calibration_until = created_at + 14 days` (already-expired, fine).                                                      |
| Integration    | `src/ai/safety.ts` — `applySafety()` extended to accept an optional `effectiveThreshold` argument. All workers that load a patient context call `effectiveThreshold(patient, now, CONFIDENCE_THRESHOLD)` and pass it in. The default 0.7 path is unchanged for non-calibration patients.                                                                                                                                                                                                    |
| Mentor pairing | Dietitian queue meal payload extended with `requires_mentor_review: boolean` (true when calibration AND `requires_human_review` is also true). Mentor pairing is a manual step in W9: an admin assigns a senior dietitian as mentor for each calibration patient via `/admin/calibration`. The queue badge surfaces this so the assigned dietitian knows their work will be paired-reviewed.                                                                                                |
| Cache          | Calibration boolean cached in patient context for the request lifetime; not at LLM-call level (it's pure-logic, cheap).                                                                                                                                                                                                                                                                                                                                                                     |
| Idempotency    | n/a.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Fallbacks      | Mentor unavailable (e.g. mentor is on leave) → escalate to senior-dietitian pool (admin-managed list); patient still sees the banner (no patient-visible disruption). Auto-disable rule: at `calibration_until`, the boolean flips to false unless `calibration_overridden_until > now`. **Hard cap:** even with override, calibration cannot exceed 21 days from `created_at` (anxiety risk).                                                                                              |
| Eval           | Shadow-run on the 5 demo patients — verify (a) the threshold actually rises in worker logs (audit `effectiveThreshold` value used), (b) suppression rate climbs as expected, (c) the 14d auto-expiry fires. `docs/evals/wk-09-calibration.md` documents the shadow run.                                                                                                                                                                                                                     |
| Audit          | `calibration.entered`, `calibration.exited`, `calibration.overridden`, `calibration.mentor_assigned`, `calibration.mentor_review_required`. Admin override is a high-trust action and is itself audited with the override reason.                                                                                                                                                                                                                                                           |
| RLS            | Admin sees the cohort scoped to their org. Patient sees only own calibration state. Dietitian sees calibration badge only on assigned-patient meals. RLS test: `tests/permissions/calibration.test.ts`.                                                                                                                                                                                                                                                                                     |
| Telemetry      | `calibration_threshold_applied` (per worker invocation), `calibration_banner_dismissed`, `calibration_mentor_assigned`, `calibration_auto_expired`, `calibration_overridden`. The auto-expired count is the headline operational signal.                                                                                                                                                                                                                                                    |
| A11y           | Patient banner is a real `<aside aria-label="calibration period notice">` with a dismissable button; dismissal hides the banner for 24h but never disables calibration itself (only the dietitian/admin can do that). Queue badge has a descriptive `aria-label` ("calibration patient — review threshold raised to 90%").                                                                                                                                                                  |
| Reduced motion | Banner has no animation in or out. Static.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

**Failure points to watch:**

1. **Anxiety from the banner.** "Maya is watching closely" reads as surveillance. **Mitigation:** copy is reviewed by Maya for warmth; the banner ends with a one-line opt-out via dietitian message ("not sure about this? Tell Maya"). Banner text iterated post-eval if dismissal-without-message rate > 50%.
2. **Threshold injection bypassed.** A new worker forgets to call `effectiveThreshold()` and uses the constant. **Mitigation:** centralise the threshold lookup in `applySafety()` itself — workers pass the patient context, `applySafety()` does the lookup. There is no path for a worker to set its own threshold.
3. **Patient stays in calibration too long.** Override extended again and again. **Mitigation:** **21-day hard cap** in `effectiveThreshold()` — even an admin override cannot push past `created_at + 21 days`. Documented and unit-tested.
4. **Mentor unavailable cascade.** Senior dietitian is on leave; their calibration patients pile up. **Mitigation:** admin-managed pool of senior dietitians; auto-rebalance on `mentor.unavailable` event; admin alert if pool drops below 2 for any org.
5. **The cohort dashboard reveals confidential outcome data.** **Mitigation:** outcomes shown as cohort-aggregate only ("3 patients, avg TIR delta +4.2%"); individual patients are listable but their outcome metrics are gated by RLS to assigned dietitian + admin.
6. **Calibration mode raises threshold so high that everything suppresses.** Patient sees 0 AI nudges for 2 weeks — feels like a broken product. **Mitigation:** the suppression-rate telemetry is the canary; if calibration suppression rate > 70%, prompts get reviewed in the next sprint, not the threshold lowered. Better to suppress quietly than show shaky early output.

**Recursive testing:**

- **Loop A:** migration + engine + `applySafety()` integration + admin view + patient banner + queue badge.
- **Loop B (Thu eval):** shadow run on the 5 demo patients; verify threshold-applied audit rows; commit `docs/evals/wk-09-calibration.md`.
- **Loop C:** copy iteration on the patient banner if dismissal feels wrong.
- **Loop D:** Sat smoke runs the 21-day-cap test (`pnpm vitest run tests/calibration/hard_cap.test.ts`) + the workers-respect-effective-threshold test (each worker is invoked in calibration context; suppression count rises as expected).

---

### Week 10 · Cross-cutting motion + perf + brand pass · feature: #10 weekly photograph delivery

> Polish work spans the week. The **#10 weekly photograph delivery** ships on Wed: the W2 scaffold becomes a real Sunday-cron-triggered push notification with the live composition pipeline.

**Mon** — Shared-layout transitions: when a patient row in `/d/patients` is clicked, the avatar photograph animates into the hero of `/d/patients/[id]` (Framer Motion `layoutId`).
**Tue** — Same for `/p/plan` → `/p/plan/[slug]` (meal thumbnail expands into hero).
**Wed** — Performance budget: every page < 16ms render on M1 / iPhone 12. Identify and fix any janky transitions. Lighthouse all 33 routes. **Ship #10 weekly photograph delivery** — Sunday 8pm Inngest cron, push notification, fallback `/p/home` card.
**Thu** — Brand pass: tighten the wordmark, consider a subtle accent line under "Measured" in the header. Sign-in page redesign with hero photograph. Run #10 eval.
**Fri** — Fix pass.
**Sat** — Final smoke. Tag `v1.2.0` (jumping from v1.0.0 → v1.2.0 to mark the AI feature suite milestone; v1.1.0 was the polish-only milestone tagged at end of W6).

**Exit gate:** All 33 routes Lighthouse Performance ≥ 95, Accessibility = 100. No emoji where a photograph belongs. **#10 delivery flag flipped on for the demo cohort; first Sunday push fires successfully.** Stefan opens the app on his phone and texts "holy shit."

#### Feature spec — #10 Weekly photograph card · delivery (scaffold landed W2)

| Field          | Value                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Surface        | Sunday 8pm push notification with the rendered PNG. Tap notification → opens the card full-screen at `/p/week-card/{iso_week}`. Always-available fallback: a "this week" card on `/p/home` for patients with push permission revoked.                                                                                                                                                                      |
| Worker         | `src/inngest/workers/weekly-photograph.ts`. **Cron trigger:** `0 20 * * 0` (Sunday 8pm in patient's local timezone — uses `patient.timezone`, not server time, so AEST/IST/etc. all fire at 8pm local). Steps: (1) call `mealOfWeek()` engine (W2), (2) call `meal-lesson-composer` worker (W4) with the `weekly_summary` variant, (3) render PNG via `MealCollage`, (4) upload to Storage, (5) send push. |
| Schema         | `WeeklyPhotographSchema = z.object({ pngStoragePath: z.string(), altText: z.string(), pickedMealId: z.string(), sentence: z.string().max(120), generatedAt: z.string().datetime(), idempotencyKey: z.string() })`. The auditTriplet from #8 (which composed the sentence) propagates.                                                                                                                      |
| Storage        | `weekly-cards` Supabase Storage bucket (added to `0003_storage.sql`): patient can read own; never writeable by anyone except the worker. Auto-expire at 90d (patients can screenshot if they want it forever).                                                                                                                                                                                             |
| Cache          | Per `(patient_id, iso_week)`. Cron retries hit the same key and skip if already generated.                                                                                                                                                                                                                                                                                                                 |
| Idempotency    | `(patient_id, iso_week)`. Same week, same patient, same selection (deterministic engine), same PNG bytes (deterministic composition).                                                                                                                                                                                                                                                                      |
| Fallbacks      | Zero approved meals this week → no card; instead a single one-line nudge push: "Quiet week? Snap your next meal — Maya is here when you're ready." PNG generation fails → fall back to a single-image card (first meal photo + sentence, no collage). Push permission revoked → store the card on `/p/home` for the patient to see when they next open the app; in-app banner "your weekly card is ready." |
| Eval           | `docs/evals/wk-10-weekly-card-delivery.md` — render and deliver a card to each of the 5 demo patients across 2 simulated weeks (10 cards total). Hand-review the **end-to-end** (selection → composition → push → tap → full-screen view). Pass if 10/10 deliver + ≥ 9/10 are "would screenshot."                                                                                                          |
| Audit          | `weekly_card.generated`, `weekly_card.delivered`, `weekly_card.viewed`, `weekly_card.shared`, `weekly_card.opt_out_clicked`. The opt-out is a one-tap "less of these" link in the card footer that mutes for 4 weeks.                                                                                                                                                                                      |
| RLS            | Worker writes to the patient's own bucket prefix only. Patient reads own only. RLS test: `tests/permissions/weekly_card.test.ts` proves a patient cannot read another patient's card path.                                                                                                                                                                                                                 |
| Telemetry      | `weekly_card_generated`, `weekly_card_push_sent`, `weekly_card_push_opened`, `weekly_card_in_app_viewed`, `weekly_card_shared`, `weekly_card_opt_out`. Open rate and share rate are the headline KPIs.                                                                                                                                                                                                     |
| A11y           | The PNG ships with descriptive alt text generated alongside it ("Your week in food: dal-rice on Tuesday, plus 3 other meals"). Full-screen view at `/p/week-card/{iso_week}` is fully readable text-equivalent for screen readers — the photograph is the experience, the text is the substance.                                                                                                           |
| Reduced motion | Push opens the full-screen card without animation (no shared-element transition into the photo). Static fade.                                                                                                                                                                                                                                                                                              |

**Failure points to watch:**

1. **Visual quality regression vs the W2 scaffold.** Live data has variance the demo cohort didn't. **Mitigation:** visual regression baseline expanded to 20 weeks across the demo cohort (vs 3 in W2). Gate at < 0.1% pixel diff for the rendered PNG against the W2 baseline + new live data baselines.
2. **PNG generation cost spike.** Rendering 50 cards every Sunday at 8pm is fine; rendering 5,000 at GA scale isn't. **Mitigation:** the cron sharded across the hour by patient ID hash so we render at ~ 80/min, not 5,000 in a burst.
3. **Push delivery silently fails.** APNs/FCM dropped the message. **Mitigation:** push delivery confirmed via callback; if no confirmation in 60s, retry once; if still failing, the in-app `/p/home` fallback fires the next time the patient opens the app. We **never** assume the push got through.
4. **Patient hates the cadence.** Sunday at 8pm is bath time / family dinner / anything. **Mitigation:** the opt-out is one tap from the card itself. Mutes for 4 weeks. Telemetry on the opt-out rate; if > 20%, we revisit cadence.
5. **Locale/RTL break in the rendered PNG.** Devanagari name in the sentence overlay clips. **Mitigation:** font stack with Arabic/Devanagari fallbacks (mentioned in W2 scaffold spec); rendering tested with one RTL/CJK fixture in the eval.
6. **The card feels patronising.** "You did great this week!" → cringe. **Mitigation:** the sentence comes from the #8 lesson composer with the `weekly_summary` variant; the W4 tone gate carries forward. Eval scores tone explicitly.
7. **Quiet-week nudge feels nagging.** A patient who deliberately skipped logging gets nudged. **Mitigation:** the nudge fires only if the patient opened the app at least once this week (signal of engagement); if they didn't open, no nudge — silence.

**Recursive testing:**

- **Loop A:** worker + cron + push wiring + storage bucket + full-screen view + opt-out + in-app fallback.
- **Loop B (Thu eval):** the 10-card end-to-end run; commit `docs/evals/wk-10-weekly-card-delivery.md`. Visual regression run against the expanded baseline. Playwright: simulate Sunday cron, observe push (mocked transport), tap the notification, see the full-screen card. Reduced-motion run.
- **Loop C:** any visual or copy fix.
- **Loop D:** Sat smoke includes (a) the cron simulation produces 5/5 cards for the demo cohort, (b) the audit trail rows exist, (c) the RLS test for cross-patient leak, (d) the opt-out test (one tap mutes for 4 weeks), (e) push-failure simulation falls back to the in-app card.

---

## Recursive 2-loop test rhythm

Re-using the Stage 1–8 cadence:

1. **Loop A (Mon–Wed):** Build the week's surfaces.
2. **Loop B (Thu):** Test against acceptance bar — Lighthouse, accessibility, motion, photography, reduced-motion, dark-mode (if added in Week 1).
3. **Loop C (Fri):** Fix everything Loop B surfaces.
4. **Loop D (Sat):** Build + lint + 174+ tests + 33 routes 200. Tag the week.

If Loop B shows ≥ 3 acceptance failures, the week extends to Sun and we don't move on. No surface "ships polished" while another is half-done.

---

## All 10 game-changer features · week mapping

All 10 ideas Stefan reviewed are now woven into the 10-week plan. The full per-feature spec, prompt rules, schema, eval, audit, RLS, telemetry, and failure-points block lives in the week where the feature ships. The table below is the index.

| #   | Feature                             | Week   | Surface                                             | LLM? | Spec link                                                                                                                                                          |
| --- | ----------------------------------- | ------ | --------------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | CGM ↔ meal hover popout (flagship)  | W7     | `/p/metrics`, `/d/patients/[id]`                    | yes  | [W7 spec](#feature-spec--1-cgm--meal-hover-popout-flagship)                                                                                                        |
| 2   | "Ask the kitchen" pantry → meal     | W3     | `/p/meal`                                           | yes  | [W3 spec](#feature-spec--2-ask-the-kitchen-pantry-photo--tonights-meal)                                                                                            |
| 3   | "Same as Monday lunch?" one-tap log | W3     | `/p/meal`                                           | no   | [W3 spec](#feature-spec--3-same-as-monday-lunch-one-tap-log)                                                                                                       |
| 4   | Voice-note symptom logging          | W4     | `/p/symptoms`                                       | yes  | [W4 spec](#feature-spec--4-voice-note-symptom-logging)                                                                                                             |
| 5   | Dietitian swap-drag                 | W6     | Patient Detail v2 meal log                          | yes  | [W6 spec](#feature-spec--5-dietitian-swap-drag-drag-any-ingredient--3-cuisine-aligned-swaps)                                                                       |
| 6   | GP 30-second briefing               | W8     | `/gp/[patientId]/context`                           | yes  | [W8 spec](#feature-spec--6-gp-30-second-briefing-auto-summary-at-top-of-context-card)                                                                              |
| 7   | Cuisine-fit referral routing        | W5+W8  | engine W5; GP UI on `/gp/[patientId]/referral` W8   | no   | [W5 engine](#feature-spec--7-cuisine-fit-referral-matcher--engine-ui-lands-w8) · [W8 UI](#feature-spec--7-cuisine-fit-referral-routing--gp-ui-engine-landed-w5)    |
| 8   | "Why this works" patient nudge      | W4     | `/p/plan`, `/p/home`                                | yes  | [W4 spec](#feature-spec--8-why-this-works-patient-nudge-one-line-lesson-per-meal)                                                                                  |
| 9   | Pilot calibration mode              | W9     | `/admin/calibration`, `/p/home` banner, queue badge | no\* | [W9 spec](#feature-spec--9-pilot-calibration-mode)                                                                                                                 |
| 10  | Weekly photograph card              | W2+W10 | scaffold W2; Sunday cron + push delivery W10        | no\* | [W2 scaffold](#feature-spec--10-weekly-photograph-card--pipeline-scaffold) · [W10 delivery](#feature-spec--10-weekly-photograph-card--delivery-scaffold-landed-w2) |
| 11  | **Billing intelligence (phased)**   | W1→W10 | `/gp/[patientId]/billing` (5 progressive phases)    | yes  | [§ Feature #11 — Billing intelligence (phased rollout)](#feature-11--billing-intelligence-phased-rollout)                                                          |

\* Calibration is no-LLM in itself but raises the threshold for #1, #5, #8. Weekly photograph composes its sentence by reusing the #8 worker — no new LLM call, just a different prompt variant.

**Implementation order ends up:** foundation (W1) → #10 scaffold + **#11 P1 indicative** (W2) → #2, #3 + **#11 P2 dynamic state** (W3) → #4, #8 (W4) → #7 engine + **#11 P3 rule engine** (W5) → #5 (W6) → **#1 flagship (W7)** → #6, #7 UI + **#11 P4 AI deep-dive** (W8) → #9 + **#11 P5 MBS RAG** (W9) → #10 delivery + **#11 P5 submission UI** (W10). The recommended ship-first three (#1, #6, #8) all land mid-late once the Photo primitive (W1), embedding pipeline (W3), tone gate (W4), and audit hooks are in place — they earn the trust their high visibility requires.

---

## Feature #11 - Billing Intelligence (phased rollout)

Billing Intelligence is now a dedicated companion plan at `docs/plans/billing-feature-11.md`.

It adds a GP billing copilot for `/gp/[patientId]/billing` that scans patient needs, conversation history, symptoms, meals, referrals, and care-plan context, then suggests Australian Medicare billing candidates with rationale, evidence, missing prerequisites, and GP-verification guardrails. It starts as an indicative static demo and graduates across the 10-week plan into a live MBS-guideline retrieval system.

| Phase | Week   | Capability                                                 | Production stance                             |
| ----- | ------ | ---------------------------------------------------------- | --------------------------------------------- |
| P1    | Now/W2 | Static evidence-backed example on the GP billing card      | Demo only; no AI; no guideline retrieval      |
| P2    | W3     | Deterministic local needs scanner over patient context     | No LLM; rules tested against fixture patients |
| P3    | W5     | Structured Australian MBS rule engine with source URLs     | Official-source citations required            |
| P4    | W8     | AI deep-dive over conversation history and patient context | Eval-gated; every suggestion needs evidence   |
| P5    | W9-W10 | Live MBS retrieval + audit-safe copy/task workflow         | Suppress AI if source cannot be cited         |

**Hard rule:** the feature never says an item is claimable and never auto-submits billing. It suggests candidates, explains why, cites evidence, lists blockers, and leaves the GP accountable.

---

## Risks and mitigations · cross-cutting

Seven risk classes apply across the whole plan, not just one feature. Each is mitigated by a concrete, testable mechanism.

### R1 — LLM cost spike

**The risk:** 10 AI features at pilot scale = ~ 137 calls/day = ~ $0.21/day. At 5,000 patients = ~ 13,700 calls/day = ~ $21/day. The numbers are fine. The risk is a runaway: a worker retry storm, a cache miss on a hot key, a malicious request, an infinite loop on an empty result.

**Mitigations:**

- Per-(patient, feature, day) Upstash counters checked **before** every LLM call (gate #6 of the bulletproof framework).
- Idempotency keys on every cache (gate #7) — retries never re-bill.
- Sentry alert at 2× projected daily spend, not at $100; we want to know within an hour, not at the end of the month.
- One-shot circuit breaker: if any worker exceeds 3× its expected volume in a 1h window, the worker pauses (Inngest concurrency = 0) and Stefan + Maya are alerted.

### R2 — Confidence-gate over-suppression

**The risk:** Threshold 0.7 (and 0.9 in calibration) is calibrated to reject bad output. If we set it too high, too many fallbacks erode trust. Patient sees "Maya will review" five times in a row → the AI feels broken.

**Mitigations:**

- **Track suppression rate per feature in PostHog** as a first-class operational metric. > 25% sustained → retune the prompt before changing the threshold.
- The fallback copy is itself reviewed by Maya so a suppression doesn't read like a failure.
- Calibration's 21-day hard cap (W9) prevents indefinite high-threshold misery.

### R3 — Cultural appropriateness

**The risk:** The single highest-stakes editorial risk. Suggesting pork to a halal patient. Suggesting beef to a Hindu patient. Suggesting a swap that violates a religious or cultural restriction.

**Mitigations (defence-in-depth):**

- **Pre-prompt restriction filter** — the worker never sends `patient.restrictions[]` to the LLM as a soft suggestion; the prompt receives them as **hard exclusions** with explicit instruction to refuse.
- **Post-prompt validator** — every LLM output re-checked against the same restriction list; violators silently dropped.
- **Eval gate at 100%** for cultural appropriateness (vs ≥ 90% for everything else). One violation in the eval = the feature flag does not flip on.
- **Per-feature eval sets curated by cuisine** — each of #2, #5, #8, #10 has cuisine-balanced eval sets, not "general" ones.
- Maya reviews every eval. Stefan reviews tone calls.

### R4 — Privacy boundary on referral routing (#7)

**The risk:** Suggesting a dietitian outside the patient's clinic network — exposes practitioner names, workloads, and outcome data they didn't consent to share.

**Mitigations:**

- **`participating_clinics(patient.org_id)` filter runs BEFORE scoring** in `dietitian-matcher.ts`. The scoring function literally cannot see outside-network dietitians.
- **`tests/permissions/matcher_no_cross_org_leak.test.ts`** — a named, must-pass RLS test. CI-blocking.
- The test runs every PR that touches the matcher OR the GP card OR `participating_clinics` SQL helper.
- Reviewed by Stefan (legal posture) before launch.

### R5 — Anxiety from calibration (#9)

**The risk:** "Maya is watching closely" reads as surveillance. Patient feels mistrusted. Trust collapses in week 1.

**Mitigations:**

- Copy reviewed by Maya for **warmth** — peer language, not clinical.
- Banner offers a one-tap path to message Maya about it ("not sure about this? Tell Maya").
- 21-day hard cap; no admin can extend past it.
- Telemetry: dismissal-without-message rate is the canary. > 50% → copy iteration in the next sprint.

### R6 — Single-feature failure dragging the polish week

**The risk:** A feature's eval gate fails on Thu. The week's polish is done but the feature isn't. We're tempted to ship the feature anyway because the surrounding polish needs it.

**Mitigations:**

- **Feature flags are mandatory** — the polish work always ships, the feature stays behind its flag if the gate is red.
- **Sun overflow rule** allows one week to extend by a day if eval is close.
- **W11 buffer** added explicitly if any week overruns by > 1 day twice.
- **Default plan stays 10 weeks; the buffer is contingency, not committed.**

### R7 - Billing intelligence over-claim

**The risk:** A GP sees an item suggestion and treats it as Medicare authorization, or the model hallucinates an MBS item number.

**Mitigations:**

- Billing copy uses "candidate", "may support", and "needs GP verification" language only.
- Every suggestion must include evidence and missing prerequisites; no evidence means no suggestion.
- Phase 3 requires official-source URLs on every structured rule.
- Phase 5 suppresses AI if the official MBS source cannot be retrieved or cited.
- Eval gate for Phase 4/5 requires 0 hallucinated item numbers and 0 unsupported evidence chains.

---

## Decision log

| Date       | Decision                                                                                                                                                                                   | Owner  | Notes                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ | ------------------------------------------------------------------------------- |
| 2026-05-22 | **Approved.** All 10 game-changer features ship across the 10-week plan, in week order: scaffold #10 → #2, #3 → #4, #8 → #7 engine → #5 → **#1 flagship** → #6, #7 UI → #9 → #10 delivery. | Stefan | Default plan stays 10 weeks; W11 buffer is contingency, not committed.          |
| 2026-05-22 | Bulletproof framework adopted as the gate every AI feature must pass before flag-flip. 15-point checklist + eval / cost / audit / Sun-overflow / dual-track rules.                         | Stefan | Codified above the W1 section.                                                  |
| 2026-05-22 | **Added Feature #11 Billing Intelligence.** Phased from static GP billing demo to live MBS guideline retrieval with evidence-backed suggestions and no auto-claiming.                      | Stefan | Detailed companion plan lives in `docs/plans/billing-feature-11.md`.            |
| _tbd_      | Confirm photography license posture (Unsplash placeholder → photographer-credited at GA, ~ 80 dish shots covering 8 cuisines)                                                              | Stefan | Budget conversation ahead of the v1.2.0 tag at end of W10.                      |
| _tbd_      | Confirm GP advisor for the W8 briefing eval (need a real GP to score the 30 patient-week scenarios for clinical defensibility).                                                            | Stefan | Maya can stand in for first cut, but a GP advisor is required before flag-flip. |
| _tbd_      | Confirm Sentry alert thresholds for LLM cost circuit breakers (R1).                                                                                                                        | Stefan | Default: alert at 2× projected daily spend per feature.                         |

---

## Open questions for review

1. **Photography licensing at GA** — Unsplash is fine for pilot. At launch we commission a photographer for ~ 80 dish shots covering the 8 cuisines. Budget conversation pending.
2. **GP advisor for #6 eval** — the briefing's clinical-defensibility eval needs a real GP scoring 30 patient-week scenarios. Maya can stand in for first cut; GP advisor required before flag-flip.
3. **Cron timezone source for #10 delivery** — uses `patient.timezone` (each patient gets 8pm local). Confirm this column is populated for all existing demo patients before W10 (it should be — added in Stage 5 schema).
4. **Push notification provider for #10** — Web Push (browser) for the PWA is straightforward. iOS native push requires APNs credentials and an Apple Developer account; this work is out-of-scope for the v1.2.0 tag and the in-app `/p/home` fallback covers iOS users until APNs is wired.
5. **W11 buffer commitment** — currently contingency. If any of W3, W4, W6, W8, W9 (the dual-track weeks) overrun by > 1 day, do we automatically allocate W11 or check in first?
6. **Australian Medicare source posture for #11** — Phase 5 should use official MBS Online pages or a curated legal-approved snapshot. Confirm whether live retrieval is acceptable for pilot, or whether a versioned snapshot is mandatory.
