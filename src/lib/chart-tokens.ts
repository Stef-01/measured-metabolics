/**
 * Hex equivalents of semantic CSS tokens for use in Recharts / SVG contexts
 * where `var(--…)` cannot be resolved as an HTML attribute value.
 * Keep in sync with :root values in globals.css.
 */
export const CHART = {
  green: "#2d5a3d",    // --measured-green
  evaluate: "#8c1515", // --measured-evaluate
  clinical: "#2c5e8a", // --measured-clinical-blue
} as const;
