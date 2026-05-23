import { describe, expect, it } from "vitest";
import { nearestMealForSpike } from "./cgm-spike-meal";
import type { MealLog } from "@/lib/mock/types";

function makeMeal(id: string, eatenAt: string, peak = 2.5): MealLog {
  return {
    id,
    patientId: "asha",
    mealType: "lunch",
    cuisine: "south_asian",
    photoEmoji: "🍛",
    eatenAt,
    reviewStatus: "approved",
    analysis: {
      foods: [{ name: "rice", quantity: "cup", confidence: 0.9 }],
      carbLoad: "high",
      proteinLoad: "moderate",
      fibreLoad: "low",
      fatLoad: "low",
      cuisineTags: ["South Asian"],
      cgmPeakDeltaMmol: peak,
      cgmPeakAtMin: 60,
      confidence: 0.85,
      dietitianSummary: "Test meal",
      clinicalFlags: [],
    },
  };
}

describe("nearestMealForSpike", () => {
  it("matches a hover one hour after the meal was eaten", () => {
    const meals = [makeMeal("m1", "2026-05-23T08:00:00.000Z")];
    const match = nearestMealForSpike(
      meals,
      Date.parse("2026-05-23T09:00:00.000Z"),
    );
    expect(match?.meal.id).toBe("m1");
    expect(match?.minutesAfter).toBe(60);
  });

  it("returns null when the cursor is before any meal", () => {
    const meals = [makeMeal("m1", "2026-05-23T08:00:00.000Z")];
    const match = nearestMealForSpike(
      meals,
      Date.parse("2026-05-23T07:30:00.000Z"),
    );
    expect(match).toBeNull();
  });

  it("returns null when the cursor is more than 3h after the most recent meal", () => {
    const meals = [makeMeal("m1", "2026-05-23T08:00:00.000Z")];
    const match = nearestMealForSpike(
      meals,
      Date.parse("2026-05-23T12:01:00.000Z"),
    );
    expect(match).toBeNull();
  });

  it("picks the most recent meal when multiple meals overlap the window", () => {
    const meals = [
      makeMeal("m-breakfast", "2026-05-23T08:00:00.000Z"),
      makeMeal("m-lunch", "2026-05-23T13:00:00.000Z"),
    ];
    const match = nearestMealForSpike(
      meals,
      Date.parse("2026-05-23T13:45:00.000Z"),
    );
    expect(match?.meal.id).toBe("m-lunch");
    expect(match?.minutesAfter).toBe(45);
  });

  it("respects a custom window", () => {
    const meals = [makeMeal("m1", "2026-05-23T08:00:00.000Z")];
    const noMatch = nearestMealForSpike(
      meals,
      Date.parse("2026-05-23T09:30:00.000Z"),
      60,
    );
    expect(noMatch).toBeNull();
    const match = nearestMealForSpike(
      meals,
      Date.parse("2026-05-23T08:30:00.000Z"),
      60,
    );
    expect(match?.minutesAfter).toBe(30);
  });
});
