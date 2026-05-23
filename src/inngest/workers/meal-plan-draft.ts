import { inngest } from "@/inngest/client";
import { runStructured, LLMUnconfiguredError } from "@/ai/provider";
import { applySafety, buildUnreviewedFallback } from "@/ai/safety";
import { recordAudit } from "@/server/audit";

export const mealPlanDraft = inngest.createFunction(
  { id: "meal-plan-draft", retries: 2, triggers: [{ event: "meal_plan.requested" }] },
  async ({ event, step }) => {
    const {
      patient_id,
      cuisine = "other",
      allergies = "none",
      cgm = "n/a",
      patient_summary = "n/a",
    } = event.data as Record<string, string>;

    const ai = await step.run("call-plan-draft", async () => {
      try {
        const parsed = await runStructured({
          schemaName: "meal-plan-draft",
          variables: { patient_summary, cuisine, allergies, cgm },
        });
        return applySafety("meal-plan-draft", parsed);
      } catch (err) {
        if (err instanceof LLMUnconfiguredError) {
          return buildUnreviewedFallback(
            "meal-plan-draft",
            "provider_unconfigured",
          );
        }
        return buildUnreviewedFallback("meal-plan-draft", "schema_violation");
      }
    });

    await step.run("audit", () =>
      recordAudit({
        action: "plan.drafted",
        actorRole: "dietitian",
        targetType: "meal_plan",
        patientId: patient_id ?? null,
        meta: {
          requires_human_review: ai.requires_human_review,
          safety_flags: ai.safety_flags,
        },
      }),
    );

    return { patient_id, requires_human_review: ai.requires_human_review };
  },
);
