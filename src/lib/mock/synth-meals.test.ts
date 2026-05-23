import { describe, expect, it } from "vitest";
import { synthesizeMeals } from "./synth-meals";
import { PATIENTS } from "./patients";

describe("synthesizeMeals", () => {
  it("can produce 100 meals (Loop 2 perf budget)", () => {
    const start = performance.now();
    const meals = synthesizeMeals(100);
    const elapsed = performance.now() - start;
    expect(meals.length).toBe(100);
    // Must be cheap to build — render budget for the queue is < 60ms.
    expect(elapsed).toBeLessThan(60);
  });

  it("rotates through every patient in the cohort", () => {
    const meals = synthesizeMeals(20);
    const patientIds = new Set(meals.map((m) => m.patientId));
    expect(patientIds.size).toBe(PATIENTS.length);
  });

  it("every meal has a non-empty review status and analysis", () => {
    const meals = synthesizeMeals(20);
    for (const m of meals) {
      expect(m.reviewStatus).toBe("pending_review");
      expect(m.analysis.foods.length).toBeGreaterThan(0);
      expect(m.analysis.confidence).toBeGreaterThan(0);
    }
  });
});
