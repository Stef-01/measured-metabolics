import { inngest } from "@/inngest/client";
import { runStructured, LLMUnconfiguredError } from "@/ai/provider";
import { applySafety } from "@/ai/safety";
import { BillingSuggestionSchema, type BillingSuggestion } from "@/ai/schemas";
import { recordAudit } from "@/server/audit";
import {
  formatBillingPromptVariables,
  runBillingDeepDive,
} from "@/lib/engine/billing-deep-dive";
import type { BillingScanContext } from "@/lib/engine/billing-needs-scanner";

/**
 * Phase 4 (Feature #11) — billing-intelligence worker.
 *
 * Trigger: event `billing.scan.requested` with the patient context the GP
 * surface already has client-side. The contract:
 *
 * ```ts
 * inngest.send({
 *   name: "billing.scan.requested",
 *   data: { patient_id: string, context: BillingScanContext }
 * })
 * ```
 *
 * Pipeline mirrors the other Stage 6 workers (`meal-vision`, `transcript-analyzer`):
 *   1. Build prompt variables from the supplied context.
 *   2. Call `runStructured("billing-intelligence", variables)`.
 *   3. On `LLMUnconfiguredError`, build a schema-valid output via the
 *      deterministic `runBillingDeepDive` simulator so the GP demo never
 *      returns nothing while still tripping `requires_human_review`.
 *   4. On schema violation, return an empty suggestion batch flagged for
 *      review with `safety_flags: ['schema_violation']`.
 *   5. Apply safety gate, audit `billing.scan.invoked` and
 *      `billing.suggestion.generated`, then return a summary.
 */
export const billingIntelligence = inngest.createFunction(
  {
    id: "billing-intelligence",
    retries: 2,
    triggers: [{ event: "billing.scan.requested" }],
  },
  async ({ event, step }) => {
    const { patient_id, context } = event.data as {
      patient_id?: string;
      context: BillingScanContext;
    };

    const result = await step.run("call-billing-intelligence", async () => {
      try {
        const parsed = await runStructured({
          schemaName: "billing-intelligence",
          variables: formatBillingPromptVariables(context),
        });
        return applySafety("billing-intelligence", parsed);
      } catch (err) {
        if (err instanceof LLMUnconfiguredError) {
          const fallback = runBillingDeepDive(context);
          const safety = applySafety("billing-intelligence", fallback);
          return {
            ...safety,
            safety_flags: Array.from(
              new Set([...safety.safety_flags, "provider_unconfigured"]),
            ),
            requires_human_review: true,
          };
        }
        const empty: BillingSuggestion = BillingSuggestionSchema.parse({
          suggestions: [],
          confidence_score: 0,
          requires_human_review: true,
          safety_flags: ["schema_violation"],
        });
        return {
          output: empty,
          requires_human_review: true,
          safety_flags: ["schema_violation"],
          visible_to_patient: false,
        };
      }
    });

    await step.run("audit-scan", () =>
      recordAudit({
        action: "billing.scan.invoked",
        actorRole: "gp",
        targetType: "patient",
        targetId: patient_id ?? null,
        patientId: patient_id ?? null,
        meta: {
          schema: "billing-intelligence",
          requires_human_review: result.requires_human_review,
          safety_flags: result.safety_flags,
        },
      }),
    );

    const output = result.output as BillingSuggestion;
    await step.run("audit-suggestions", () =>
      recordAudit({
        action: "billing.suggestion.generated",
        actorRole: "gp",
        targetType: "patient",
        targetId: patient_id ?? null,
        patientId: patient_id ?? null,
        meta: {
          schema: "billing-intelligence",
          suggestion_count: output.suggestions.length,
          item_numbers: output.suggestions.map((s) => s.itemNumber),
          requires_human_review: result.requires_human_review,
          safety_flags: result.safety_flags,
        },
      }),
    );

    return {
      patient_id: patient_id ?? null,
      suggestion_count: output.suggestions.length,
      requires_human_review: result.requires_human_review,
    };
  },
);
