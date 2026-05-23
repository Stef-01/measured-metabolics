import type { Patient } from "./types";

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
}

export interface BillingPhase {
  phase: string;
  label: string;
  status: "live" | "planned";
  week: string;
}

const ASHA_BILLING_SUGGESTIONS: BillingIntelligenceSuggestion[] = [
  {
    item: "MBS 721",
    service: "GP Management Plan (GPMP)",
    confidence: 0.88,
    estimatedRebateAud: 164.35,
    stance: "candidate",
    rationale:
      "Asha has Type 2 diabetes and obesity with active dietary, medication, and CGM-related management needs. A GPMP may be appropriate if the GP verifies chronicity and documents goals, actions, and review date.",
    whyNow:
      "The record shows ongoing care needs across glucose spikes, semaglutide-related nausea, and dietitian coordination.",
    evidence: [
      {
        kind: "condition",
        label: "Problem list",
        quote: "Type 2 diabetes + obesity; HbA1c 8.2%, BMI 32.1.",
      },
      {
        kind: "symptom",
        label: "Symptom log",
        quote: "Mild nausea logged 18 hours ago; meds taken as planned.",
      },
      {
        kind: "message",
        label: "Dietitian thread",
        quote:
          "Maya: dinners are spiking glucose; try smaller rice portion with extra dhal.",
      },
    ],
    missingPrerequisites: [
      "GP confirms chronic condition is expected to last at least 6 months.",
      "Document patient-agreed goals and planned reviews.",
      "Confirm no recent GPMP has already been claimed inside frequency limits.",
    ],
    documentationDraft:
      "Candidate GPMP: patient has Type 2 diabetes and obesity with active diet, CGM, medication-tolerance, and weight-management goals. Evidence includes dinner glucose spikes, medication-related nausea, and dietitian-led meal changes. GP to verify eligibility and item-frequency rules before billing.",
  },
  {
    item: "MBS 723",
    service: "Team Care Arrangement (TCA)",
    confidence: 0.8,
    estimatedRebateAud: 130.85,
    stance: "candidate",
    rationale:
      "Asha is already receiving dietitian support and may need coordinated allied-health input. A TCA may be appropriate if at least two collaborating providers are involved and the GP documents communication responsibilities.",
    whyNow:
      "Dietitian messages show active intervention; GP coordination would make the care pathway explicit.",
    evidence: [
      {
        kind: "message",
        label: "Dietitian thread",
        quote:
          "Maya: one wholewheat roti instead of half the rice would be great.",
      },
      {
        kind: "meal",
        label: "CGM pattern",
        quote: "Dinner rice portions linked to largest glucose spikes.",
      },
      {
        kind: "referral",
        label: "Care context",
        quote: "Patient referred to dietitian under chronic metabolic care.",
      },
    ],
    missingPrerequisites: [
      "Confirm GPMP exists or is created.",
      "Confirm at least two other care providers will contribute.",
      "Record collaboration method and patient consent.",
    ],
    documentationDraft:
      "Candidate TCA: patient is receiving dietitian support for Type 2 diabetes nutrition changes and may require coordinated chronic-disease care. GP to verify provider count, communication, consent, and item-frequency rules before billing.",
  },
  {
    item: "MBS 10954",
    service: "Allied health - dietitian service",
    confidence: 0.74,
    estimatedRebateAud: 60.35,
    stance: "needs-review",
    rationale:
      "Dietitian care is clinically relevant, but the allied-health service depends on a valid GPMP/TCA referral pathway and available visit allocation.",
    whyNow:
      "Asha is actively engaging with dietitian advice and meal-plan changes.",
    evidence: [
      {
        kind: "message",
        label: "Patient response",
        quote: "Asha: Yes I'll try it tomorrow. Could I add a roti instead?",
      },
      {
        kind: "care_plan",
        label: "Nutrition plan",
        quote:
          "Dinner plan swaps rice-heavy meal toward roti, fish, and greens.",
      },
    ],
    missingPrerequisites: [
      "Confirm current GPMP/TCA eligibility.",
      "Confirm referral allocation and remaining allied-health sessions.",
      "Dietitian service must be delivered by an eligible provider.",
    ],
    documentationDraft:
      "Candidate dietitian allied-health pathway: patient is actively receiving dietitian input for diabetes-related meal changes. Verify current care-plan eligibility, referral allocation, and remaining visits before billing any allied-health item.",
  },
  {
    item: "MBS 2700/2715",
    service: "Mental health plan or review",
    confidence: 0.42,
    estimatedRebateAud: 103.7,
    stance: "defer",
    rationale:
      "The record contains medication worry and behaviour-change load, but there is not enough evidence of a mental-health assessment need. Do not suggest billing unless GP assessment supports it.",
    whyNow:
      "Flagged only as a watch item because new diabetes management can create distress; the evidence is insufficient.",
    evidence: [
      {
        kind: "message",
        label: "Clinical uncertainty",
        quote:
          "Patient asked whether a medication-related symptom should change dosing.",
      },
    ],
    missingPrerequisites: [
      "GP completes mental-health assessment.",
      "K10 or equivalent assessment if clinically indicated.",
      "Patient agreement and documented treatment plan.",
    ],
    documentationDraft:
      "Do not bill from current evidence alone. If GP assessment identifies anxiety, depression, or adjustment concerns, consider the appropriate mental-health pathway and document the assessment basis.",
  },
];

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
    status: "planned",
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
    status: "planned",
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
  if (patient.id === "asha") return ASHA_BILLING_SUGGESTIONS;

  return [
    {
      item: "MBS TBD",
      service: "Billing pathway scan pending",
      confidence: 0.52,
      estimatedRebateAud: 0,
      stance: "needs-review",
      rationale:
        "Phase 1 has a complete hand-authored example for Asha. This patient needs the Phase 2 dynamic scanner before item-specific candidates should be shown.",
      whyNow:
        "Patient context exists, but no patient-specific billing intelligence scan has run yet.",
      evidence: [
        {
          kind: "condition",
          label: "Patient record",
          quote: `${patient.firstName} has ${patient.conditions.join(", ")} and requires GP verification before any billing pathway is suggested.`,
        },
      ],
      missingPrerequisites: [
        "Run Phase 2 dynamic scan for this patient.",
        "Verify current care-plan status and item-frequency limits.",
        "Do not show item numbers or rebates until patient-specific rules fire.",
      ],
      documentationDraft:
        "Indicative only. Phase 2 will scan this patient's record directly before suggesting a billing pathway.",
    },
  ];
}

export function billingFeaturePhases(): BillingPhase[] {
  return DEFAULT_PHASES;
}
