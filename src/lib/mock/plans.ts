import type { Cuisine, MealPlan, Recipe } from "./types";
import { PATIENTS } from "./patients";

export const ASHA_PLAN: MealPlan = {
  patientId: "asha",
  weekStart: new Date().toISOString(),
  approvedByDietitianAt: new Date(Date.now() - 86400000).toISOString(),
  items: [
    {
      mealType: "breakfast",
      title: "Vegetable poha with peanuts",
      description: "Flattened rice with onion, mustard seeds, peanuts, lemon.",
      rationale:
        "Keeps morning glucose under 7.5 mmol/L; protein+fibre balance.",
    },
    {
      mealType: "lunch",
      title: "Dhal + half rice + cucumber raita",
      description: "Yellow dhal, half cup basmati, raita and cucumber salad.",
      rationale: "Halved rice portion to reduce post-prandial spike.",
    },
    {
      mealType: "dinner",
      title: "Tandoori fish, sautéed greens, 1 roti",
      description:
        "Yoghurt-marinated fish; mustard greens; one wholewheat roti.",
      rationale: "Replaces rice-heavy dinner with low-GI option.",
    },
    {
      mealType: "snack",
      title: "Roasted chickpeas",
      description: "Air-roasted with chaat masala.",
      rationale: "High protein, satisfies crunch craving.",
    },
  ],
};

export const RECIPES: Recipe[] = [
  {
    id: "veg-poha",
    title: "Vegetable poha with peanuts",
    why: "Steady morning glucose. Protein + fibre.",
    cuisine: "south_asian",
    ingredients: [
      "1 cup poha (flattened rice)",
      "1 small onion, diced",
      "2 tbsp roasted peanuts",
      "1 tsp mustard seeds",
      "1 green chilli, sliced",
      "Lemon juice",
      "Coriander",
    ],
  },
  {
    id: "tandoori-fish",
    title: "Tandoori fish with sautéed greens",
    why: "Low-GI, swaps rice for greens.",
    cuisine: "south_asian",
    ingredients: [
      "1 fish fillet (snapper / barramundi)",
      "2 tbsp Greek yoghurt",
      "1 tsp tandoori spice",
      "1 bunch mustard greens",
      "Garlic, ginger, salt",
      "1 wholewheat roti",
    ],
  },
];

export function recipeById(id: string): Recipe | undefined {
  return RECIPES.find((r) => r.id === id);
}

/**
 * Pre-existing approved plans, keyed by patientId. The cross-patient
 * quick-apply flow scans these to suggest "you've already built a plan for a
 * patient in the same cuisine — copy it as a draft?"
 */
export const PLANS_BY_PATIENT: Record<string, MealPlan> = {
  asha: ASHA_PLAN,
};

/**
 * Find a sibling patient (same cuisine, same dietitian) who already has an
 * approved plan, so the dietitian can clone it as a draft for a new patient.
 *
 * Returns null when no precedent exists.
 */
export function findSameCuisinePlanFor(patientId: string): {
  sourcePatientId: string;
  sourcePatientName: string;
  cuisine: Cuisine;
  plan: MealPlan;
} | null {
  const target = PATIENTS.find((p) => p.id === patientId);
  if (!target) return null;
  const sibling = PATIENTS.find(
    (p) =>
      p.id !== target.id &&
      p.cuisine === target.cuisine &&
      p.assignedDietitianId === target.assignedDietitianId &&
      PLANS_BY_PATIENT[p.id],
  );
  if (!sibling) return null;
  const plan = PLANS_BY_PATIENT[sibling.id];
  return {
    sourcePatientId: sibling.id,
    sourcePatientName: `${sibling.firstName} ${sibling.lastName}`,
    cuisine: sibling.cuisine,
    plan,
  };
}
