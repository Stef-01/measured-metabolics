import type { z } from "zod";
import { SCHEMAS, type SchemaName } from "./schemas";

/**
 * Stage 6 — Safety gate (PRD §15.2).
 *
 * Workers run their AI output through `applySafety()` *after* Zod parsing.
 * The rules:
 *   - confidence_score < 0.7  → requires_human_review = true
 *   - schema validation failed → safety_flags includes 'schema_violation'
 *   - any rule below also forces requires_human_review = true
 *
 * The patient app NEVER displays an output whose dietitian_review_status is
 * not 'approved', so requires_human_review effectively hides the draft.
 */

export const CONFIDENCE_THRESHOLD = 0.7;

export interface SafetyResult<T> {
  output: T;
  requires_human_review: boolean;
  safety_flags: string[];
  visible_to_patient: boolean;
}

export function applySafety<TName extends SchemaName>(
  schemaName: TName,
  parsed: z.infer<(typeof SCHEMAS)[TName]>,
): SafetyResult<z.infer<(typeof SCHEMAS)[TName]>> {
  const flags = new Set<string>(
    Array.isArray((parsed as { safety_flags?: string[] }).safety_flags)
      ? ((parsed as { safety_flags?: string[] }).safety_flags ?? [])
      : [],
  );
  const confidence =
    (parsed as { confidence_score?: number }).confidence_score ?? 0;
  let requires =
    Boolean(
      (parsed as { requires_human_review?: boolean }).requires_human_review,
    ) || confidence < CONFIDENCE_THRESHOLD;
  if (flags.has("schema_violation")) requires = true;
  if (flags.has("provider_unconfigured")) requires = true;
  if (schemaName === "meal-plan-draft") requires = true; // PRD: dietitian must approve plans
  if (schemaName === "dietitian-report-draft") requires = true;
  if (schemaName === "billing-intelligence") requires = true; // Feature #11: GP must verify before billing
  if (schemaName === "soap-draft") requires = true; // GP must verify before adding to clinical record
  return {
    output: parsed,
    requires_human_review: requires,
    safety_flags: Array.from(flags),
    visible_to_patient: false, // approved status set explicitly later by reviewer
  };
}

export function buildUnreviewedFallback<TName extends SchemaName>(
  schemaName: TName,
  reason: "provider_unconfigured" | "schema_violation",
): SafetyResult<unknown> {
  return {
    output: { schemaName, reason } as unknown,
    requires_human_review: true,
    safety_flags: [reason],
    visible_to_patient: false,
  };
}
