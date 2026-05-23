# Measured Metabolics — UI Polish 10-Week Plan

> **Status:** Draft · awaiting review
> **Companion to:** `docs/planning.md` (Stages 1–8) · `docs/plans/patient-detail-nutrium.md` (Patient Detail v2)
> **North star:** Measured should look — and feel — like a product Apple's Health team would ship. Less blocky, more typographic, more photographic, more motion that earns its keep. Nothing on-screen unless it carries weight.
> **Non-goals:** No new clinical surfaces. No backend reshape. No design system from scratch. We are _polishing_ the existing surfaces, not reinventing them.

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

## 10 weeks · daily breakdown

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

---

### Week 3 · Patient PWA polish — Home, Meal, Plan

**Mon** — `/p/home`: rework the hero card. Hero photo + display heading + one CTA. Secondary actions reduced to a hairline rail. Apple-style "good morning" feel.
**Tue** — `/p/meal`: capture flow gets a proper full-bleed camera preview, blur-up frame on capture, success state photograph.
**Wed** — `/p/plan`: each plan day is a horizontal rail of meal photos (not cards). Tap a photo to open the recipe. The recipe page already has the hero treatment; add scroll-driven parallax on the hero photograph.
**Thu** — Reduced-motion + 1x / 3x DPR check on real iPhone if available.
**Fri** — Fix pass.
**Sat** — Smoke.

**Exit gate:** `/p/home`, `/p/meal`, `/p/plan`, `/p/plan/[slug]` all read as Apple-grade on a phone.

---

### Week 4 · Patient PWA polish — Metrics, Symptoms, Messages, Privacy

**Mon** — `/p/metrics`: CGM line gets a soft area fill, hairline grid only, target band as a tinted strip. Numbers in display weight, not card-heavy.
**Tue** — `/p/symptoms`: faces / icons in a single row that responds to selection with spring scale, not bordered tiles. Severity slider replaces the segmented control.
**Wed** — `/p/messages`: bubble-less chat. Maya's messages anchored left in serif, patient replies anchored right in system. Quiet timestamps. Read-receipts as faint glyph.
**Thu** — `/p/settings/privacy`: 3-tier consent presented as toggles with one paragraph each, no card chrome.
**Fri** — Fix pass.
**Sat** — Smoke.

**Exit gate:** Patient PWA — every screen — feels like one product, not eight.

---

### Week 5 · Dietitian Web polish — Dashboard, Patients, Referrals

**Mon** — `/d/dashboard`: ditch the four equal stat cards. One headline metric in display, three supporting metrics as quiet text rows. Open queue CTA gets the only real shadow on the page.
**Tue** — `/d/patients`: list view with photo avatars, hairline rows, sticky header with one search input that filters live.
**Wed** — `/d/referrals`: timeline view, each referral a row with patient photo + cuisine chip + GP name + "open" affordance only on hover.
**Thu** — Keyboard-first audit: every action reachable in ≤ 2 keystrokes, visible ⌘+key hints in a pill at the top of the screen.
**Fri** — Fix pass.
**Sat** — Smoke.

**Exit gate:** Dietitian feels like a power-user web product, not a dashboard.

---

### Week 6 · Patient Detail v2 (executes the Nutrium plan)

> Implements `docs/plans/patient-detail-nutrium.md` against the Week 1–2 token + photo system.

**Mon** — Pure-logic landings: `cuisine-fit.ts` + `mbs-rule-engine.ts`, both with full Vitest coverage.
**Tue** — Two-pane layout: left = day strip + meal log, right = macro panel + cuisine fit + GP coordination strip.
**Wed** — Per-meal expanded log: photograph, AI summary, macros, dietitian-editable note.
**Thu** — GP coordination strip + billing autopilot strip pinned right.
**Fri** — Fix pass.
**Sat** — Smoke.

**Exit gate:** `/d/patients/[id]` reads as the heart of the dietitian product. Nutrium-class density, Measured-class restraint.

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

---

### Week 8 · GP Sidebar polish + 30-second briefing

