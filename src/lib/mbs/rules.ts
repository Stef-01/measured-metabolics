import type { MbsRule, MbsRuleId } from "./types";

export const MBS_RULES: Record<MbsRuleId, MbsRule> = {
  "721": {
    id: "721",
    itemNumber: "MBS 721",
    serviceName: "GP Management Plan (GPMP)",
    plainEnglishDescription:
      "A GP-prepared plan for patients with chronic medical conditions requiring structured goals, treatments, and review.",
    estimatedRebateAud: 164.35,
    eligibilityCriteria: [
      "Patient has at least one chronic medical condition expected to last at least 6 months.",
      "GP documents problems, goals, required treatment, services, and review arrangements.",
      "Patient agreement is recorded.",
    ],
    documentationRequirements: [
      "Problem list and current treatments",
      "Agreed management goals",
      "Actions for the patient and GP",
      "Review date or review interval",
    ],
    cooldownOrFrequencyRules: [
      "Check MBS Online and patient billing history before claiming; frequency restrictions apply.",
      "Do not duplicate an active GPMP inside restricted intervals.",
    ],
    requiresHumanReview: true,
    officialSourceUrl:
      "https://www9.health.gov.au/mbs/fullDisplay.cfm?type=item&q=721",
    lastReviewedAt: "2026-05-23",
  },
  "723": {
    id: "723",
    itemNumber: "MBS 723",
    serviceName: "Team Care Arrangement (TCA)",
    plainEnglishDescription:
      "A GP coordination arrangement for a patient who needs ongoing care from a multidisciplinary team.",
    estimatedRebateAud: 130.85,
    eligibilityCriteria: [
      "A current GP Management Plan exists or is prepared.",
      "At least two other collaborating providers contribute to the patient's care.",
      "Patient consent and provider communication are documented.",
    ],
    documentationRequirements: [
      "Current GPMP reference",
      "Names or roles of collaborating providers",
      "Communication responsibilities",
      "Patient consent",
    ],
    cooldownOrFrequencyRules: [
      "Check MBS Online and patient billing history before claiming; frequency restrictions apply.",
      "Do not claim without a current GPMP.",
    ],
    requiresHumanReview: true,
    officialSourceUrl:
      "https://www9.health.gov.au/mbs/fullDisplay.cfm?type=item&q=723",
    lastReviewedAt: "2026-05-23",
  },
  "10954": {
    id: "10954",
    itemNumber: "MBS 10954",
    serviceName: "Allied health - dietitian service",
    plainEnglishDescription:
      "A dietitian service provided under an eligible chronic disease management referral pathway.",
    estimatedRebateAud: 60.35,
    eligibilityCriteria: [
      "A valid GPMP/TCA referral pathway is in place.",
      "The dietitian is an eligible allied health provider.",
      "Allocated allied-health sessions remain available.",
    ],
    documentationRequirements: [
      "Referral pathway and visit allocation",
      "Dietitian provider eligibility",
      "Service date and patient attendance",
    ],
    cooldownOrFrequencyRules: [
      "Check remaining allied-health services for the calendar year before claiming.",
      "Do not claim without a valid care-plan referral pathway.",
    ],
    requiresHumanReview: true,
    officialSourceUrl:
      "https://www9.health.gov.au/mbs/fullDisplay.cfm?type=item&q=10954",
    lastReviewedAt: "2026-05-23",
  },
};

function isMbsRuleId(value: string): value is MbsRuleId {
  return value === "721" || value === "723" || value === "10954";
}

export function mbsRuleForItem(item: string): MbsRule | undefined {
  const match = item.match(/^MBS\s+(\d+)/);
  if (!match) return undefined;
  const id = match[1];
  return isMbsRuleId(id) ? MBS_RULES[id] : undefined;
}
