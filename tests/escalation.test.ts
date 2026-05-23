import { describe, expect, it } from "vitest";
import { matchEscalation, ESCALATION_RULE_IDS } from "@/server/escalation";

describe("PRD §16.5 — Escalation rules (7 triggers)", () => {
  it("e1 severe hypo with note", () => {
    expect(
      matchEscalation({
        patientId: "asha",
        domain: "hypo",
        severity: "severe",
        note: "fainted briefly",
      }).ruleId,
    ).toBe("e1-severe-hypo");
  });

  it("e2 severe nausea 72h", () => {
    expect(
      matchEscalation({
        patientId: "asha",
        domain: "nausea",
        severity: "severe",
        note: "72h non-stop",
      }).ruleId,
    ).toBe("e2-severe-nausea-72h");
  });

  it("e3 suicidality keyword", () => {
    expect(
      matchEscalation({
        patientId: "asha",
        domain: "mental_health",
        severity: "moderate",
        note: "thoughts of self-harm",
      }).ruleId,
    ).toBe("e3-suicidality");
  });

  it("e4 medication non-adherence 7 days", () => {
    expect(
      matchEscalation({
        patientId: "asha",
        domain: "medication",
        severity: "moderate",
        note: "missed doses for 7 days",
      }).ruleId,
    ).toBe("e4-medication-non-adherence-7d");
  });

  it("e5 rapid weight loss", () => {
    expect(
      matchEscalation({
        patientId: "asha",
        domain: "weight",
        severity: "moderate",
        note: "rapid weight loss >5kg this month",
      }).ruleId,
    ).toBe("e5-rapid-weight-loss");
  });

  it("e6 severe constipation 2 weeks", () => {
    expect(
      matchEscalation({
        patientId: "asha",
        domain: "constipation",
        severity: "severe",
        note: "no bowel movement in 2 weeks",
      }).ruleId,
    ).toBe("e6-severe-constipation-2w");
  });

  it("e7 CGM extreme severity", () => {
    expect(
      matchEscalation({
        patientId: "asha",
        domain: "cgm",
        severity: "severe",
        note: ">20 mmol all morning",
      }).ruleId,
    ).toBe("e7-cgm-extreme");
  });

  it("non-trigger: mild nausea", () => {
    expect(
      matchEscalation({ patientId: "asha", domain: "nausea", severity: "mild" })
        .ruleId,
    ).toBeNull();
  });

  it("rule id surface stays exactly seven entries", () => {
    expect(ESCALATION_RULE_IDS).toHaveLength(7);
  });
});
