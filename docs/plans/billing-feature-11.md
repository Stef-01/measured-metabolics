# Feature #11 - Billing Intelligence

> **Status:** Added 2026-05-22 after usability review
> **Surface:** `/gp/[patientId]/billing`
> **Goal:** Help Australian GPs and clinics identify billable Medicare services from the patient's clinical needs, conversation history, dietitian notes, symptoms, referrals, and care-plan context. The system must suggest, justify, and cite - never auto-claim.

## Product thesis

Billing is not an admin afterthought. For health providers, it is workflow viability. If Measured can notice unmet care-plan, team-care, allied-health, review, and mental-health needs from the patient record, then explain the likely Australian Medicare pathway with clear evidence, the GP gets a practical reason to keep using the platform.

The feature must avoid becoming a "claim maximizer." It is a **documentation and eligibility assistant**:

- It scans the patient's measurable needs and conversation history.
- It maps those needs to Australian MBS guideline candidates.
- It lists rationale, evidence, missing prerequisites, and "do not bill yet" blockers.
- It makes the GP copy a note or create a task; the GP remains accountable.

## Five-phase rollout

### Phase 1 - Indicative static demo (now)

**What ships:** A hand-authored example on `/gp/asha/billing` that feels like the final product without AI or live Medicare retrieval.

**Data source:** Static fixtures in `src/lib/mock/billing-suggestions.ts`.

**Behavior:**

- Header says the system scanned meals, symptoms, referral, thread messages, and patient conditions.
- Cards suggest MBS candidates with confidence, rationale, estimated rebate, missing prerequisites, and evidence quotes.
- Each card has "copy justification" and "create task" actions.
- A phase ladder at the bottom shows how the demo evolves to live MBS intelligence.

**Failure points to watch:**

- Static examples overpromise the final feature.
- Copy implies billing certainty.
- GP cannot see why a suggestion appeared.

**Gate:** Every suggestion must include at least one evidence quote and at least one missing-prerequisite or safety note.

### Phase 2 - Dynamic local scan (implemented)

**Week target:** W3, alongside patient-data flow polish.

**What ships:** Deterministic scanner over local mock data, no LLM.

**Implemented now:** `src/lib/engine/billing-needs-scanner.ts` scans patient conditions, referral status, dietitian thread messages, symptom logs, and meal-risk patterns. `/gp/[patientId]/billing` now uses the scanner output for every demo patient instead of showing only Asha's Phase 1 hand-authored example.

**Implementation:**

- `src/lib/engine/billing-needs-scanner.ts`
- Inputs: `Patient`, `MessageThread`, `SymptomLog[]`, `Referral`, recent meals, current care plan.
- Output: `BillingNeed[]` with evidence IDs and scored triggers.

**Example rules:**

- Multi-condition chronic disease + allied-health coordination -> GPMP / TCA review candidate.
- Severe nausea + medication question -> medication review or GP follow-up task, not necessarily billable yet.
- Dietitian referral plus active chronic-disease plan -> allied-health item pathway candidate.

**Failure points:**

- Rule duplication with future AI worker.
- Over-triggering for every patient.
- Missing "do not bill yet" states.

**Gate:** 20 fixture patients with expected candidate counts; false positives under 15%.

### Phase 3 - Australian MBS rule engine (implemented)

**Week target:** W5, before GP sidebar polish.

**What ships:** Structured Australian Medicare rule definitions, still no LLM.

**Implemented now:** `src/lib/mbs/rules.ts` stores source-cited rule metadata for MBS 721, 723, and 10954. `src/lib/mbs/evaluate.ts` evaluates scanner needs against prerequisite blockers, including the hard GPMP-before-TCA and GPMP/TCA-before-allied-health constraints. The GP billing card now shows source links, source review dates, and documentation requirements from these rules.

**Implementation:**

- `src/lib/mbs/rules.ts`
- `src/lib/mbs/types.ts`
- `src/lib/mbs/evaluate.ts`

