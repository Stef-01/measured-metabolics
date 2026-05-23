/**
 * Stage 8 — PostHog event registry (PRD §7.12, §8.13, §9.12).
 *
 * Every product event flows through `track()` so the registry below is the
 * single source of truth. Adding a new call site MUST update this list — the
 * Stage 8 launch checklist enforces parity (see docs/LAUNCH-CHECKLIST.md).
 */

export const EVENTS = [
  // Patient PWA — PRD §7.12
  "patient.signed_in",
  "patient.consent_granted",
  "patient.consent_withdrawn",
  "patient.meal_capture_started",
  "patient.meal_saved",
  "patient.meal_viewed_after_review",
  "patient.symptom_logged",
  "patient.symptom_escalated",
  "patient.plan_viewed",
  "patient.recipe_viewed",
  "patient.recipe_saved",
  "patient.message_sent",
  "patient.privacy_changed",

  // Dietitian — PRD §8.13
  "dietitian.signed_in",
  "dietitian.referral_accepted",
  "dietitian.meal_approved",
  "dietitian.meal_edited",
  "dietitian.meal_flagged",
  "dietitian.message_sent",
  "dietitian.plan_drafted",
  "dietitian.plan_approved",
  "dietitian.report_drafted",
  "dietitian.report_sent",

  // GP — PRD §9.12
  "gp.signed_in",
  "gp.transcript_pasted",
  "gp.referral_created",
  "gp.care_plan_drafted",
  "gp.care_plan_copied",
  "gp.report_opened",
  "gp.billing_copied",
] as const;

export type AnalyticsEvent = (typeof EVENTS)[number];

let posthogMod: typeof import("posthog-js") | null = null;
async function getPosthog() {
  if (typeof window === "undefined") return null;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return null;
  if (posthogMod) return posthogMod.default;
  posthogMod = await import("posthog-js");
  posthogMod.default.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: true,
  });
  return posthogMod.default;
}

export async function track(
  event: AnalyticsEvent,
  properties?: Record<string, unknown>,
): Promise<void> {
  const ph = await getPosthog();
  if (!ph) return;
  ph.capture(event, properties);
}
