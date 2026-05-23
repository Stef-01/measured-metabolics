import { describe, expect, it } from "vitest";
import { evaluateMbsRuleForNeed, evaluateMbsRules } from "./evaluate";
import { MBS_RULES } from "./rules";
import { scanBillingNeeds } from "@/lib/engine/billing-needs-scanner";
import type { BillingNeed } from "@/lib/engine/billing-needs-scanner";
import {
  findPatient,
  mealsForPatient,
  REFERRALS,
  symptomsForPatient,
  threadForPatient,
} from "@/lib/mock";

function needsFor(patientId: string) {
  const patient = findPatient(patientId);
  if (!patient) throw new Error(`Missing fixture patient ${patientId}`);
  return scanBillingNeeds({
    patient,
    thread: threadForPatient(patientId),
    symptoms: symptomsForPatient(patientId),
    meals: mealsForPatient(patientId),
    referral: REFERRALS.find((referral) => referral.patientId === patientId),
  });
}

describe("MBS rule evaluation", () => {
  it("requires every structured rule to cite an official source", () => {
    for (const rule of Object.values(MBS_RULES)) {
      expect(rule.officialSourceUrl).toContain("health.gov.au");
      expect(rule.lastReviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(rule.documentationRequirements.length).toBeGreaterThan(0);
      expect(rule.cooldownOrFrequencyRules.length).toBeGreaterThan(0);
    }
  });

  it("allows Asha's TCA only when GPMP is present", () => {
    const needs = needsFor("asha");
    const tca = needs.find((need) => need.item === "MBS 723");
    expect(tca).toBeDefined();

    const evaluation = evaluateMbsRuleForNeed(tca!, needs);
    expect(evaluation?.canSurfaceAsCandidate).toBe(true);
    expect(evaluation?.blockers).toHaveLength(0);
  });

  it("blocks TCA when GPMP is absent", () => {
    const needs = needsFor("ken");
    const tca = needs.find((need) => need.item === "MBS 723");
    expect(tca).toBeDefined();

    const evaluation = evaluateMbsRuleForNeed(tca!, needs);
    expect(evaluation?.canSurfaceAsCandidate).toBe(false);
    expect(evaluation?.blockers.join(" ")).toContain("MBS 721");
    expect(evaluation?.blockers.join(" ")).toContain("Scanner marked");
  });

  it("blocks allied-health items when GPMP/TCA pathway is absent", () => {
    const orphanAlliedHealthNeed: BillingNeed = {
      id: "dietitian-allied-health",
      item: "MBS 10954",
      service: "Allied health - dietitian service",
      confidence: 0.7,
      estimatedRebateAud: 60.35,
      stance: "needs-review",
      rationale: "Synthetic need without a care-plan pathway.",
      whyNow: "Testing rule enforcement.",
      evidence: [
        {
          kind: "referral",
          label: "Referral",
          quote: "Dietitian referral exists.",
        },
      ],
      missingPrerequisites: [],
    };

    const evaluation = evaluateMbsRuleForNeed(orphanAlliedHealthNeed, [
      orphanAlliedHealthNeed,
    ]);
    expect(evaluation?.canSurfaceAsCandidate).toBe(false);
    expect(evaluation?.blockers.join(" ")).toContain("GPMP/TCA");
  });

  it("does not create evaluations for non-MBS follow-up tasks", () => {
    const needs = needsFor("lina");
    const evaluations = evaluateMbsRules(needs);
    expect(evaluations.has("GP follow-up")).toBe(false);
  });
});
