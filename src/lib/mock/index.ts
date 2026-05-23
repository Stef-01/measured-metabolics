export * from "./types";
export * from "./patients";
export * from "./meals";
export * from "./cgm";
export * from "./referrals";
export * from "./symptoms";
export * from "./messages";
export * from "./plans";
export * from "./synth-meals";

import { synthesizeMeals } from "./synth-meals";
import { MEALS } from "./meals";

export const CURRENT_PATIENT_ID = "asha";
export const CURRENT_DIETITIAN_ID = "maya";
export const CURRENT_GP_ID = "lee";

/**
 * Default queue cohort the dietitian sees on `/d/queue`. Seeded mock meals
 * (the ones the patient cohort already has) plus 8 synthesized meals so the
 * queue has enough breadth to demo the keyboard-driven sweep.
 */
export const DEMO_QUEUE_MEALS = [
  ...MEALS.filter((m) => m.reviewStatus === "pending_review"),
  ...synthesizeMeals(8),
];