**Rule fields:**

- `itemNumber`
- `serviceName`
- `plainEnglishDescription`
- `eligibilityCriteria`
- `documentationRequirements`
- `cooldownOrFrequencyRules`
- `requiresHumanReview`
- `officialSourceUrl`
- `lastReviewedAt`

**Failure points:**

- Stale MBS knowledge.
- Missing item-frequency constraints.
- UI hiding uncertainty.

**Gate:** Each rule must cite an official MBS Online or Medicare source URL and carry `lastReviewedAt`.

### Phase 4 - AI conversation-history deep dive

**Week target:** W8, with GP 30-second briefing.

**What ships:** `billing-intelligence` worker scans the patient context and proposes item candidates with citations.

**Worker:** `src/inngest/workers/billing-intelligence.ts`

**Schema:**

```ts
BillingSuggestionSchema = z.object({
  suggestions: z
    .array(
      z.object({
        itemNumber: z.string(),
        serviceName: z.string(),
        rationale: z.string().max(260),
        evidence: z
          .array(
            z.object({
              kind: z.enum([
                "message",
                "symptom",
                "meal",
                "referral",
                "care_plan",
                "report",
              ]),
              id: z.string(),
              quote: z.string().max(140),
            }),
          )
          .min(1)
          .max(5),
        missingPrerequisites: z.array(z.string()).max(6),
        documentationDraft: z.string().max(500),
        confidence_score: z.number().min(0).max(1),
        requires_human_review: z.boolean(),
        safety_flags: z.array(z.string()),
      }),
    )
    .max(5),
});
```

**Prompt rules:**

- Never say the item is claimable.
- Say "candidate", "may support", "needs GP verification."
- Every suggestion needs evidence.
- If a frequency/cooldown rule is unknown, mark `requires_human_review = true`.
- Never optimize for revenue; optimize for care need and documentation completeness.

**Failure points:**

- Model hallucinates item numbers.
- Evidence quote does not support the claim.
- Patient conversation contains sensitive information not needed for billing.

**Gate:** 30 patient-week evals reviewed by a GP advisor; 0 hallucinated item numbers; 0 unsupported evidence chains.

### Phase 5 - Live MBS guideline retrieval and audit-safe billing copilot

**Week target:** W9-W10.

**What ships:** Retrieval-augmented billing intelligence over Australian Medicare guidance, with audit trail and clinic note export.

**Implementation:**

- `src/lib/mbs/retriever.ts` indexes official MBS Online pages or curated snapshots.
- `src/server/services/billing-intelligence.ts` wraps retrieval + worker + audit.
- `/gp/[patientId]/billing` shows "source checked" timestamp and source links.
- Copy action generates a clinic-note snippet with item candidate, rationale, evidence, and prerequisites.

**Audit events:**

- `billing.scan.invoked`
- `billing.suggestion.generated`
- `billing.suggestion.viewed`
- `billing.justification.copied`
- `billing.task.created`
- `billing.suggestion.dismissed`

**RLS:**

- GP can only scan patients in their network.
- Dietitian cannot see billing suggestions unless explicitly shared by GP.
- Admin sees aggregate billing-feature usage, not item-level patient detail by default.

**Failure points:**

- Official guideline pages change structure.
- Clinic note export becomes too long.
- GP treats suggestion as authorization.
- PHI leaks into analytics.

**Gate:** Live retrieval must degrade to "guideline source unavailable; use static rule only" and suppress AI if official source cannot be cited.

## Final acceptance bar

- GP opens `/gp/asha/billing`.
- Within 10 seconds, sees the top 3 item candidates, why they appeared, what evidence supports them, what is still missing, and whether the item should be deferred.
- GP copies a justification snippet in one click.
- Every suggestion has an official-source link by Phase 5.
- No suggestion appears without evidence.
- No claim is auto-submitted.
