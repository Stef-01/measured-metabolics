import { inngest } from "@/inngest/client";
import { recordAudit } from "@/server/audit";

/**
 * Stage 6 — fan-out notifications worker.
 *
 * Listens for `notification.dispatch` events and (in production) calls
 * Resend / Twilio. Stage 6 vibe: log + audit only. Stage 7 wires actual
 * delivery + suppression for marketing-consent-withdrawn patients.
 */
export const notifications = inngest.createFunction(
  { id: "notifications", retries: 2, triggers: [{ event: "notification.dispatch" }] },
  async ({ event, step }) => {
    const { kind, patient_id, payload } = event.data as Record<string, string>;
    await step.run("audit", () =>
      recordAudit({
        action: "record.created",
        actorRole: "dietitian",
        targetType: "notification",
        patientId: patient_id ?? null,
        meta: {
          kind,
          payload_preview:
            typeof payload === "string" ? payload.slice(0, 80) : null,
        },
      }),
    );
    return { kind, patient_id };
  },
);
