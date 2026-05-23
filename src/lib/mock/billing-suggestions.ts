import type { Patient } from "./types";
import {
  scanBillingNeeds,
  type BillingScanContext,
} from "../engine/billing-needs-scanner";
import { runBillingDeepDive } from "../engine/billing-deep-dive";
import { evaluateMbsRules } from "../mbs/evaluate";
import type { BillingSuggestion } from "@/ai/schemas";
import { mealsForPatient } from "./meals";
import { threadForPatient } from "./messages";
import { REFERRALS } from "./referrals";
import { symptomsForPatient } from "./symptoms";

export type BillingEvidenceKind =
  | "condition"
  | "message"
  | "symptom"
  | "referral"
  | "meal"
  | "care_plan";

export interface BillingEvidence {
  kind: BillingEvidenceKind;
  label: string;
  quote: string;
}

export interface BillingIntelligenceSuggestion {
  item: string;
  service: string;
  confidence: number;
  estimatedRebateAud: number;
  stance: "candidate" | "defer" | "needs-review";
  rationale: string;
  whyNow: string;
  evidence: BillingEvidence[];
  missingPrerequisites: string[];
  documentationDraft: string;
  officialSourceUrl?: string;
  sourceLastReviewedAt?: string;
  documentationRequirements?: string[];
}

export interface BillingPhase {
  phase: string;
  label: string;
  status: "live" | "planned";
  week: string;
}

const DEFAULT_PHASES: BillingPhase[] = [
  {
    phase: "P1",
    label: "Static evidence-backed demo",
    status: "live",
    week: "Now/W2",
  },
  {
    phase: "P2",
    label: "Dynamic local needs scanner",
    status: "live",
    week: "W3",
  },
  {
    phase: "P3",
    label: "Structured Australian MBS rule engine",
    status: "planned",
    week: "W5",
  },
  {
    phase: "P4",
    label: "AI conversation-history deep dive",
    status: "live",
    week: "W8",
  },
  {
    phase: "P5",
    label: "Live MBS retrieval + audit-safe clinic note export",
    status: "planned",
    week: "W9-W10",
  },
];

export function billingSuggestionsForPatient(
  patient: Patient,
): BillingIntelligenceSuggestion[] {
  const needs = scanBillingNeeds({
    patient,
    thread: threadForPatient(patient.id),
    symptoms: symptomsForPatient(patient.id),
    meals: mealsForPatient(patient.id),
    referral: REFERRALS.find((referral) => referral.patientId === patient.id),
  });

  if (needs.length > 0) {
    const evaluations = evaluateMbsRules(needs);
    return needs.map((need) => {
      const evaluation = evaluations.get(need.item);
      const effectiveStance =
        evaluation?.canSurfaceAsCandidate === false ? "defer" : need.stance;
      const opening =
        effectiveStance === "defer"
          ? "Do not bill from current evidence alone."
          : "Candidate only; GP verification required.";

      return {
        item: need.item,
        service: need.service,
        confidence: need.confidence,
        estimatedRebateAud:
          evaluation?.canSurfaceAsCandidate === false
            ? 0
            : need.estimatedRebateAud,
        stance: effectiveStance,
        rationale: need.rationale,
        whyNow: need.whyNow,
        evidence: need.evidence,
        missingPrerequisites: [
          ...need.missingPrerequisites,
          ...(evaluation?.blockers ?? []),
        ],
        documentationDraft: `${opening} ${need.rationale} Evidence reviewed: ${need.evidence.map((item) => item.label).join(", ")}. Verify eligibility, documentation, and item-frequency rules before billing.`,
        officialSourceUrl: evaluation?.officialSourceUrl,
        sourceLastReviewedAt: evaluation?.lastReviewedAt,
        documentationRequirements: evaluation?.documentationRequirements,
      };
    });
  }

  return [
    {
      item: "No MBS candidate",
      service: "No billing candidates identified",
      confidence: 1,
      estimatedRebateAud: 0,
      stance: "defer",
      rationale:
        "The Phase 2 local scanner found no chronic-care, team-care, symptom-follow-up, or active dietitian-care trigger that meets the threshold for an item-specific candidate.",
      whyNow:
        "Nothing in the current record should be turned into a billing suggestion yet.",
      evidence: [
        {
          kind: "condition",
          label: "Patient record",
          quote: `${patient.firstName} has ${patient.conditions.join(", ")} and requires GP verification before any billing pathway is suggested.`,
        },
      ],
      missingPrerequisites: [
        "Continue normal care documentation.",
        "Re-run the scan when new referrals, symptoms, care-plan updates, or GP notes are added.",
        "Do not show item numbers or rebates until patient-specific rules fire.",
      ],
      documentationDraft:
        "No billing candidate identified from the current record. Continue normal care documentation and re-check if new clinical needs, referrals, or team-care context appear.",
    },
  ];
}

export function billingFeaturePhases(): BillingPhase[] {
  return DEFAULT_PHASES;
}

function billingScanContextForPatient(patient: Patient): BillingScanContext {
  return {
    patient,
    thread: threadForPatient(patient.id),
    symptoms: symptomsForPatient(patient.id),
    meals: mealsForPatient(patient.id),
    referral: REFERRALS.find((referral) => referral.patientId === patient.id),
  };
}

export function billingDeepDiveForPatient(patient: Patient): BillingSuggestion {
  return runBillingDeepDive(billingScanContextForPatient(patient));
}
