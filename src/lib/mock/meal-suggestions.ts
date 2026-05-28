export interface MealSuggestion {
  id: string;
  name: string;
  emoji: string;
  origin?: string;
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
    name: "Saffron Barramundi",
    emoji: "🐠",
    origin: "Mediterranean",
    description:
      "Pan-seared fillet resting on silky white bean purée with charred lemon, crispy capers, and a saffron-infused pan sauce.",
    foods: [
      "barramundi fillet",
      "white bean purée",
      "saffron",
      "charred lemon",
      "crispy capers",
      "flat-leaf parsley",
    ],
    mealType: "dinner",
    macros: { carbs: "low", protein: "high", fibre: "moderate" },
    gradientFrom: "#7c4500",
    gradientTo: "#c47800",
    dietitianPick: true,
    dietitianNote: "Zero glucose spike · maximal protein",
  },
  {
    id: "ms-2",
    name: "Kuku Sabzi",
    emoji: "🌿",
    origin: "Persian",
    description:
      "Baked herb frittata dense with fenugreek, dill, parsley, dried barberries, and crushed walnut. Equally good warm or cold.",
    foods: [
      "free-range eggs",
      "fenugreek",
      "flat-leaf parsley",
      "dill",
      "dried barberries",
      "walnut",
    ],
    mealType: "breakfast",
    macros: { carbs: "low", protein: "high", fibre: "moderate" },
    gradientFrom: "#0a2a1e",
    gradientTo: "#1a5040",
    dietitianPick: true,
    dietitianNote: "Ideal fasting-break · stable insulin",
  },
  {
    id: "ms-3",
    name: "Za'atar Chicken Thighs",
    emoji: "🍗",
    origin: "Levantine",
    description:
      "Spatchcocked thighs marinated overnight in za'atar and sumac, roasted until deeply caramelised. Finished with whipped labneh and warm flatbread.",
    foods: [
      "skin-on chicken thighs",
      "za'atar",
      "sumac",
      "preserved lemon",
      "whipped labneh",
      "flatbread",
    ],
    mealType: "dinner",
    macros: { carbs: "low", protein: "high", fibre: "low" },
    gradientFrom: "#4a1a0a",
    gradientTo: "#8b3a1a",
    dietitianPick: false,
  },
  {
    id: "ms-4",
    name: "Nasu Dengaku",
    emoji: "🍆",
    origin: "Kyoto",
    description:
      "Roasted Japanese eggplant halves lacquered with sweet white miso and mirin. Finished with toasted sesame and crispy shallots.",
    foods: [
      "Japanese eggplant",
      "white miso",
      "mirin",
      "sake",
      "toasted sesame",
      "crispy shallots",
    ],
    mealType: "dinner",
    macros: { carbs: "moderate", protein: "low", fibre: "high" },
    gradientFrom: "#2d0a3d",
    gradientTo: "#5c1a6e",
    dietitianPick: false,
  },
  {
    id: "ms-5",
    name: "Smoked Trout Kedgeree",
    emoji: "🥚",
    origin: "Anglo-Indian",
    description:
      "Fragrant basmati with hot-smoked ocean trout, soft-boiled eggs, curry leaves, and golden raisins. A colonial-era breakfast reimagined.",
    foods: [
      "basmati rice",
      "hot-smoked ocean trout",
      "free-range eggs",
      "curry leaves",
      "golden raisins",
      "cardamom",
    ],
    mealType: "breakfast",
    macros: { carbs: "moderate", protein: "high", fibre: "moderate" },
    gradientFrom: "#1a2a00",
    gradientTo: "#3d6200",
    dietitianPick: false,
  },
  {
    id: "ms-6",
    name: "Lamb Shank Tagine",
    emoji: "🫕",
    origin: "Moroccan",
    description:
      "12-hour slow-braised lamb shank with preserved lemon, rose harissa, Medjool dates, and ras el hanout on pearl couscous.",
    foods: [
      "lamb shank",
      "preserved lemon",
      "rose harissa",
      "Medjool dates",
      "ras el hanout",
      "pearl couscous",
    ],
    mealType: "dinner",
    macros: { carbs: "moderate", protein: "high", fibre: "moderate" },
    gradientFrom: "#2d0c14",
    gradientTo: "#6e1a2a",
    dietitianPick: true,
    dietitianNote: "High zinc · anti-inflammatory spice blend",
  },
  {
    id: "ms-7",
    name: "Kingfish Crudo",
    emoji: "🍣",
    origin: "Nikkei",
    description:
      "Sashimi-thin kingfish with yuzu kosho, cucumber water, dill oil, and crispy rice crackers. Clean, bright, and thrillingly raw.",
    foods: [
      "sashimi-grade kingfish",
      "yuzu kosho",
      "cucumber water",
      "dill oil",
      "crispy rice wafers",
    ],
    mealType: "lunch",
    macros: { carbs: "low", protein: "high", fibre: "low" },
    gradientFrom: "#141c2e",
    gradientTo: "#253350",
    dietitianPick: true,
    dietitianNote: "Maximal omega-3 · zero glycaemic load",
  },
  {
    id: "ms-8",
    name: "Porcini Buckwheat Risotto",
    emoji: "🍄",
    origin: "Northern Italian",
    description:
      "Buckwheat groats slow-cooked risotto-style with porcini, shiitake, Parmigiano-Reggiano, and truffle oil. Earthier and more mineral than the original.",
    foods: [
      "buckwheat groats",
      "dried porcini",
      "fresh shiitake",
      "Parmigiano-Reggiano",
      "truffle oil",
      "fresh thyme",
    ],
    mealType: "dinner",
    macros: { carbs: "moderate", protein: "moderate", fibre: "high" },
    gradientFrom: "#1c1008",
    gradientTo: "#3d2208",
    dietitianPick: false,
  },
  {
    id: "ms-9",
    name: "Green Shakshuka",
    emoji: "🌶️",
    origin: "North African",
    description:
      "Eggs baked in a bright tomatillo and jalapeño salsa verde with barrel-aged feta, avocado, and masses of fresh coriander.",
    foods: [
      "free-range eggs",
      "tomatillo",
      "jalapeño",
      "barrel-aged feta",
      "avocado",
      "coriander",
    ],
    mealType: "breakfast",
    macros: { carbs: "low", protein: "moderate", fibre: "moderate" },
    gradientFrom: "#0a1f0e",
    gradientTo: "#1a4a20",
    dietitianPick: false,
  },
  {
    id: "ms-10",
    name: "Harissa Prawn Skewers",
    emoji: "🦐",
    origin: "Maghrebi",
    description:
      "Chargrilled king prawns in rose harissa, served with smoked paprika labneh, preserved lemon oil, and warm sourdough.",
    foods: [
      "king prawns",
      "rose harissa",
      "smoked paprika",
      "labneh",
      "preserved lemon oil",
      "sourdough",
    ],
    mealType: "lunch",
    macros: { carbs: "low", protein: "high", fibre: "moderate" },
    gradientFrom: "#3a0a1e",
    gradientTo: "#7a1540",
    dietitianPick: true,
    dietitianNote: "Lean complete protein · anti-inflammatory",
  },
  {
    id: "ms-11",
    name: "Miso Black Cod",
    emoji: "🐡",
    origin: "Nobu, Tokyo",
    description:
      "Sake-and-white-miso marinated cod broiled to a lacquered finish. With pickled daikon, silky edamame purée, and yuzu zest.",
    foods: [
      "black cod fillet",
      "white miso",
      "sake",
      "mirin",
      "pickled daikon",
      "edamame purée",
      "yuzu",
    ],
    mealType: "dinner",
    macros: { carbs: "low", protein: "high", fibre: "moderate" },
    gradientFrom: "#0c1829",
    gradientTo: "#1a3550",
    dietitianPick: true,
    dietitianNote: "Nobu's signature · exceptional omega-3",
  },
  {
    id: "ms-12",
    name: "Dukkah Lamb Backstrap",
    emoji: "🥩",
    origin: "Middle Eastern",
    description:
      "Pistachio-hazelnut dukkah-crusted backstrap cooked blush-pink, resting on roasted capsicum coulis with tahini and pomegranate.",
    foods: [
      "lamb backstrap",
      "pistachio dukkah",
      "hazelnut",
      "roasted capsicum",
      "tahini",
      "pomegranate seeds",
    ],
    mealType: "dinner",
    macros: { carbs: "low", protein: "high", fibre: "moderate" },
    gradientFrom: "#1a1000",
    gradientTo: "#4a3000",
    dietitianPick: false,
  },
];
