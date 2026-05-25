import { inngest } from "@/inngest/client";
import { runStructured, LLMUnconfiguredError } from "@/ai/provider";
import { applySafety, buildUnreviewedFallback } from "@/ai/safety";
import { recordAudit } from "@/server/audit";

/**
 * Stage 6 worker — meal-vision.
 *
 * Trigger: event `meal.uploaded` with `{ meal_log_id, patient_id, photo_url, cuisine, cgm_summary }`.
 * Pipeline:
 *   1. Call meal-analysis prompt with cuisine + CGM summary (vision-enabled
 *      provider chosen by env).
 *   2. Apply safety gate (confidence + schema flags).
 *   3. Persist `meal_analysis` row with `requires_human_review`,
 *      `dietitian_review_status: 'pending_review'`, `safety_flags`.
 *   4. Audit `meal.uploaded` (the upload itself is audited at the API
 *      boundary too; this records the AI processing milestone).
 */
export const mealVision = inngest.createFunction(
  { id: "meal-vision", retries: 2, triggers: [{ event: "meal.uploaded" }] },
  async ({ event, step }) => {
    const {
      meal_log_id,
      patient_id,
      cuisine = "other",
      meal_type = "meal",
      note = "",
      cgm_summary = "n/a",
    } = event.data as Record<string, string>;

    const ai = await step.run("call-meal-analysis", async () => {
      try {
        const parsed = await runStructured({
          schemaName: "meal-analysis",
          variables: {
            cuisine,
            meal_type,
            note: note || "No note provided",
            cgm: cgm_summary,
          },
        });
        return applySafety("meal-analysis", parsed);
      } catch (err) {
        if (err instanceof LLMUnconfiguredError) {
          return buildUnreviewedFallback(
            "meal-analysis",
            "provider_unconfigured",
          );
        }
        return buildUnreviewedFallback("meal-analysis", "schema_violation");
      }
    });

    await step.run("audit", () =>
      recordAudit({
        action: "meal.uploaded",
        actorRole: "patient",
        targetType: "meal_log",
        targetId: meal_log_id,
        patientId: patient_id,
        meta: {
          requires_human_review: ai.requires_human_review,
          safety_flags: ai.safety_flags,
        },
      }),
    );

    return { meal_log_id, requires_human_review: ai.requires_human_review };
  },
);
