import {
  scanBillingNeeds,
  type BillingNeed,
  type BillingNeedEvidence,
  type BillingScanContext,
} from "./billing-needs-scanner";
import { evaluateMbsRules } from "@/lib/mbs/evaluate";
import { MBS_RULES, mbsRuleForItem } from "@/lib/mbs/rules";
import {
  BillingSuggestionSchema,
  type BillingSuggestion,
  type BillingSuggestionItem,
} from "@/ai/schemas";

/**
 * Phase 4 (Feature #11) — deterministic billing-intelligence simulator.
 *
 * Why a simulator and a worker:
 *   - The worker is the production path: `runStructured("billing-intelligence")`
 *     -> `applySafety` -> audit (see `src/inngest/workers/billing-intelligence.ts`).
 *   - The simulator is the demo + fallback path: when no LLM is configured the
 *     GP must still see the deep-dive panel, and when we want to eval the
 *     contract (no banned words, evidence verbatim, no hallucinated items) we
 *     don't want flaky LLM outputs in CI.
 *
 * The simulator therefore obeys the same prompt rules an LLM call must obey:
 *   - never says "claimable", "auto-claim", "billable", or "approved";
 *   - emits only MBS items present in `MBS_RULES`;
 *   - every suggestion carries at least one verbatim quote from context;
 *   - sets `requires_human_review = true` because frequency / cooldown cannot
 *     be verified without live billing history.
 */

const BANNED_WORDS = [
  "claimable",
  "auto-claim",
  "auto claim",
  "billable",
  "approved",
  "submit claim",
  "claim approved",
];

type AiEvidenceKind = BillingSuggestionItem["evidence"][number]["kind"];

function mapEvidenceKind(kind: BillingNeedEvidence["kind"]): AiEvidenceKind {
  if (kind === "condition") return "care_plan";
  return kind;
}

function evidenceId(
  kind: BillingNeedEvidence["kind"],
  context: BillingScanContext,
): string {
  switch (kind) {
    case "condition":
      return `care_plan:${context.patient.id}`;
    case "message":
      return (
        context.thread?.messages.find((m) => m.fromRole === "dietitian")?.id ??
        context.thread?.messages[0]?.id ??
        `thread:${context.thread?.id ?? context.patient.id}`
      );
    case "symptom":
      return context.symptoms[0]?.id ?? `symptom:${context.patient.id}`;
    case "referral":
      return context.referral?.id ?? `referral:${context.patient.id}`;
    case "meal":
      return (
        context.meals.find(
          (m) =>
            m.analysis.clinicalFlags.length > 0 ||
            (m.analysis.cgmPeakDeltaMmol ?? 0) >= 2,
        )?.id ?? `meal:${context.patient.id}`
      );
  }
}

function clamp(value: string, max: number): string {
  if (value.length <= max) return value;
  const trimmed = value.slice(0, max - 1).trimEnd();
  return `${trimmed}…`;
}

function dedupe(values: string[]): string[] {
  return Array.from(new Set(values));
}

function rewriteRationale(need: BillingNeed): string {
  const lead =
    need.stance === "defer"
      ? "Candidate deferred — needs GP verification before billing"
      : need.stance === "needs-review"
        ? "Candidate may support team-care documentation, needs GP verification"
        : "Candidate may support care-plan documentation, needs GP verification";
  return clamp(`${lead}. ${need.rationale}`, 260);
}

function buildEvidenceItems(
  need: BillingNeed,
  context: BillingScanContext,
): BillingSuggestionItem["evidence"] {
  const items = need.evidence.slice(0, 5).map((e) => ({
    kind: mapEvidenceKind(e.kind),
    id: evidenceId(e.kind, context),
    quote: clamp(e.quote, 140),
  }));
  if (items.length > 0) return items;
  return [
    {
      kind: "care_plan" as const,
      id: `care_plan:${context.patient.id}`,
      quote: clamp(
        `${context.patient.conditions.join(" + ")}; HbA1c ${context.patient.hbA1cPct}%.`,
        140,
      ),
    },
  ];
}

function buildPrerequisites(need: BillingNeed, blockers: string[]): string[] {
  const merged = dedupe([...blockers, ...need.missingPrerequisites]);
  return merged.slice(0, 6).map((line) => clamp(line, 160));
}

function buildDocumentationDraft(
  need: BillingNeed,
  rule: ReturnType<typeof mbsRuleForItem>,
): string {
  if (!rule) return "";
  const opener =
    need.stance === "defer"
      ? "Defer this candidate; do not bill from current evidence alone"
      : "Treat as candidate only; GP verification required before billing";
  const body = `${opener}. ${rule.itemNumber} ${rule.serviceName}: ${need.whyNow}`;
  return clamp(body, 500);
}

function pickConfidence(need: BillingNeed): number {
  if (need.stance === "defer") return Math.min(need.confidence, 0.5);
  if (need.stance === "needs-review") return Math.min(need.confidence, 0.65);
  return Math.min(Math.max(need.confidence, 0), 0.85);
}

