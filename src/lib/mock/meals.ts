import type { MealLog } from "./types";

const todayMinus = (days: number, hours: number, minutes = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

export const MEALS: MealLog[] = [
  {
    id: "m-asha-1",
    patientId: "asha",
    mealType: "dinner",
    cuisine: "south_asian",
    photoEmoji: "🍛",
    eatenAt: todayMinus(1, 19, 30),
    reviewStatus: "pending_review",
    patientNote: "Had extra chutney today.",
    analysis: {
      foods: [
        { name: "basmati rice", quantity: "medium portion", confidence: 0.92 },
        { name: "yellow dhal", quantity: "small bowl", confidence: 0.88 },
        { name: "fish curry", quantity: "1 fillet", confidence: 0.81 },
        { name: "cucumber salad", quantity: "side", confidence: 0.78 },
      ],
      carbLoad: "high",
      proteinLoad: "moderate",
      fibreLoad: "low",
      fatLoad: "moderate",
      cuisineTags: ["South Asian"],
      cgmPeakDeltaMmol: 3.2,
      cgmPeakAtMin: 90,
      confidence: 0.82,
      dietitianSummary: "Rice-dominant dinner with moderate protein.",
      clinicalFlags: ["possible high post-prandial glucose risk"],
    },
  },
  {
    id: "m-ken-1",
    patientId: "ken",
    mealType: "breakfast",
    cuisine: "anglo",
    photoEmoji: "🍳",
    eatenAt: todayMinus(0, 8, 15),
    reviewStatus: "pending_review",
    analysis: {
      foods: [
        { name: "eggs", quantity: "2", confidence: 0.95 },
        { name: "wholegrain toast", quantity: "1 slice", confidence: 0.9 },
        { name: "avocado", quantity: "1/2", confidence: 0.92 },
        { name: "coffee", quantity: "1 cup, black", confidence: 0.88 },
      ],
      carbLoad: "low",
      proteinLoad: "moderate",
      fibreLoad: "moderate",
      fatLoad: "moderate",
      cuisineTags: ["Anglo"],
      cgmPeakDeltaMmol: 0.8,
      cgmPeakAtMin: 45,
      confidence: 0.91,
      dietitianSummary: "Low-glycaemic breakfast, glucose stable.",
      clinicalFlags: [],
    },
  },
  {
    id: "m-asha-2",
    patientId: "asha",
    mealType: "lunch",
    cuisine: "south_asian",
    photoEmoji: "🥗",
    eatenAt: todayMinus(0, 13, 0),
    reviewStatus: "approved",
    analysis: {
      foods: [
        { name: "lentil bowl", quantity: "medium", confidence: 0.84 },
        { name: "yoghurt", quantity: "side", confidence: 0.86 },
      ],
      carbLoad: "moderate",
      proteinLoad: "moderate",
      fibreLoad: "high",
      fatLoad: "low",
      cuisineTags: ["South Asian"],
      cgmPeakDeltaMmol: 1.4,
      cgmPeakAtMin: 75,
      confidence: 0.84,
      dietitianSummary: "Balanced lunch — strong protein and fibre.",
      clinicalFlags: [],
    },
  },
  {
    id: "m-asha-3",
    patientId: "asha",
    mealType: "breakfast",
    cuisine: "south_asian",
    photoEmoji: "🍚",
    eatenAt: todayMinus(1, 8, 0),
    reviewStatus: "approved",
    analysis: {
      foods: [
        { name: "idli", quantity: "2 pieces", confidence: 0.89 },
        { name: "sambar", quantity: "small bowl", confidence: 0.85 },
        { name: "coconut chutney", quantity: "1 tbsp", confidence: 0.81 },
      ],
      carbLoad: "moderate",
      proteinLoad: "moderate",
      fibreLoad: "moderate",
      fatLoad: "low",
      cuisineTags: ["South Asian"],
      cgmPeakDeltaMmol: 1.2,
      cgmPeakAtMin: 60,
      confidence: 0.86,
      dietitianSummary:
        "Fermented breakfast; lower GI than fresh rice, good protein from sambar lentils.",
      clinicalFlags: [],
    },
  },
  {
    id: "m-asha-4",
    patientId: "asha",
    mealType: "lunch",
    cuisine: "south_asian",
    photoEmoji: "🫘",
    eatenAt: todayMinus(1, 13, 0),
    reviewStatus: "approved",
    analysis: {
      foods: [
        { name: "rajma", quantity: "medium bowl", confidence: 0.88 },
        { name: "brown rice", quantity: "small portion", confidence: 0.9 },
        { name: "cucumber raita", quantity: "side", confidence: 0.84 },
      ],
      carbLoad: "moderate",
      proteinLoad: "high",
      fibreLoad: "high",
      fatLoad: "low",
      cuisineTags: ["South Asian"],
      cgmPeakDeltaMmol: 1.6,
      cgmPeakAtMin: 75,
      confidence: 0.87,
      dietitianSummary:
        "Kidney bean + brown rice — high fibre slows absorption; moderate spike expected.",
      clinicalFlags: [],
    },
  },
  {
    id: "m-asha-5",
    patientId: "asha",
    mealType: "breakfast",
    cuisine: "south_asian",
    photoEmoji: "🥣",
    eatenAt: todayMinus(0, 8, 15),
    reviewStatus: "pending_review",
    analysis: {
      foods: [
        { name: "moong dal chilla", quantity: "2 small", confidence: 0.87 },
        { name: "mint chutney", quantity: "1 tbsp", confidence: 0.83 },
      ],
      carbLoad: "low",
      proteinLoad: "high",
      fibreLoad: "moderate",
      fatLoad: "low",
      cuisineTags: ["South Asian"],
      cgmPeakDeltaMmol: 0.9,
      cgmPeakAtMin: 60,
      confidence: 0.85,
      dietitianSummary:
        "Lentil crepes — high protein, low GI; excellent breakfast choice for glucose control.",
      clinicalFlags: [],
    },
  },
  {
    id: "m-omar-1",
    patientId: "omar",
    mealType: "dinner",
    cuisine: "middle_eastern",
    photoEmoji: "🥙",
    eatenAt: todayMinus(0, 19, 0),
    reviewStatus: "pending_review",
    analysis: {
      foods: [
        { name: "grilled chicken", quantity: "1 breast", confidence: 0.94 },
        { name: "tabbouleh", quantity: "side", confidence: 0.86 },
        { name: "hummus", quantity: "2 tbsp", confidence: 0.82 },
      ],
      carbLoad: "low",
      proteinLoad: "high",
      fibreLoad: "high",
      fatLoad: "moderate",
      cuisineTags: ["Middle Eastern"],
      cgmPeakDeltaMmol: 0.9,
      cgmPeakAtMin: 60,
      confidence: 0.88,
      dietitianSummary:
        "High-protein, high-fibre dinner. Excellent fit for plan.",
      clinicalFlags: [],
    },
  },
  {
    id: "m-lina-1",
    patientId: "lina",
    mealType: "breakfast",
    cuisine: "mediterranean",
    photoEmoji: "🥐",
    eatenAt: todayMinus(0, 9, 0),
    reviewStatus: "pending_review",
    analysis: {
      foods: [
        { name: "croissant", quantity: "1", confidence: 0.91 },
        { name: "jam", quantity: "1 tbsp", confidence: 0.85 },
        { name: "latte", quantity: "1 cup", confidence: 0.88 },
      ],
      carbLoad: "high",
      proteinLoad: "low",
      fibreLoad: "low",
      fatLoad: "high",
      cuisineTags: ["Mediterranean"],
      cgmPeakDeltaMmol: 2.6,
      cgmPeakAtMin: 75,
      confidence: 0.79,
      dietitianSummary: "Refined-carb breakfast; spike-dominant pattern.",
      clinicalFlags: ["high glycaemic load"],
    },
  },
];

export function mealsForPatient(patientId: string): MealLog[] {
  return MEALS.filter((m) => m.patientId === patientId);
}

export function pendingMeals(): MealLog[] {
  return MEALS.filter((m) => m.reviewStatus === "pending_review");
}
