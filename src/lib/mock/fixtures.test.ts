import { describe, expect, it } from "vitest";
import {
  PATIENTS,
  findPatient,
  mealsForPatient,
  pendingMeals,
  REFERRALS,
  newReferrals,
  symptomsForPatient,
  threadForPatient,
  ASHA_PLAN,
  cgmForPatient,
} from "./index";

describe("mock fixtures", () => {
  it("seed cohort contains the expected patients", () => {
    const ids = PATIENTS.map((p) => p.id).sort();
    expect(ids).toEqual([
      "asha",
      "grace",
      "james",
      "ken",
      "lina",
      "omar",
      "priya",
      "ravi",
      "sofia",
    ]);
  });

  it("findPatient returns undefined for unknowns and never throws", () => {
    expect(findPatient("zzz")).toBeUndefined();
    expect(findPatient("asha")?.firstName).toBe("Asha");
  });

  it("Asha has at least one pending meal — seeds the dietitian queue demo", () => {
    expect(mealsForPatient("asha").length).toBeGreaterThan(0);
    expect(pendingMeals().length).toBeGreaterThan(0);
  });

  it("referrals expose at least one 'new' row for the inbox demo", () => {
    expect(newReferrals().length).toBeGreaterThan(0);
    expect(
      REFERRALS.every((r) => ["low", "medium", "high"].includes(r.priority)),
    ).toBe(true);
  });

  it("Lina has a severe symptom log — drives the escalation demo", () => {
    const linaSymptoms = symptomsForPatient("lina");
    expect(linaSymptoms.some((s) => s.nausea === "severe")).toBe(true);
  });

  it("Asha has an active dietitian thread", () => {
    const thread = threadForPatient("asha");
    expect(thread).toBeDefined();
    expect(thread?.messages.length).toBeGreaterThan(0);
  });

  it("Asha plan has all 4 meal types", () => {
    const types = ASHA_PLAN.items.map((i) => i.mealType);
    expect(new Set(types)).toEqual(
      new Set(["breakfast", "lunch", "dinner", "snack"]),
    );
  });

  it("CGM series spans roughly 48 hours of 5-minute samples", () => {
    const cgm = cgmForPatient("asha");
    expect(cgm).toBeDefined();
    // 2 days * 24h * 12 samples/h = 576
    expect(cgm!.readings.length).toBeGreaterThanOrEqual(576);
  });
});
