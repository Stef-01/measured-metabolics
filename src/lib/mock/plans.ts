import type { Cuisine, MealPlan, Recipe } from "./types";
import { PATIENTS } from "./patients";

// Monday of the current week — stable across page loads so localStorage
// eaten-state keys don't drift when the module re-evaluates.
function currentWeekMonday(): string {
  const d = new Date();
  const dow = d.getDay();
  d.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1));
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export const ASHA_PLAN: MealPlan = {
  patientId: "asha",
  weekStart: currentWeekMonday(),
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
  dayItems: {
    // 0 = Monday
    0: [
      {
        mealType: "breakfast",
        title: "Vegetable poha with peanuts",
        description:
          "Flattened rice with onion, mustard seeds, roasted peanuts, lemon.",
        rationale: "Low-GI start; protein and fibre keep glucose under 7.5.",
      },
      {
        mealType: "lunch",
        title: "Dhal + half cup rice + cucumber raita",
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
        rationale: "High protein, satisfies crunch craving without spiking.",
      },
    ],
    // 1 = Tuesday
    1: [
      {
        mealType: "breakfast",
        title: "Moong dal chilla with mint chutney",
        description:
          "Thin savoury lentil crepe with onion, green chilli, coriander.",
        rationale: "High-protein, low-GI breakfast — better than paratha.",
      },
      {
        mealType: "lunch",
        title: "Chana dal + 1 roti + sliced cucumber",
        description: "Split chickpea curry, one wholewheat roti, raw cucumber.",
        rationale: "Legume fibre slows glucose absorption.",
      },
      {
        mealType: "dinner",
        title: "Palak paneer (low-oil) + half cup brown rice",
        description: "Spinach and cottage cheese curry; half cup cooked rice.",
        rationale:
          "Iron and protein from spinach; brown rice lowers GI vs white.",
      },
      {
        mealType: "snack",
        title: "Apple with 10 almonds",
        description: "Small apple, 10 raw almonds.",
        rationale: "Paired fibre + fat slows fructose absorption.",
      },
    ],
    // 2 = Wednesday
    2: [
      {
        mealType: "breakfast",
        title: "Oats upma with mixed vegetables",
        description:
          "Rolled oats cooked with mustard seeds, curry leaf, carrot, peas.",
        rationale: "Beta-glucan in oats improves post-breakfast glucose.",
      },
      {
        mealType: "lunch",
        title: "Rajma + half cup brown rice + salad",
        description:
          "Kidney bean curry, half cup cooked brown rice, onion salad.",
        rationale:
          "Kidney beans are very low GI; boosts weekly legume variety.",
      },
      {
        mealType: "dinner",
        title: "Grilled chicken tikka + sautéed spinach + 1 roti",
        description:
          "Yoghurt-marinated chicken, wilted spinach with garlic, one roti.",
        rationale:
          "High protein, minimal starch — lightest dinner of the week.",
      },
      {
        mealType: "snack",
        title: "Greek yoghurt with cumin",
        description: "Small cup plain Greek yoghurt, pinch of roasted cumin.",
        rationale: "Protein-rich snack; cumin may aid glucose metabolism.",
      },
    ],
    // 3 = Thursday
    3: [
      {
        mealType: "breakfast",
        title: "Egg bhurji on 1 wholewheat roti",
        description:
          "Scrambled eggs with onion, tomato, green chilli, turmeric.",
        rationale: "Eggs provide complete protein; roti adds slow carb.",
      },
      {
        mealType: "lunch",
        title: "Chole + half cup rice + onion salad",
        description:
          "Chickpea curry, half cup basmati, raw onion and coriander.",
        rationale: "Chickpeas rank among the lowest-GI legumes.",
      },
      {
        mealType: "dinner",
        title: "Baked masala fish + stir-fried greens",
        description:
          "Spiced baked snapper; sautéed bok choy and mustard greens.",
        rationale:
          "Baked (not fried) keeps fat low; omega-3 supports insulin sensitivity.",
      },
      {
        mealType: "snack",
        title: "Roasted makhana",
        description: "Fox nuts roasted with black pepper and rock salt.",
        rationale: "Low GI, light protein; curbs evening hunger before dinner.",
      },
    ],
    // 4 = Friday
    4: [
      {
        mealType: "breakfast",
        title: "Besan chilla with mint chutney",
        description: "Gram-flour pancake with finely chopped onion and ginger.",
        rationale: "Chickpea flour is low GI and high in plant protein.",
      },
      {
        mealType: "lunch",
        title: "Yellow dhal + half cup rice + papad",
        description:
          "Toor dhal tempered with cumin, half cup basmati, one papad.",
        rationale:
          "Comfort meal kept glucose-friendly by capping rice at half cup.",
      },
      {
        mealType: "dinner",
        title: "Chicken curry (low-oil) + 1 jowar roti",
        description: "Tomato-based chicken curry, one sorghum flatbread.",
        rationale: "Jowar roti is gluten-free and lower GI than wheat.",
      },
      {
        mealType: "snack",
        title: "Carrot sticks with mint chutney",
        description:
          "Raw carrot sticks, small serving of blended mint chutney.",
        rationale: "Crunchy, low calorie; high beta-carotene.",
      },
    ],
    // 5 = Saturday
    5: [
      {
        mealType: "breakfast",
        title: "Vegetable upma with coconut",
        description:
          "Semolina cooked with vegetables, mustard seeds, grated coconut.",
        rationale:
          "Slightly higher carb but balanced by fibre-rich vegetables.",
      },
      {
        mealType: "lunch",
        title: "Quinoa khichdi with vegetables",
        description:
          "Quinoa and moong dal cooked together with carrot and peas.",
        rationale:
          "Quinoa provides complete protein and has a low glycaemic load.",
      },
      {
        mealType: "dinner",
        title: "Paneer tikka + sautéed spinach + 1 roti",
        description:
          "Grilled marinated paneer cubes, wilted spinach with garlic, roti.",
        rationale: "Vegetarian higher-protein dinner; iron from spinach.",
      },
      {
        mealType: "snack",
        title: "Mixed seeds with dried fruit (small)",
        description:
          "1 tbsp each pumpkin and sunflower seeds, 3 dried apricots.",
        rationale: "Healthy fats + iron; small portion keeps carbs controlled.",
      },
    ],
    // 6 = Sunday
    6: [
      {
        mealType: "breakfast",
        title: "Idli with sambar (2 idli)",
        description:
          "Two steamed rice-lentil cakes with a small bowl of sambar.",
        rationale:
          "Fermented idli has lower GI than plain rice; sambar adds protein.",
      },
      {
        mealType: "lunch",
        title: "Mixed dal + half cup brown rice + cabbage sabzi",
        description:
          "Three-lentil dal, half cup brown rice, dry-cooked cabbage.",
        rationale:
          "Mixed lentils boost amino-acid profile; cabbage is very low GI.",
      },
      {
        mealType: "dinner",
        title: "Salmon tikka + sautéed greens + 1 roti",
        description:
          "Spiced baked salmon fillet, sautéed mustard greens, one roti.",
        rationale:
          "Omega-3 fatty acids in salmon improve insulin sensitivity over time.",
      },
      {
        mealType: "snack",
        title: "Buttermilk with roasted cumin",
        description: "One glass thin buttermilk (chaas) with jeera.",
        rationale:
          "Probiotic-rich and essentially carb-free; aids digestion on rest day.",
      },
    ],
  },
};

