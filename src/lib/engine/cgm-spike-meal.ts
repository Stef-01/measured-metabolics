import type { MealLog } from "@/lib/mock/types";

/**
 * Match a hovered/clicked CGM timestamp back to the most plausible causal
 * meal. Used by the patient + dietitian glucose graphs so a hover over a
 * spike pops out the meal photo, AI summary, and (dietitian) annotation
 * entry point.
 *
 * A meal is considered causal when the timestamp falls inside the spike
 * window that begins at `eatenAt` and runs for `windowMinutes` (default 180).
 * Among candidates, the most recent meal eaten before the timestamp wins —
 * that's the closest cause-and-effect match.
 */
export interface SpikeMealMatch {
  meal: MealLog;
  /** Whole minutes after `eatenAt` that the cursor is at. */
  minutesAfter: number;
}

export function nearestMealForSpike(
  meals: MealLog[],
  timestampMs: number,
  windowMinutes = 180,
): SpikeMealMatch | null {
  let best: SpikeMealMatch | null = null;
  for (const meal of meals) {
    const eatenMs = new Date(meal.eatenAt).getTime();
    const diffMin = Math.round((timestampMs - eatenMs) / 60000);
    if (diffMin < 0 || diffMin > windowMinutes) continue;
    if (!best || diffMin < best.minutesAfter) {
      best = { meal, minutesAfter: diffMin };
    }
  }
  return best;
}
