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
  if (slug.includes("poha")) return MEAL.poha;
  if (slug.includes("fish") || slug.includes("tandoori"))
    return MEAL.southAsian;
  if (slug.includes("noodle") || slug.includes("asian")) return MEAL.asian;
  if (slug.includes("salad") || slug.includes("bowl")) return MEAL.salad;
  if (slug.includes("toast") || slug.includes("avocado")) return MEAL.toast;
  if (slug.includes("fruit") || slug.includes("berry")) return MEAL.fruit;
  return MEAL.greens;
}
