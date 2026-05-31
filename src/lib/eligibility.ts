/**
 * Discovery-call eligibility — a metabolic-baseline pre-screen.
 *
 * BMI ≥ 27 reflects the standard clinical threshold for metabolic / GLP-1
 * weight-management programs. Deliberately kept here (not in the UI) and never
 * surfaced to the visitor, so the assessment funnel reads as profiling rather
 * than a visible pass/fail gate. Height/weight are used transiently in the
 * browser to compute this and are never sent to the server or stored.
 */
export const ELIGIBLE_BMI = 27;

/** Body-mass index from metric height (cm) + weight (kg). 0 when height ≤ 0. */
export function computeBmi(heightCm: number, weightKg: number): number {
  if (heightCm <= 0) return 0;
  const metres = heightCm / 100;
  return weightKg / (metres * metres);
}

/** True when the visitor meets the metabolic-baseline threshold for a call. */
export function isDiscoveryEligible(
  heightCm: number,
  weightKg: number,
): boolean {
  return computeBmi(heightCm, weightKg) >= ELIGIBLE_BMI;
}
