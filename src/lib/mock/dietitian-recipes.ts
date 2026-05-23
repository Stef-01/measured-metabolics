import type { Cuisine, MealType, Recipe } from "./types";

/**
 * Each dietitian's personal recipe library.
 *
 * The PRD vision: Maya has built up a curated set of recipes she's prescribed
 * to past patients. When a new South Asian patient is referred, she should be
 * able to filter by cuisine and one-click apply the recipe to a meal slot in
 * the new patient's plan — instead of retyping it.
 *
 * Stage 5 swaps this for a Supabase `dietitian_recipes` table seeded from the
 * dietitian's first 4 weeks of approved plans.
 */

export interface DietitianRecipe extends Recipe {
  defaultMealType: MealType;
  prepMinutes: number;
  /** Auto-generated from approved plans the dietitian sent in past weeks. */
  lastUsedAt?: string;
  /** Number of times this dietitian has applied the recipe to a patient. */
  timesApplied: number;
  /** Patient IDs this recipe has been applied to (for "applied to N patients" hint). */
  appliedToPatientIds: string[];
}

export const DIETITIAN_RECIPE_LIBRARY: Record<string, DietitianRecipe[]> = {
  maya: [
    {
      id: "veg-poha",
      title: "Vegetable poha with peanuts",
      why: "Steady morning glucose. Protein + fibre.",
      cuisine: "south_asian",
      defaultMealType: "breakfast",
      prepMinutes: 15,
      timesApplied: 6,
      appliedToPatientIds: ["asha"],
      lastUsedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
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
      defaultMealType: "dinner",
      prepMinutes: 25,
      timesApplied: 4,
      appliedToPatientIds: ["asha"],
      lastUsedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      ingredients: [
        "1 fish fillet (snapper / barramundi)",
        "2 tbsp Greek yoghurt",
        "1 tsp tandoori spice",
        "1 bunch mustard greens",
        "Garlic, ginger, salt",
        "1 wholewheat roti",
      ],
    },
    {
      id: "dhal-half-rice",
      title: "Dhal with half rice + cucumber raita",
      why: "Halves the rice portion to flatten post-prandial spike.",
      cuisine: "south_asian",
      defaultMealType: "lunch",
      prepMinutes: 30,
      timesApplied: 5,
      appliedToPatientIds: ["asha"],
      lastUsedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      ingredients: [
        "1/2 cup yellow dhal",
        "1/2 cup cooked basmati",
        "1/2 cup cucumber raita",
        "1 small green salad",
        "Cumin, turmeric, coriander",
      ],
    },
    {
      id: "roasted-chickpeas",
      title: "Roasted chickpeas with chaat masala",
      why: "Crunchy snack, high protein, satisfies craving without spike.",
      cuisine: "south_asian",
      defaultMealType: "snack",
      prepMinutes: 10,
      timesApplied: 3,
      appliedToPatientIds: ["asha"],
      lastUsedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      ingredients: [
        "1 can chickpeas, drained",
        "1 tsp olive oil",
        "1 tsp chaat masala",
        "Pinch salt",
      ],
    },
    {
      id: "miso-tofu-bowl",
      title: "Miso tofu and brown-rice bowl",
      why: "Plant protein + fibre for stable lunch glucose.",
      cuisine: "east_asian",
      defaultMealType: "lunch",
      prepMinutes: 20,
      timesApplied: 2,
      appliedToPatientIds: ["ken"],
      lastUsedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      ingredients: [
        "200g firm tofu, cubed",
        "1 tbsp white miso",
        "1/2 cup brown rice (cooked)",
        "1 cup steamed greens",
        "Sesame seeds",
      ],
    },
    {
      id: "soba-noodle-salad",
      title: "Cold soba noodle salad",
      why: "Lower-GI buckwheat noodle for warm-weather dinner.",
      cuisine: "east_asian",
      defaultMealType: "dinner",
      prepMinutes: 15,
      timesApplied: 1,
      appliedToPatientIds: ["ken"],
      ingredients: [
        "100g soba noodles",
        "1/2 cucumber, julienned",
        "1 tbsp tamari",
        "1 tsp sesame oil",
        "1 boiled egg",
        "Spring onion",
      ],
    },
    {
      id: "labneh-zaatar",
      title: "Labneh with za'atar and tomato",
      why: "Mediterranean breakfast template; high protein, low-carb.",
      cuisine: "middle_eastern",
      defaultMealType: "breakfast",
      prepMinutes: 5,
      timesApplied: 3,
      appliedToPatientIds: ["omar"],
      lastUsedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      ingredients: [
        "3 tbsp labneh",
        "1 tsp olive oil",
        "1 tsp za'atar",
        "1 tomato, sliced",
        "1 small wholegrain pita",
      ],
    },
    {
      id: "shakshuka",
      title: "Shakshuka with feta",
      why: "Tomato + eggs, low-GI dinner, BP-friendly when feta is sparing.",
      cuisine: "middle_eastern",
      defaultMealType: "dinner",
      prepMinutes: 25,
      timesApplied: 2,
      appliedToPatientIds: ["omar"],
      ingredients: [
        "1 can crushed tomatoes",
        "1 onion, diced",
        "1 red capsicum",
        "2 eggs",
        "30g feta",
        "1 tsp paprika, cumin",
      ],
    },
  ],
  sarah: [
    {
      id: "greek-eggs",
      title: "Greek scrambled eggs with feta",
      why: "PCOS-friendly: protein-led breakfast keeps insulin lower.",
      cuisine: "mediterranean",
      defaultMealType: "breakfast",
      prepMinutes: 10,
      timesApplied: 2,
      appliedToPatientIds: ["lina"],
      lastUsedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      ingredients: [
        "3 eggs",
        "30g feta",
        "1/2 cup spinach",
        "1 tomato, diced",
        "Olive oil",
      ],
    },
    {
      id: "chicken-quinoa-bowl",
      title: "Lemon-herb chicken quinoa bowl",
      why: "Lean protein + fibre for steady afternoon energy.",
      cuisine: "mediterranean",
      defaultMealType: "lunch",
      prepMinutes: 25,
      timesApplied: 1,
      appliedToPatientIds: ["lina"],
      ingredients: [
        "120g chicken breast",
        "1/2 cup quinoa",
        "1 cup mixed greens",
        "Lemon, garlic, oregano",
        "Olive oil",
      ],
    },
  ],
};

