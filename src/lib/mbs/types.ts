export type MbsRuleId = "721" | "723" | "10954";

export interface MbsRule {
  id: MbsRuleId;
  itemNumber: `MBS ${MbsRuleId}`;
  serviceName: string;
  plainEnglishDescription: string;
  estimatedRebateAud: number;
  eligibilityCriteria: string[];
  documentationRequirements: string[];
  cooldownOrFrequencyRules: string[];
  requiresHumanReview: boolean;
  officialSourceUrl: string;
  lastReviewedAt: string;
}

export interface MbsRuleEvaluation {
  rule: MbsRule;
  canSurfaceAsCandidate: boolean;
  blockers: string[];
  documentationRequirements: string[];
  officialSourceUrl: string;
  lastReviewedAt: string;
}
