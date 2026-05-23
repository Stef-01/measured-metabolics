import { describe, expect, it } from "vitest";
import { EVENTS } from "./events";

describe("PostHog event registry (PRD §7.12, §8.13, §9.12)", () => {
  it("exposes 30 distinct events", () => {
    const set = new Set(EVENTS);
    expect(set.size).toBe(EVENTS.length);
    expect(EVENTS.length).toBeGreaterThanOrEqual(30);
  });

  it("uses persona-prefixed names so PostHog grouping is automatic", () => {
    const offenders = EVENTS.filter(
      (e) => !/^(patient|dietitian|gp)\./.test(e),
    );
    expect(offenders).toEqual([]);
  });

  it("includes the four critical care-loop events", () => {
    expect(EVENTS).toContain("gp.referral_created");
    expect(EVENTS).toContain("patient.meal_saved");
    expect(EVENTS).toContain("dietitian.meal_approved");
    expect(EVENTS).toContain("dietitian.report_sent");
  });
});