**Mon** — `/gp/[patientId]/context`: top of card gets a one-sentence **30-second briefing** that auto-updates from the latest dietitian summary. Bullet density reduced 40%.
**Tue** — Transcript card: serif quote treatment, hairline divider per turn, AI-SOAP draft folds out only on hover.
**Wed** — Billing card: MBS hints as quiet pills, one row per item, "copy to clinic note" as the only loud action.
**Thu** — Care plan + referral cards: identical typography, identical spacing, identical motion.
**Fri** — Fix pass.
**Sat** — Smoke.

**Exit gate:** GP can review a patient in 30 seconds without scrolling past the briefing.

---

### Week 9 · Admin polish + KPI page + empty states

**Mon** — `/admin/kpi`: hero metric in display (north-star — "patients with HbA1c improvement at 90 days"), supporting metrics as quiet rows, sparkline using the design-token palette.
**Tue** — `/admin/audit`: timeline of events with actor, target, time. Filter pill row above. Empty state when filter narrows to zero.
**Wed** — `/admin/organizations`, `/admin/users`, `/admin/patients`, `/admin/referrals`: identical row treatment, identical spacing, hairlines.
**Thu** — `/admin/settings`: settings as a single column of toggles with paragraph context, not a panel of cards.
**Fri** — Fix pass.
**Sat** — Smoke.

**Exit gate:** Admin console reads like a product page, not a CRUD app.

---

### Week 10 · Cross-cutting motion + perf + brand pass

**Mon** — Shared-layout transitions: when a patient row in `/d/patients` is clicked, the avatar photograph animates into the hero of `/d/patients/[id]` (Framer Motion `layoutId`).
**Tue** — Same for `/p/plan` → `/p/plan/[slug]` (meal thumbnail expands into hero).
**Wed** — Performance budget: every page < 16ms render on M1 / iPhone 12. Identify and fix any janky transitions. Lighthouse all 33 routes.
**Thu** — Brand pass: tighten the wordmark, consider a subtle accent line under "Measured" in the header. Sign-in page redesign with hero photograph.
**Fri** — Fix pass.
**Sat** — Final smoke. Tag `v1.1.0`.

**Exit gate:** All 33 routes Lighthouse Performance ≥ 95, Accessibility = 100. No emoji where a photograph belongs. Stefan opens the app on his phone and texts "holy shit."

---

## Recursive 2-loop test rhythm

Re-using the Stage 1–8 cadence:

1. **Loop A (Mon–Wed):** Build the week's surfaces.
2. **Loop B (Thu):** Test against acceptance bar — Lighthouse, accessibility, motion, photography, reduced-motion, dark-mode (if added in Week 1).
3. **Loop C (Fri):** Fix everything Loop B surfaces.
4. **Loop D (Sat):** Build + lint + 174+ tests + 33 routes 200. Tag the week.

If Loop B shows ≥ 3 acceptance failures, the week extends to Sun and we don't move on. No surface "ships polished" while another is half-done.

---

## ⭐ 10 minimalist, high-impact, low-friction game-changer ideas

> **Brief from Stefan:** "brainstorm more game changers like CGM hover, list 10 minimalist high impact low friction feature ideas at the bottom of the planning doc for me to explore and approve."
>
> Each idea below has been pressure-tested against three filters: **(a)** does it create a moment a competitor can't easily copy? **(b)** does it keep the screen quieter, not louder? **(c)** can it ship in ≤ 2 weeks of focused work?

### 1. CGM ↔ Meal hover popout with AI micro-improvements _(Week 7 of this plan)_

The flagship. Already specified above. **Why it's a game-changer:** turns the CGM graph from a passive chart into an active teaching surface. Dietitian goes from "let me write you a note" to "here are three swaps in five seconds." Patient goes from "my number was high" to "I see _why_ and what changes it." No competitor in the AU market does this.

### 2. "Ask the kitchen" — pantry photo → tonight's meal

Patient takes one photo of their open fridge or pantry. AI picks **one meal from their existing approved plan** they can make tonight with what's visible. Not a new recipe — a confidence-builder for the plan they already have. **Friction:** one tap. **Value:** removes the "I don't know what to cook" failure mode that kills most diet plans on day 4.

### 3. "I ate the same thing" one-tap log

If today's meal looks like a meal logged in the last 7 days (cosine similarity on the AI vision embedding), the camera-screen offers a single chip: _"Same as Monday lunch?"_ — tap to log without re-photographing. **Why it works:** real eating life is repetitive. Saves 90% of capture friction for the 60% of meals that repeat.