function suggestionForNeed(
  need: BillingNeed,
  context: BillingScanContext,
  blockers: string[],
): BillingSuggestionItem | undefined {
  const rule = mbsRuleForItem(need.item);
  if (!rule) return undefined;

  const safetyFlags = ["frequency_check_required"];
  if (need.stance === "defer") safetyFlags.push("defer");
  if (need.stance === "needs-review") safetyFlags.push("needs_review");

  const item: BillingSuggestionItem = {
    itemNumber: rule.itemNumber,
    serviceName: rule.serviceName,
    rationale: rewriteRationale(need),
    evidence: buildEvidenceItems(need, context),
    missingPrerequisites: buildPrerequisites(need, blockers),
    documentationDraft: buildDocumentationDraft(need, rule),
    confidence_score: pickConfidence(need),
    requires_human_review: true,
    safety_flags: safetyFlags,
  };

  for (const banned of BANNED_WORDS) {
    if (item.rationale.toLowerCase().includes(banned)) return undefined;
    if (item.documentationDraft.toLowerCase().includes(banned))
      return undefined;
  }

  return item;
}

function summariseConfidence(items: BillingSuggestionItem[]): number {
  if (items.length === 0) return 1;
  return (
    items.reduce((sum, item) => sum + item.confidence_score, 0) / items.length
  );
}

function summariseFlags(items: BillingSuggestionItem[]): string[] {
  const flags = new Set<string>();
  for (const item of items) {
    for (const flag of item.safety_flags) flags.add(flag);
  }
  if (flags.size === 0) flags.add("simulator_only");
  return Array.from(flags);
}

/**
 * Build a schema-valid `BillingSuggestion` from local patient context using
 * the deterministic Phase 2 scanner + Phase 3 rule evaluator. Also used by
 * the Inngest worker as the LLM-unconfigured fallback.
 */
export function runBillingDeepDive(
  context: BillingScanContext,
): BillingSuggestion {
  const needs = scanBillingNeeds(context);
  const evaluations = evaluateMbsRules(needs);

  const suggestions = needs
    .map((need) => {
      const evaluation = evaluations.get(need.item);
      const blockers = evaluation?.blockers ?? [];
      return suggestionForNeed(need, context, blockers);
    })
    .filter((s): s is BillingSuggestionItem => Boolean(s))
    .slice(0, 5);

  const draft: BillingSuggestion = {
    suggestions,
    confidence_score: summariseConfidence(suggestions),
    requires_human_review: true,
    safety_flags: summariseFlags(suggestions),
  };

  return BillingSuggestionSchema.parse(draft);
}

/**
 * Render the patient context as the string variables the
 * `billing-intelligence` prompt expects.
 *
 * Kept side-effect free so it can be unit tested and re-used by both the
 * worker (LLM call) and the simulator-driven demo path.
 */
export function formatBillingPromptVariables(
  context: BillingScanContext,
): Record<string, string> {
  const { patient, thread, symptoms, meals, referral } = context;

  const rules = Object.values(MBS_RULES)
    .map(
      (rule) =>
        `${rule.itemNumber} — ${rule.serviceName}: ${rule.plainEnglishDescription}`,
    )
    .join("\n");

  const conditions = patient.conditions.join(", ");
  const carePlan = referral
    ? `${referral.referringGpName}: ${referral.reason}`
    : "No active referral on record.";

  const threadText = thread
    ? thread.messages
        .map((m) => `[${m.fromRole}] ${m.fromName}: ${m.body}`)
        .join("\n")
    : "No dietitian thread.";

  const symptomsText = symptoms.length
    ? symptoms
        .map(
          (s) =>
            `${s.loggedAt}: nausea ${s.nausea}, constipation ${s.constipation}, hypo ${s.hypoSymptoms}, meds-as-planned ${s.medsAsPlanned}`,
        )
        .join("\n")
    : "No symptom logs.";

  const mealsText = meals.length
    ? meals
        .filter(
          (m) =>
            m.analysis.clinicalFlags.length > 0 ||
            (m.analysis.cgmPeakDeltaMmol ?? 0) >= 2,
        )
        .slice(0, 5)
        .map(
          (m) =>
            `${m.eatenAt} ${m.mealType}: peak Δ ${m.analysis.cgmPeakDeltaMmol ?? "n/a"} mmol/L; flags ${m.analysis.clinicalFlags.join(", ") || "none"}; ${m.analysis.dietitianSummary}`,
        )
        .join("\n") || "No risky meal patterns."
    : "No meal logs.";

  const needs = scanBillingNeeds(context)
    .map(
      (need) =>
        `${need.item} (${need.stance}, conf ${need.confidence}) — ${need.whyNow}`,
    )
    .join("\n");

  return {
    rules,
    patient_summary: `${patient.firstName} ${patient.lastName}, ${patient.age}y, BMI ${patient.bmi.toFixed(1)}, HbA1c ${patient.hbA1cPct}%, TIR ${patient.timeInRangePct}%`,
    conditions,
    care_plan: carePlan,
    thread: threadText,
    symptoms: symptomsText,
    meals: mealsText,
    needs: needs || "Scanner found no candidates.",
  };
}

export const BANNED_BILLING_WORDS = BANNED_WORDS;
