import type { MealLog, MealType, Cuisine, ReviewStatus } from "./types";
import { PATIENTS } from "./patients";

const TEMPLATES: Record<
  MealType,
  Array<{
    foods: { name: string; quantity: string; confidence: number }[];
    summary: string;
    flags: string[];
    carb: "low" | "moderate" | "high";
    protein: "low" | "moderate" | "high";
    fibre: "low" | "moderate" | "high";
    fat: "low" | "moderate" | "high";
    delta: number;
    emoji: string;
    cuisine: Cuisine;
  }>
> = {
  breakfast: [
    {
      foods: [
        { name: "oats", quantity: "1 bowl", confidence: 0.9 },
        { name: "berries", quantity: "1/2 cup", confidence: 0.86 },
      ],
      summary: "Steady morning glucose.",
      flags: [],
      carb: "moderate",
      protein: "low",
      fibre: "high",
      fat: "low",
      delta: 1.0,
      emoji: "🥣",
      cuisine: "anglo",
    },
    {
      foods: [
        { name: "paratha", quantity: "1", confidence: 0.92 },
        { name: "yoghurt", quantity: "1 cup", confidence: 0.86 },
      ],
      summary: "Refined carb breakfast — moderate spike.",
      flags: ["moderate glycaemic load"],
      carb: "high",
      protein: "moderate",
      fibre: "low",
      fat: "moderate",
      delta: 2.4,
      emoji: "🫓",
      cuisine: "south_asian",
    },
  ],
  lunch: [
    {
      foods: [
        { name: "grilled chicken salad", quantity: "1 bowl", confidence: 0.91 },
      ],
      summary: "Strong lunch — high protein.",
      flags: [],
      carb: "low",
      protein: "high",
      fibre: "moderate",
      fat: "moderate",
      delta: 0.8,
      emoji: "🥗",
      cuisine: "mediterranean",
    },
    {
      foods: [{ name: "fried rice", quantity: "medium", confidence: 0.85 }],
      summary: "Fried-rice lunch; carb-dominant.",
      flags: ["high glycaemic load"],
      carb: "high",
      protein: "moderate",
      fibre: "low",
      fat: "high",
      delta: 3.0,
      emoji: "🍚",
      cuisine: "east_asian",
    },
  ],
  dinner: [
    {
      foods: [
        { name: "tandoori fish", quantity: "1 fillet", confidence: 0.88 },
        { name: "salad", quantity: "side", confidence: 0.78 },
      ],
      summary: "Low-GI dinner — good fit.",
      flags: [],
      carb: "low",
      protein: "high",
      fibre: "high",
      fat: "moderate",
      delta: 0.7,
      emoji: "🐟",
      cuisine: "south_asian",
    },
    {
      foods: [{ name: "biryani", quantity: "1 plate", confidence: 0.84 }],
      summary: "Rice-heavy dinner — likely spike.",
      flags: ["high glycaemic load"],
      carb: "high",
      protein: "moderate",
      fibre: "low",
      fat: "moderate",
      delta: 3.4,
      emoji: "🍛",
      cuisine: "south_asian",
    },
  ],
  snack: [
    {
      foods: [
        { name: "roasted chickpeas", quantity: "handful", confidence: 0.88 },
      ],
      summary: "Smart snack.",
      flags: [],
      carb: "low",
      protein: "moderate",
      fibre: "moderate",
      fat: "low",
      delta: 0.4,
      emoji: "🥜",
      cuisine: "south_asian",
    },
  ],
};

function mealTypeFromHour(h: number): MealType {
  if (h < 11) return "breakfast";
  if (h < 15) return "lunch";
  if (h < 21) return "dinner";
  return "snack";
}

/**
 * Generates a deterministic-ish stream of meals across the demo cohort.
 * Used both for seeding the dietitian queue demo (size = 12) and for the
 * Loop 2 perf test (size = 100).
 */
export function synthesizeMeals(
  count: number,
  status: ReviewStatus = "pending_review",
): MealLog[] {
  const out: MealLog[] = [];
  const base = Date.now();
  for (let i = 0; i < count; i++) {
    const patient = PATIENTS[i % PATIENTS.length];
    const hoursBack = i * 1.7 + 1;
    const ts = new Date(base - hoursBack * 3600 * 1000);
    const mt = mealTypeFromHour(ts.getHours());
    const templates = TEMPLATES[mt];
    const t = templates[i % templates.length];
    out.push({
      id: `synth-${i}`,
      patientId: patient.id,
      mealType: mt,
      cuisine: t.cuisine,
      photoEmoji: t.emoji,
      eatenAt: ts.toISOString(),
      reviewStatus: status,
      analysis: {
        foods: t.foods,
        carbLoad: t.carb,
        proteinLoad: t.protein,
        fibreLoad: t.fibre,
        fatLoad: t.fat,
        cuisineTags: [t.cuisine.replace("_", " ")],
        cgmPeakDeltaMmol: t.delta,
        cgmPeakAtMin: 60 + (i % 30),
        confidence: 0.7 + ((i * 7) % 30) / 100,
        dietitianSummary: t.summary,
        clinicalFlags: t.flags,
      },
    });
  }
  return out;
}
