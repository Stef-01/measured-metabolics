import type {
  MealLog,
  MessageThread,
  Patient,
  Referral,
  SymptomLog,
} from "@/lib/mock/types";

export type BillingNeedId =
  | "gpmp"
  | "tca"
  | "dietitian-allied-health"
  | "gp-medication-review";

export type BillingNeedEvidenceKind =
  | "condition"
  | "message"
  | "symptom"
  | "referral"
  | "meal";

export interface BillingNeedEvidence {
  kind: BillingNeedEvidenceKind;
  label: string;
  quote: string;
}

export interface BillingNeed {
  id: BillingNeedId;
  item: string;
  service: string;
  confidence: number;
  estimatedRebateAud: number;
  stance: "candidate" | "defer" | "needs-review";
  rationale: string;
  whyNow: string;
  evidence: BillingNeedEvidence[];
  missingPrerequisites: string[];
}

export interface BillingScanContext {
  patient: Patient;
  thread?: MessageThread;
  symptoms: SymptomLog[];
  meals: MealLog[];
  referral?: Referral;
}

const CHRONIC_CONDITION_TERMS = [
  "diabetes",
  "prediabetes",
  "obesity",
  "hypertension",
  "pcos",
  "insulin resistance",
];

function hasChronicMetabolicNeed(patient: Patient): boolean {
  return patient.conditions.some((condition) => {
    const normalized = condition.toLowerCase();
    return CHRONIC_CONDITION_TERMS.some((term) => normalized.includes(term));
  });
}

function conditionEvidence(patient: Patient): BillingNeedEvidence {
  const metrics = [
    `HbA1c ${patient.hbA1cPct}%`,
    `BMI ${patient.bmi.toFixed(1)}`,
    `TIR ${patient.timeInRangePct}%`,
  ];
  return {
    kind: "condition",
    label: "Patient record",
    quote: `${patient.conditions.join(" + ")}; ${metrics.join(", ")}.`,
  };
}

function firstDietitianMessage(
  thread: MessageThread | undefined,
): BillingNeedEvidence | undefined {
  const message = thread?.messages.find((m) => m.fromRole === "dietitian");
  if (!message) return undefined;
  return {
    kind: "message",
    label: "Dietitian thread",
    quote: `${message.fromName}: ${message.body}`,
  };
}

function firstPatientQuestion(
  thread: MessageThread | undefined,
): BillingNeedEvidence | undefined {
  const message = thread?.messages.find((m) => m.fromRole === "patient");
  if (!message) return undefined;
  return {
    kind: "message",
    label: "Patient question",
    quote: `${message.fromName}: ${message.body}`,
  };
}

function symptomEvidence(
  symptoms: SymptomLog[],
): BillingNeedEvidence | undefined {
  const symptom = symptoms.find(
    (s) => s.nausea !== "none" || s.constipation !== "none" || s.hypoSymptoms,
  );
  if (!symptom) return undefined;
  return {
    kind: "symptom",
    label: "Symptom log",
    quote: `Nausea ${symptom.nausea}; constipation ${symptom.constipation}; meds as planned: ${symptom.medsAsPlanned ? "yes" : "no"}.`,
  };
}

function mealRiskEvidence(meals: MealLog[]): BillingNeedEvidence | undefined {
  const riskyMeal = meals.find(
    (meal) =>
      meal.analysis.cgmPeakDeltaMmol !== undefined &&
      meal.analysis.cgmPeakDeltaMmol >= 2,
  );
  if (!riskyMeal) return undefined;
  const peakDelta = riskyMeal.analysis.cgmPeakDeltaMmol;
  if (peakDelta === undefined) return undefined;
  return {
    kind: "meal",
    label: "Meal pattern",
    quote: `${riskyMeal.mealType} logged as "${riskyMeal.analysis.dietitianSummary}" with peak delta ${peakDelta.toFixed(1)} mmol/L.`,
  };
}

function referralEvidence(
  referral?: Referral,
): BillingNeedEvidence | undefined {
  if (!referral) return undefined;
  return {
    kind: "referral",
    label: "Referral",
    quote: `${referral.referringGpName}: ${referral.reason}`,
  };
}

function compactEvidence(
  evidence: Array<BillingNeedEvidence | undefined>,
): BillingNeedEvidence[] {
  return evidence.filter((item): item is BillingNeedEvidence => Boolean(item));
}

/**
 * Deterministic Phase 2 scanner.
 *
 * It does not decide Medicare eligibility. It converts local patient context
 * into evidence-backed candidates that the GP must verify against MBS rules.
 */
