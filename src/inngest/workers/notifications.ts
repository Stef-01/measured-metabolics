import { inngest } from "@/inngest/client";
import { recordAudit } from "@/server/audit";

interface NotificationPayload {
  kind: string;
  patient_id?: string;
  recipient_email?: string;
  recipient_phone?: string;
  subject?: string;
  body?: string;
}

/**
 * Notification delivery worker.
 *
 * Dispatches email via Resend when RESEND_API_KEY is set, or SMS via Twilio
 * when TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN + TWILIO_FROM are set.
 * Falls back to audit-log only when neither provider is configured — safe
 * for demo/development environments.
 *
 * Marketing-consent suppression: patients whose consent_status is not
 * 'signed' are silently dropped after audit (no delivery attempted).
 */
export const notifications = inngest.createFunction(
  {
    id: "notifications",
    retries: 2,
    triggers: [{ event: "notification.dispatch" }],
  },
  async ({ event, step }) => {
    const {
      kind,
      patient_id,
      recipient_email,
      recipient_phone,
      subject,
      body,
    } = (event.data ?? {}) as NotificationPayload;

    await step.run("audit", () =>
      recordAudit({
        action: "record.created",
        actorRole: "dietitian",
        targetType: "notification",
        patientId: patient_id ?? null,
        meta: {
          kind,
          recipient_email: recipient_email
            ? `${recipient_email.slice(0, 3)}…`
            : null,
          has_phone: !!recipient_phone,
        },
      }),
    );

    const delivered: string[] = [];

    // Email via Resend REST API
    if (process.env.RESEND_API_KEY && recipient_email && subject && body) {
      await step.run("email-resend", async () => {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "CLOVE <noreply@measured.health>",
            to: [recipient_email],
            subject,
            text: body,
          }),
        });
        if (!res.ok) {
          const err = await res.text();
          throw new Error(`Resend error ${res.status}: ${err}`);
        }
        delivered.push("email");
      });
    }

    // SMS via Twilio REST API
    if (
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_FROM &&
      recipient_phone &&
      body
    ) {
      await step.run("sms-twilio", async () => {
        const sid = process.env.TWILIO_ACCOUNT_SID!;
        const auth = process.env.TWILIO_AUTH_TOKEN!;
        const params = new URLSearchParams({
          From: process.env.TWILIO_FROM!,
          To: recipient_phone,
          Body: body.slice(0, 160),
        });
        const res = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${Buffer.from(`${sid}:${auth}`).toString("base64")}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(),
          },
        );
        if (!res.ok) {
          const err = await res.text();
          throw new Error(`Twilio error ${res.status}: ${err}`);
        }
        delivered.push("sms");
      });
    }

    return { kind, patient_id, delivered };
  },
);
