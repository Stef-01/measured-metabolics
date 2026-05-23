import type { MealPlan, Recipe } from "./types";

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
