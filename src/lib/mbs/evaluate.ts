import type { BillingNeed } from "@/lib/engine/billing-needs-scanner";
import { mbsRuleForItem } from "./rules";
import type { MbsRuleEvaluation } from "./types";

export function evaluateMbsRuleForNeed(
  need: BillingNeed,
  allNeeds: BillingNeed[],
): MbsRuleEvaluation | undefined {
  const rule = mbsRuleForItem(need.item);
  if (!rule) return undefined;

  const blockers: string[] = [];
  const hasGpmpCandidate = allNeeds.some(
    (candidate) => candidate.item === "MBS 721" && candidate.stance !== "defer",
  );
  const hasTcaCandidate = allNeeds.some(
    (candidate) => candidate.item === "MBS 723" && candidate.stance !== "defer",
  );

  if (rule.id === "723" && !hasGpmpCandidate) {
    blockers.push(
      "Current GPMP candidate not present; verify or create MBS 721 first.",
    );
  }

  if (rule.id === "10954" && !(hasGpmpCandidate && hasTcaCandidate)) {
    blockers.push(
      "Valid GPMP/TCA pathway must be verified before allied-health item use.",
    );
  }

  if (need.stance === "defer") {
    blockers.push(
      "Scanner marked this need as defer; do not treat as billable.",
    );
  }

  return {
    rule,
    canSurfaceAsCandidate: blockers.length === 0,
    blockers,
    documentationRequirements: rule.documentationRequirements,
    officialSourceUrl: rule.officialSourceUrl,
    lastReviewedAt: rule.lastReviewedAt,
  };
}

export function evaluateMbsRules(
  needs: BillingNeed[],
): Map<string, MbsRuleEvaluation> {
  const evaluations = new Map<string, MbsRuleEvaluation>();
  for (const need of needs) {
    const evaluation = evaluateMbsRuleForNeed(need, needs);
    if (evaluation) evaluations.set(need.item, evaluation);
  }
  return evaluations;
}
