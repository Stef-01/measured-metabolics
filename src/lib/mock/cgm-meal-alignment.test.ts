import { describe, expect, it } from "vitest";
import { CGM_BY_PATIENT } from "./cgm";
import { mealsForPatient } from "./meals";
import { nearestMealForSpike } from "@/lib/engine/cgm-spike-meal";
import type { CgmReading } from "./types";

/**
 * Medical-accuracy guard.
 *
 * On a metabolic-health platform a glucose spike with no logged meal reads as
 * either patient non-compliance or an unexplained clinical event — neither is
 * appropriate for a fully-logged demo. The only legitimate non-meal rise the
 * UI accounts for is the dawn phenomenon (cortisol-driven, ~3–8 am), which the
 * chart labels explicitly rather than flagging "No meal logged".
 *
 * This test asserts the invariant for every patient that has a CGM trace:
 * each detectable spike resolves to a causal meal within the 3-hour window,
 * OR falls inside the dawn window. It fails loudly if a spike is ever added to
 * cgm.ts without a corresponding entry in meals.ts (the exact regression that
 * produced the orphan "No meal logged within 3 h" callouts).
 */

const DAWN_START_HOUR = 3;
const DAWN_END_HOUR = 8;
/** Prominence above a low-percentile baseline that counts as a real spike. */
const SPIKE_PROMINENCE_MMOL = 1.0;
/** Half-width of the local-maximum search window (±30 min at 5-min cadence). */
const PEAK_WINDOW_SAMPLES = 6;

function percentile(values: number[], p: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(
    sorted.length - 1,
    Math.max(0, Math.round(p * (sorted.length - 1))),
  );
  return sorted[idx];
}

/** Local-maximum readings whose level clears `baseline + prominence`. */
function detectSpikePeaks(readings: CgmReading[]): CgmReading[] {
  const baseline = percentile(
    readings.map((r) => r.mmolL),
    0.15,
  );
  const threshold = baseline + SPIKE_PROMINENCE_MMOL;
  const peaks: CgmReading[] = [];

  for (let i = 0; i < readings.length; i++) {
    const r = readings[i];
    if (r.mmolL < threshold) continue;
    const lo = Math.max(0, i - PEAK_WINDOW_SAMPLES);
    const hi = Math.min(readings.length - 1, i + PEAK_WINDOW_SAMPLES);
    let isLocalMax = true;
    for (let j = lo; j <= hi; j++) {
      if (readings[j].mmolL > r.mmolL) {
        isLocalMax = false;
        break;
      }
    }
    // Keep only the leading edge of a flat-topped peak to avoid double counting.
    if (
      isLocalMax &&
      (peaks.length === 0 || r.ts !== peaks[peaks.length - 1].ts)
    ) {
      const prev = peaks[peaks.length - 1];
      const farEnough =
        !prev ||
        new Date(r.ts).getTime() - new Date(prev.ts).getTime() >
          PEAK_WINDOW_SAMPLES * 5 * 60 * 1000;
      if (farEnough) peaks.push(r);
    }
  }
  return peaks;
}

describe("CGM ↔ meal alignment", () => {
  const patientIds = Object.keys(CGM_BY_PATIENT);

  it("covers every patient that has a CGM trace", () => {
    expect(patientIds.length).toBeGreaterThan(0);
  });

  for (const patientId of patientIds) {
    it(`every detectable spike for ${patientId} has a meal or is a dawn rise`, () => {
      const series = CGM_BY_PATIENT[patientId];
      const meals = mealsForPatient(patientId);
      const peaks = detectSpikePeaks(series.readings);

      // The trace must actually contain spikes, else the guard is vacuous.
      expect(peaks.length).toBeGreaterThan(0);

      const orphans = peaks.filter((peak) => {
        const ts = new Date(peak.ts).getTime();
        const hour = new Date(peak.ts).getHours();
        const isDawn = hour >= DAWN_START_HOUR && hour < DAWN_END_HOUR;
        const match = nearestMealForSpike(meals, ts);
        return match === null && !isDawn;
      });

      expect(orphans.map((o) => ({ ts: o.ts, mmolL: o.mmolL }))).toEqual([]);
    });
  }
});