export function scanBillingNeeds(context: BillingScanContext): BillingNeed[] {
  const { patient, thread, symptoms, meals, referral } = context;
  const chronic = hasChronicMetabolicNeed(patient);
  const hasDietitianCare =
    Boolean(thread) || Boolean(referral?.assignedDietitianId);
  const hasActiveMealPattern = meals.some(
    (meal) =>
      meal.analysis.clinicalFlags.length > 0 ||
      (meal.analysis.cgmPeakDeltaMmol ?? 0) >= 2,
  );
  const hasSymptomFollowUp = symptoms.some(
    (s) => s.nausea !== "none" || s.constipation !== "none" || s.hypoSymptoms,
  );

  const needs: BillingNeed[] = [];
  let gpmpFired = false;

  if (chronic && (patient.conditions.length >= 2 || hasActiveMealPattern)) {
    needs.push({
      id: "gpmp",
      item: "MBS 721",
      service: "GP Management Plan (GPMP)",
      confidence: patient.conditions.length >= 2 ? 0.86 : 0.7,
      estimatedRebateAud: 164.35,
      stance: "candidate",
      rationale:
        "Chronic metabolic care needs are present and active enough to warrant GP review of a care-plan pathway.",
      whyNow:
        hasActiveMealPattern || hasSymptomFollowUp
          ? "Recent meals or symptoms show active management needs, not just a historical diagnosis."
          : "The condition profile suggests a chronic-care planning review may be useful.",
      evidence: compactEvidence([
        conditionEvidence(patient),
        mealRiskEvidence(meals),
        symptomEvidence(symptoms),
        referralEvidence(referral),
      ]),
      missingPrerequisites: [
        "GP confirms chronic condition is expected to last at least 6 months.",
        "Document patient-agreed goals, actions, and review date.",
        "Confirm no recent GPMP has already been claimed inside frequency limits.",
      ],
    });
    gpmpFired = true;
  }

  if (chronic && hasDietitianCare) {
    const tcaDeferred = !gpmpFired;
    needs.push({
      id: "tca",
      item: "MBS 723",
      service: "Team Care Arrangement (TCA)",
      confidence: tcaDeferred ? 0.58 : thread ? 0.8 : 0.68,
      estimatedRebateAud: tcaDeferred ? 0 : 130.85,
      stance: tcaDeferred ? "defer" : "candidate",
      rationale: tcaDeferred
        ? "Dietitian involvement is visible, but a Team Care Arrangement should not be treated as a billing candidate unless a valid GP Management Plan exists or is created."
        : "Dietitian involvement plus chronic metabolic need may support team-care coordination if the GP verifies provider count and consent.",
      whyNow: tcaDeferred
        ? "Surface this as a blocker-aware task, not a claim candidate: verify GPMP before considering TCA."
        : "Dietitian activity is visible in the record, so coordination requirements can be made explicit.",
      evidence: compactEvidence([
        firstDietitianMessage(thread),
        referralEvidence(referral),
        mealRiskEvidence(meals),
      ]),
      missingPrerequisites: [
        "GPMP (MBS 721) must exist or be created before a TCA can be billed.",
        "Confirm at least two collaborating providers will contribute.",
        "Record patient consent and inter-provider communication plan.",
      ],
    });
  }

  if (chronic && hasDietitianCare) {
    needs.push({
      id: "dietitian-allied-health",
      item: "MBS 10954",
      service: "Allied health - dietitian service",
      confidence: 0.72,
      estimatedRebateAud: 60.35,
      stance: "needs-review",
      rationale:
        "Dietitian care is clinically relevant, but the item depends on a valid GPMP/TCA pathway and available visit allocation.",
      whyNow:
        "The record shows dietitian engagement and current nutrition intervention.",
      evidence: compactEvidence([
        firstPatientQuestion(thread),
        firstDietitianMessage(thread),
        referralEvidence(referral),
      ]),
      missingPrerequisites: [
        "Confirm current GPMP/TCA eligibility.",
        "Confirm referral allocation and remaining allied-health sessions.",
        "Dietitian service must be delivered by an eligible provider.",
      ],
    });
  }

  if (hasSymptomFollowUp) {
    needs.push({
      id: "gp-medication-review",
      item: "GP follow-up",
      service: "Medication/symptom review task",
      confidence: 0.64,
      estimatedRebateAud: 0,
      stance: "defer",
      rationale:
        "Symptoms or medication questions are present, but this scanner cannot infer a billable mental-health or medication-management item from the current evidence alone.",
      whyNow:
        "Create a clinical follow-up task rather than a billing suggestion until the GP assesses the issue.",
      evidence: compactEvidence([
        symptomEvidence(symptoms),
        firstPatientQuestion(thread),
      ]),
      missingPrerequisites: [
        "GP assesses symptom severity and medication safety.",
        "Document clinical decision before considering any billable item.",
        "Do not bill from this trigger alone.",
      ],
    });
  }

  return needs;
}