export function getDietitianRecipes(dietitianId: string): DietitianRecipe[] {
  return DIETITIAN_RECIPE_LIBRARY[dietitianId] ?? [];
}

export function getRecipesByCuisine(
  dietitianId: string,
  cuisine: Cuisine,
): DietitianRecipe[] {
  return getDietitianRecipes(dietitianId).filter((r) => r.cuisine === cuisine);
}

export function getRecipesForMeal(
  dietitianId: string,
  mealType: MealType,
  cuisine?: Cuisine,
): DietitianRecipe[] {
  return getDietitianRecipes(dietitianId)
    .filter((r) => r.defaultMealType === mealType)
    .filter((r) => (cuisine ? r.cuisine === cuisine : true));
}

/**
 * Group a dietitian's library by cuisine, sorted by most-recently-used first.
 * Used by the Recipe Library panel and the persona-aware Plan tab.
 */
export function groupRecipesByCuisine(
  dietitianId: string,
): { cuisine: Cuisine; recipes: DietitianRecipe[] }[] {
  const recipes = getDietitianRecipes(dietitianId);
  const map = new Map<Cuisine, DietitianRecipe[]>();
  for (const r of recipes) {
    const list = map.get(r.cuisine) ?? [];
    list.push(r);
    map.set(r.cuisine, list);
  }
  return Array.from(map.entries())
    .map(([cuisine, recipes]) => ({
      cuisine,
      recipes: recipes.sort((a, b) => {
        const aT = a.lastUsedAt ? new Date(a.lastUsedAt).getTime() : 0;
        const bT = b.lastUsedAt ? new Date(b.lastUsedAt).getTime() : 0;
        return bT - aT;
      }),
    }))
    .sort((a, b) => b.recipes.length - a.recipes.length);
}
