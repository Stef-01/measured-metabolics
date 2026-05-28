export interface MealSuggestion {
  id: string;
  name: string;
  emoji: string;
  description: string;
  foods: string[];
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  macros: {
    carbs: "low" | "moderate" | "high";
    protein: "low" | "moderate" | "high";
    fibre: "low" | "moderate" | "high";
  };
  gradientFrom: string;
  gradientTo: string;
  dietitianPick: boolean;
  dietitianNote?: string;
}

export const MEAL_SUGGESTIONS: MealSuggestion[] = [
  {
    id: "ms-1",
    name: "Grilled Salmon Bowl",
    emoji: "🐟",
    description:
      "Omega-rich protein with roasted broccolini, avocado, and brown rice",
    foods: [
      "grilled salmon",
      "brown rice",
      "roasted broccolini",
      "avocado",
      "sesame seeds",
    ],
    mealType: "dinner",
    macros: { carbs: "moderate", protein: "high", fibre: "high" },
    gradientFrom: "#1a3a5c",
    gradientTo: "#2d6b95",
    dietitianPick: true,
    dietitianNote: "Great for your CGM targets",
  },
  {
    id: "ms-2",
    name: "Egg & Avo Toast",
    emoji: "🥑",
    description:
      "Low-GI start — complete protein, healthy fats, slow-release carbs",
    foods: [
      "sourdough toast",
      "2 poached eggs",
      "½ avocado",
      "cherry tomatoes",
      "chilli flakes",
    ],
    mealType: "breakfast",
    macros: { carbs: "low", protein: "moderate", fibre: "moderate" },
    gradientFrom: "#2d5016",
    gradientTo: "#4a7c2f",
    dietitianPick: true,
    dietitianNote: "Strong morning option",
  },
  {
    id: "ms-3",
    name: "Lentil Dahl",
    emoji: "🍲",
    description:
      "High-fibre pulse base with anti-inflammatory spices and spinach",
    foods: [
      "red lentils",
      "spinach",
      "cumin",
      "turmeric",
      "coconut milk",
      "wholegrain naan",
    ],
    mealType: "dinner",
    macros: { carbs: "moderate", protein: "moderate", fibre: "high" },
    gradientFrom: "#5c2d00",
    gradientTo: "#a05c1a",
    dietitianPick: false,
  },
  {
    id: "ms-4",
    name: "Greek Salad Wrap",
    emoji: "🥙",
    description:
      "Crisp veggies, feta, and grilled chicken in a wholegrain wrap",
    foods: [
      "wholegrain wrap",
      "grilled chicken",
      "feta",
      "cucumber",
      "olives",
      "red onion",
    ],
    mealType: "lunch",
    macros: { carbs: "low", protein: "high", fibre: "moderate" },
    gradientFrom: "#1e3c5c",
    gradientTo: "#2d7d82",
    dietitianPick: true,
    dietitianNote: "Ideal for busy lunch days",
  },
  {
    id: "ms-5",
    name: "Berry Oat Bowl",
    emoji: "🫐",
    description:
      "Slow-release oats with antioxidant-rich berries and natural protein",
    foods: [
      "rolled oats",
      "blueberries",
      "strawberries",
      "Greek yoghurt",
      "chia seeds",
      "honey",
    ],
    mealType: "breakfast",
    macros: { carbs: "moderate", protein: "moderate", fibre: "high" },
    gradientFrom: "#3a1a4a",
    gradientTo: "#7b3a9a",
    dietitianPick: false,
  },
  {
    id: "ms-6",
    name: "Miso Chicken & Soba",
    emoji: "🍜",
    description:
      "Umami-forward bowl with fermented miso, lean protein, and buckwheat",
    foods: [
      "soba noodles",
      "miso-glazed chicken",
      "bok choy",
      "edamame",
      "sesame oil",
      "nori",
    ],
    mealType: "dinner",
    macros: { carbs: "moderate", protein: "high", fibre: "moderate" },
    gradientFrom: "#1e3528",
    gradientTo: "#2d5a3c",
    dietitianPick: false,
  },
  {
    id: "ms-7",
    name: "Tuna Poke Bowl",
    emoji: "🍣",
    description:
      "Raw sashimi-grade tuna over sushi rice with pickled veg and ponzu",
    foods: [
      "sushi rice",
      "sashimi tuna",
      "edamame",
      "pickled cucumber",
      "avocado",
      "ponzu",
    ],
    mealType: "lunch",
    macros: { carbs: "moderate", protein: "high", fibre: "moderate" },
    gradientFrom: "#10243c",
    gradientTo: "#1a4a6a",
    dietitianPick: true,
    dietitianNote: "High DHA — perfect timing",
  },
  {
    id: "ms-8",
    name: "Veggie Stir-Fry",
    emoji: "🥦",
    description:
      "Flash-fried seasonal vegetables with tofu, ginger, and tamari sauce",
    foods: [
      "firm tofu",
      "broccoli",
      "snap peas",
      "capsicum",
      "ginger",
      "tamari",
      "brown rice",
    ],
    mealType: "dinner",
    macros: { carbs: "low", protein: "moderate", fibre: "high" },
    gradientFrom: "#1a3c1e",
    gradientTo: "#3a6e2a",
    dietitianPick: false,
  },
  {
    id: "ms-9",
    name: "Chia Pudding",
    emoji: "🥥",
    description:
      "Overnight chia with coconut milk, mango, and toasted macadamias",
    foods: ["chia seeds", "coconut milk", "mango", "macadamias", "lime zest"],
    mealType: "snack",
    macros: { carbs: "moderate", protein: "low", fibre: "high" },
    gradientFrom: "#4a2c1a",
    gradientTo: "#8b5e30",
    dietitianPick: false,
  },
  {
    id: "ms-10",
    name: "Chicken & Sweet Potato",
    emoji: "🍠",
    description:
      "Roasted herb chicken thigh with mashed sweet potato and steamed greens",
    foods: [
      "chicken thigh",
      "sweet potato",
      "green beans",
      "rosemary",
      "garlic",
      "olive oil",
    ],
    mealType: "dinner",
    macros: { carbs: "moderate", protein: "high", fibre: "moderate" },
    gradientFrom: "#3c1f00",
    gradientTo: "#7c3f00",
    dietitianPick: true,
    dietitianNote: "Matches your Tuesday plan",
  },
];