### 4. Voice-note symptom logging

Hold-to-record for 5 seconds: _"Felt nauseous after lunch, stomach cramped for an hour."_ AI transcribes + structures into the existing symptoms schema (severity, duration, trigger candidates). **Why it works:** typing symptoms into a form is the most-skipped task in chronic-care apps. Speaking them is already what patients do — we just capture it.

### 5. Dietitian "swap drag" — drag any ingredient, AI proposes 3 cuisine-aligned swaps

In Patient Detail v2, dietitian long-presses any food in any meal log → drag it slightly → release. AI proposes 3 swaps with macro deltas + cuisine fit %. One tap to send to patient as a "for next time" suggestion. **Why it works:** turns a 5-minute custom-message exercise into a 5-second gesture.

### 6. GP "30-second briefing" auto-summary _(Week 8)_

Top of every GP context card: a single dietitian-translated sentence that auto-updates after every approved meal. Examples:

- _"Asha is on track. Last meal flagged for high carb load — Maya messaged her with a swap."_
- _"Priya's glucose ran high three days this week. Maya is reviewing her Friday plan."_
  **Why it works:** GP has 6 minutes per consult. We give them 5 seconds of context that cost them zero attention.

### 7. Cuisine-fit referral routing for GPs

When a GP starts a referral, the system suggests the **best-fit dietitian across all participating clinics** by cuisine match × current workload × outcome history. One-tap accept. **Why it works:** patient gets a dietitian who already knows their food culture; dietitian gets caseload they're suited for; GP doesn't have to know who's available where.

### 8. "Why this works" patient nudge

Every approved meal in the patient's plan shows a one-line dietitian-translated explanation auto-generated from the meal vision + CGM impact. _"This kept your glucose flat. Notice the legumes? They slow the rice."_ **Why it works:** patients comply with what they understand. We turn every meal into a 6-word lesson.

### 9. Pilot calibration mode

For a patient's first 2 weeks: AI confidence threshold raised from 0.7 → 0.9, every flagged meal explicitly paired to a dietitian-mentor pairing for review, "you're new — Maya is watching closely" copy on the patient side. After 2 weeks, normal thresholds. **Why it works:** the highest-risk window for any AI-augmented care product is the first fortnight. Calibration mode + visible mentorship = both safety _and_ trust-building.

### 10. Weekly photograph card

Every Sunday at 8pm, patient gets a single push: a **photo collage of their best meal of the week** + one sentence from Maya. _"This was your Tuesday dinner. You hit your time-in-range. More like this please."_ No data, no charts, no streaks — just a beautiful photograph + a sentence. **Why it works:** every retention-focused chronic-care app overspends on streaks and badges. We send one photograph. Patients screenshot it. They show their family. The product becomes part of how they feel about themselves.

---

## Decision log placeholders

| Date  | Decision                                                                                 | Owner         | Notes |
| ----- | ---------------------------------------------------------------------------------------- | ------------- | ----- |
| _tbd_ | Approve / amend the 10-week plan                                                         | Stefan        |       |
| _tbd_ | Pick which 3 of the 10 game-changer ideas ship first                                     | Stefan + Maya |       |
| _tbd_ | Confirm photography license posture (Unsplash placeholder → photographer-credited at GA) | Stefan        |       |

---

## Open questions for review

1. **Order of operations** — does Stefan want Patient Detail v2 (Week 6) before or after the CGM hover (Week 7)? Currently Week 6 lands first because it gives the dietitian view a place to _show_ the popover.
2. **Photography licensing at GA** — Unsplash is fine for pilot. At launch we likely commission a photographer for ~ 80 dish shots covering Stefan's 8 cuisines. Budget?
3. **AI cost ceiling** — `mealMicroImprover` is invoked **per meal hover**. At 1 dietitian × 50 patients × 4 meals/day, that's 200 invocations/day per dietitian. Cache aggressively (same meal, same patient → cached for 7 days). Acceptable?
4. **Game-changer first cut** — recommend shipping #1, #6, and #8 first. They share the same AI provider, the same audit hooks, and they collectively turn the product from "log meals" into "understand meals."
