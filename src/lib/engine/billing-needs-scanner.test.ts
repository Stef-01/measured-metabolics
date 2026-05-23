import { describe, expect, it } from "vitest";
import { scanBillingNeeds } from "./billing-needs-scanner";
import {
  billingSuggestionsForPatient,
  findPatient,
  mealsForPatient,
  REFERRALS,
  symptomsForPatient,
  threadForPatient,
} from "@/lib/mock";
import type { Patient } from "@/lib/mock/types";

function contextFor(patientId: string) {
  const patient = findPatient(patientId);
  if (!patient) throw new Error(`Missing fixture patient ${patientId}`);
  return {
    patient,
    thread: threadForPatient(patientId),
    symptoms: symptomsForPatient(patientId),
    meals: mealsForPatient(patientId),
    referral: REFERRALS.find((referral) => referral.patientId === patientId),
  };
}

describe("billing needs scanner", () => {
  it("surfaces Asha's chronic-care and team-care candidates with evidence", () => {
    const needs = scanBillingNeeds(contextFor("asha"));

    expect(needs.map((need) => need.item)).toContain("MBS 721");
    expect(needs.map((need) => need.item)).toContain("MBS 723");
    expect(needs.map((need) => need.item)).toContain("MBS 10954");
    expect(needs.every((need) => need.evidence.length > 0)).toBe(true);
    expect(needs.every((need) => need.missingPrerequisites.length > 0)).toBe(
      true,
    );
  });

  it("does not invent a GPMP for stable single-condition Ken", () => {
    const needs = scanBillingNeeds(contextFor("ken"));
    const tca = needs.find((need) => need.id === "tca");

    expect(needs.map((need) => need.item)).not.toContain("MBS 721");
    expect(needs.map((need) => need.item)).toContain("MBS 723");
    expect(tca?.stance).toBe("defer");
    expect(tca?.estimatedRebateAud).toBe(0);
    expect(tca?.missingPrerequisites[0]).toContain("GPMP");
  });

  it("uses symptom triggers as follow-up tasks, not billable item claims", () => {
    const needs = scanBillingNeeds(contextFor("lina"));
    const symptomNeed = needs.find(
      (need) => need.id === "gp-medication-review",
    );

    expect(symptomNeed).toBeDefined();
    expect(symptomNeed?.stance).toBe("defer");
    expect(symptomNeed?.estimatedRebateAud).toBe(0);
    expect(symptomNeed?.item).toBe("GP follow-up");
  });

  it("returns no candidates when no chronic or active-care context exists", () => {
    const patient: Patient = {
      id: "well",
      firstName: "Will",
      lastName: "Healthy",
      age: 40,
      sex: "M",
      conditions: ["General wellness"],
      cuisine: "anglo",
      cuisineLabel: "Anglo",
      hbA1cPct: 5.2,
      weightKg: 72,
      weightDeltaKg: 0,
      bmi: 23.1,
      meds: [],
      risk: "low",
      timeInRangePct: 96,
      weekNumber: 1,
      alerts: [],
      patternSummary: [],
      assignedDietitianId: "maya",
      referringGpId: "lee",
      consentStatus: "signed",
    };

    expect(scanBillingNeeds({ patient, symptoms: [], meals: [] })).toHaveLength(
      0,
    );
    const suggestions = billingSuggestionsForPatient(patient);
    expect(suggestions).toHaveLength(1);
    expect(suggestions[0].item).toBe("No MBS candidate");
    expect(suggestions[0].stance).toBe("defer");
    expect(suggestions[0].estimatedRebateAud).toBe(0);
  });
});
