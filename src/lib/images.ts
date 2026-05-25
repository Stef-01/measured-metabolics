/**
 * Curated photography registry. All paths are public/images/* served at
 * the matching `/images/...` URL by Next. See public/images/ATTRIBUTION.md.
 *
 * Use the `mealImageFor()` helper so cuisine-tagged meals consistently
 * resolve to a matching photo without scattering literal paths through
 * the codebase.
 */

import type { Cuisine } from "@/types/db";

export const HERO = {
  kitchen: "/images/hero/kitchen-counter.jpg",
  dietitian: "/images/hero/dietitian-consult.jpg",
  phone: "/images/hero/phone-in-hand.jpg",
  gradient: "/images/hero/soft-gradient.jpg",
} as const;

export const MEAL = {
  southAsian: "/images/meals/south-asian-curry.jpg",
  poha: "/images/meals/poha-grain-bowl.jpg",
  asian: "/images/meals/asian-noodle-bowl.jpg",
  mediterranean: "/images/meals/mediterranean-bowl.jpg",
  salad: "/images/meals/fresh-salad-bowl.jpg",
  greens: "/images/meals/fresh-greens.jpg",
  toast: "/images/meals/avocado-toast.jpg",
  fruit: "/images/meals/fruit-breakfast.jpg",
} as const;

export function mealImageFor(
  cuisine: Cuisine | string | null | undefined,
): string {
  switch (cuisine) {
    case "south_asian":
      return MEAL.southAsian;
    case "east_asian":
      return MEAL.asian;
    case "mediterranean":
      return MEAL.mediterranean;
    case "middle_eastern":
      return MEAL.mediterranean;
    case "european":
      return MEAL.toast;
    default:
      return MEAL.salad;
  }
}

export function mealImageBySlug(slug: string | null | undefined): string {
  if (!slug) return MEAL.salad;
  const s = slug.toLowerCase();

  // South Asian / Indian subcontinent (specific dishes first)
  if (s.includes("poha") || s.includes("khichdi") || s.includes("upma")) return MEAL.poha;
  if (s.includes("biryani") || s.includes("pulao") || s.includes("pilaf")) return MEAL.southAsian;
  if (s.includes("tandoori") || s.includes("tikka") || s.includes("korma")) return MEAL.southAsian;
  if (s.includes("curry") || s.includes("masala") || s.includes("saag")) return MEAL.southAsian;
  if (s.includes("dal") || s.includes("dhal") || s.includes("lentil") || s.includes("chana")) return MEAL.southAsian;
  if (s.includes("samosa") || s.includes("pakora") || s.includes("chaat") || s.includes("bhaji")) return MEAL.southAsian;
  if (s.includes("paneer") || s.includes("rajma") || s.includes("aloo") || s.includes("gobhi")) return MEAL.southAsian;
  if (s.includes("roti") || s.includes("chapati") || s.includes("paratha") || s.includes("naan")) return MEAL.southAsian;
  if (s.includes("dosa") || s.includes("idli") || s.includes("palak") || s.includes("basmati")) return MEAL.southAsian;
  if (s.includes("fish") || s.includes("prawn") || s.includes("shrimp")) return MEAL.southAsian;

  // East Asian / Southeast Asian
  if (s.includes("ramen") || s.includes("udon") || s.includes("soba") || s.includes("pho")) return MEAL.asian;
  if (s.includes("noodle") || s.includes("pad thai") || s.includes("laksa")) return MEAL.asian;
  if (s.includes("stir fry") || s.includes("stir-fry") || s.includes("fried rice") || s.includes("wok")) return MEAL.asian;
  if (s.includes("sushi") || s.includes("dumpling") || s.includes("dim sum") || s.includes("bao")) return MEAL.asian;
  if (s.includes("miso") || s.includes("teriyaki") || s.includes("edamame") || s.includes("tofu")) return MEAL.asian;
  if (s.includes("spring roll") || s.includes("lo mein") || s.includes("vermicelli")) return MEAL.asian;
  if (s.includes("bibimbap") || s.includes("kimchi") || s.includes("bulgogi")) return MEAL.asian;

  // Mediterranean / Middle Eastern
  if (s.includes("falafel") || s.includes("hummus") || s.includes("tzatziki")) return MEAL.mediterranean;
  if (s.includes("shawarma") || s.includes("doner") || s.includes("kebab") || s.includes("kofta")) return MEAL.mediterranean;
  if (s.includes("tabouleh") || s.includes("couscous") || s.includes("pita")) return MEAL.mediterranean;
  if (s.includes("greek") && (s.includes("salad") || s.includes("bowl") || s.includes("chicken"))) return MEAL.mediterranean;

  // Salads & composed bowls
  if (s.includes("salad")) return MEAL.salad;
  if (s.includes("caesar") || s.includes("niçoise") || s.includes("nicoise") || s.includes("cobb")) return MEAL.salad;
  if (s.includes("bowl") && (s.includes("buddha") || s.includes("poke") || s.includes("grain"))) return MEAL.salad;

  // Eggs / toast / sandwiches (savoury handheld)
  if (s.includes("avocado")) return MEAL.toast;
  if (s.includes("toast") || s.includes("bruschetta") || s.includes("crostini")) return MEAL.toast;
  if (s.includes("omelette") || s.includes("omelet") || s.includes("frittata") || s.includes("scrambled")) return MEAL.toast;
  if (s.includes("egg") && !s.includes("noodle")) return MEAL.toast;
  if (s.includes("sandwich") || s.includes("wrap") || s.includes("burrito") || s.includes("quesadilla")) return MEAL.toast;
  if (s.includes("croissant") || s.includes("bagel") || s.includes("baguette") || s.includes("flatbread")) return MEAL.toast;
  if (s.includes("taco") || s.includes("pizza")) return MEAL.toast;

  // Sweet / fruit breakfast
  if (s.includes("smoothie") || s.includes("acai") || s.includes("açaí")) return MEAL.fruit;
  if (s.includes("oatmeal") || s.includes("porridge") || s.includes("oats")) return MEAL.fruit;
  if (s.includes("granola") || s.includes("muesli") || s.includes("parfait")) return MEAL.fruit;
  if (s.includes("yogurt") || s.includes("yoghurt")) return MEAL.fruit;
  if (s.includes("pancake") || s.includes("waffle") || s.includes("crepe")) return MEAL.fruit;
  if (s.includes("fruit") || s.includes("berry") || s.includes("berries")) return MEAL.fruit;
  if (s.includes("banana") || s.includes("apple") || s.includes("mango") || s.includes("melon")) return MEAL.fruit;

  // Soups, stews, pasta, greens, proteins
  if (s.includes("soup") || s.includes("stew") || s.includes("broth") || s.includes("chowder")) return MEAL.greens;
  if (s.includes("pasta") || s.includes("spaghetti") || s.includes("lasagna") || s.includes("penne")) return MEAL.greens;
  if (s.includes("broccoli") || s.includes("spinach") || s.includes("kale") || s.includes("asparagus")) return MEAL.greens;
  if (s.includes("roasted") || s.includes("steamed") || s.includes("grilled")) return MEAL.greens;
  if (s.includes("chicken") || s.includes("turkey") || s.includes("salmon") || s.includes("tuna")) return MEAL.greens;

  return MEAL.salad;
}
