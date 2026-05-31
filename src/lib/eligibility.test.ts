import { describe, expect, it } from "vitest";
import { computeBmi, isDiscoveryEligible, ELIGIBLE_BMI } from "./eligibility";

describe("discovery-call eligibility", () => {
  it("computes BMI from metric height + weight", () => {
    expect(computeBmi(170, 85)).toBeCloseTo(29.41, 1);
    expect(computeBmi(180, 81)).toBeCloseTo(25, 1);
  });

  it("admits visitors at or above the BMI threshold", () => {
    expect(isDiscoveryEligible(170, 78.1)).toBe(true); // ~27.02
    expect(isDiscoveryEligible(180, 88)).toBe(true); // ~27.16
    expect(isDiscoveryEligible(165, 95)).toBe(true); // ~34.9
  });

  it("routes visitors below the threshold to the soft-decline path", () => {
    expect(isDiscoveryEligible(170, 75)).toBe(false); // ~25.95
    expect(isDiscoveryEligible(190, 80)).toBe(false); // ~22.2
  });

  it("uses 27 as the metabolic-baseline threshold", () => {
    expect(ELIGIBLE_BMI).toBe(27);
  });

  it("guards against a zero/negative height", () => {
    expect(computeBmi(0, 80)).toBe(0);
    expect(isDiscoveryEligible(0, 80)).toBe(false);
  });
});
