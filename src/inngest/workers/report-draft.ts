import { inngest } from "@/inngest/client";
import { runStructured, LLMUnconfiguredError } from "@/ai/provider";
import { applySafety, buildUnreviewedFallback } from "@/ai/safety";
import { recordAudit } from "@/server/audit";

export const reportDraft = inngest.createFunction(
  { id: "report-draft", retries: 2, triggers: [{ event: "report.requested" }] },
  async ({ event, step }) => {
    const {
      patient_id,
      period = "last 4 weeks",
      summary = "n/a",
      patient_summary = "n/a",
    } = event.data as Record<string, string>;

    const ai = await step.run("call-report-draft", async () => {
      try {
        const parsed = await runStructured({
          schemaName: "dietitian-report-draft",
          variables: { patient_summary, period, summary },
        });
        return applySafety("dietitian-report-draft", parsed);
      } catch (err) {
        if (err instanceof LLMUnconfiguredError) {
          return buildUnreviewedFallback(
            "dietitian-report-draft",
            "provider_unconfigured",
          );
        }
        return buildUnreviewedFallback(
          "dietitian-report-draft",
          "schema_violation",
        );
      }
    });

    await step.run("audit", () =>
      recordAudit({
        action: "report.drafted",
        actorRole: "dietitian",
        targetType: "dietitian_report",
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
