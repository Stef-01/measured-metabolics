import { inngest } from "@/inngest/client";
import { runStructured, LLMUnconfiguredError } from "@/ai/provider";
import { applySafety, buildUnreviewedFallback } from "@/ai/safety";
import { recordAudit } from "@/server/audit";

export const transcriptAnalyzer = inngest.createFunction(
  { id: "transcript-analyzer", retries: 2, triggers: [{ event: "transcript.pasted" }] },
  async ({ event, step }) => {
    const {
      patient_id,
      transcript,
      context = "n/a",
    } = event.data as Record<string, string>;

    const ai = await step.run("call-transcript", async () => {
      try {
        const parsed = await runStructured({
          schemaName: "transcript-analysis",
          variables: { transcript, context },
        });
        return applySafety("transcript-analysis", parsed);
      } catch (err) {
        if (err instanceof LLMUnconfiguredError) {
          return buildUnreviewedFallback(
            "transcript-analysis",
            "provider_unconfigured",
          );
        }
        return buildUnreviewedFallback(
          "transcript-analysis",
          "schema_violation",
        );
      }
    });

    await step.run("audit", () =>
      recordAudit({
        action: "record.created",
        actorRole: "gp",
        targetType: "transcript",
        targetId: null,
        patientId: patient_id ?? null,
        meta: {
          schema: "transcript-analysis",
          requires_human_review: ai.requires_human_review,
          safety_flags: ai.safety_flags,
        },
      }),
    );

    return { patient_id, requires_human_review: ai.requires_human_review };
  },
);