export const RECIPES: Recipe[] = [
  {
    id: "veg-poha",
    title: "Vegetable poha with peanuts",
    why: "Steady morning glucose. Protein + fibre.",
    cuisine: "south_asian",
    prepMinutes: 15,
    servings: 1,
    kcalEstimate: 310,
    macroProfile: {
      carbs: "moderate",
      protein: "moderate",
      fat: "low",
      fibre: "high",
    },
    ingredients: [
      "1 cup poha (flattened rice)",
      "1 small onion, diced",
      "2 tbsp roasted peanuts",
      "1 tsp mustard seeds",
      "1 green chilli, sliced",
      "Lemon juice",
      "Coriander",
    ],
    steps: [
      "Rinse the poha in a fine-mesh strainer under cold water until soft — about 30 seconds. Shake off excess water.",
      "Heat 1 tsp oil in a non-stick pan over medium heat. Add mustard seeds; cover until they pop (10–15 s).",
      "Add onion and chilli. Cook 3–4 min until onion is soft and translucent.",
      "Stir in the rinsed poha. Toss to combine; season with a pinch of salt.",
      "Add peanuts and cook 1–2 min, stirring continuously, until the poha is lightly toasted.",
      "Remove from heat. Squeeze lemon juice over and garnish with fresh coriander. Serve immediately.",
    ],
  },
  {
    id: "tandoori-fish",
    title: "Tandoori fish with sautéed greens",
    why: "Low-GI, swaps rice for greens.",
    cuisine: "south_asian",
    prepMinutes: 25,
    servings: 1,
    kcalEstimate: 385,
    macroProfile: {
      carbs: "low",
      protein: "high",
      fat: "low",
      fibre: "moderate",
    },
    ingredients: [
      "1 fish fillet (snapper / barramundi)",
      "2 tbsp Greek yoghurt",
      "1 tsp tandoori spice",
      "1 bunch mustard greens",
      "Garlic, ginger, salt",
      "1 wholewheat roti",
    ],
    steps: [
      "Mix Greek yoghurt with tandoori spice, ½ tsp grated ginger, and a pinch of salt to form the marinade.",
      "Coat the fish fillet evenly with the marinade. Marinate for at least 20 min (or up to 2 h in the fridge).",
      "Preheat the grill or oven to 220 °C / 200 °C fan. Grill fish 4–5 min per side until cooked through and slightly charred.",
      "While the fish grills, heat 1 tsp oil in a wide pan. Add sliced garlic; cook 30 s. Add mustard greens and toss for 2–3 min until wilted. Season.",
      "Warm the roti in a dry pan for 30 s each side.",
      "Plate fish over the greens with roti on the side. Squeeze lime if desired.",
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
