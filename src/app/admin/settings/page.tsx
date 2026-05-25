import { isSupabaseConfigured } from "@/lib/supabase/env";

const FLAG_META: Record<string, { label: string; hint: string }> = {
  supabase: { label: "Supabase", hint: "Auth, database, storage" },
  posthog: { label: "PostHog", hint: "Product analytics" },
  sentry: { label: "Sentry", hint: "Error monitoring" },
  openai: { label: "OpenAI", hint: "Meal analysis & plan drafts" },
  anthropic: { label: "Anthropic", hint: "Report generation" },
  inngest: { label: "Inngest", hint: "Background jobs & workflows" },
  pilot: { label: "Pilot live", hint: "Real-patient cohort gate" },
};

export default function AdminSettingsPage() {
  const flags: Record<string, boolean> = {
    supabase: isSupabaseConfigured(),
    posthog: Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY),
    sentry: Boolean(process.env.SENTRY_DSN),
    openai: Boolean(process.env.OPENAI_API_KEY),
    anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
    inngest: Boolean(process.env.INNGEST_EVENT_KEY),
    pilot: process.env.NEXT_PUBLIC_PILOT_LIVE === "true",
  };
  const configuredCount = Object.values(flags).filter(Boolean).length;
  return (
    <div className="max-w-lg">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
        Configuration
      </p>
      <h1 className="mt-1 font-serif text-[34px] leading-tight tracking-tight text-[var(--measured-dark)]">
        Platform settings
      </h1>
      <p className="mt-1 text-[13px] text-[var(--measured-subtext)]">
        Env-driven flags that gate Stage 5–8 features. {configuredCount}/{Object.keys(flags).length} configured.
      </p>
      <ul className="mt-6 space-y-2">
        {Object.entries(flags).map(([k, v]) => {
          const meta = FLAG_META[k] ?? { label: k, hint: "" };
          return (
            <li
              key={k}
              className="flex items-center gap-3 rounded-2xl border border-[var(--measured-border-soft)] bg-[var(--measured-card)] px-4 py-3 shadow-[var(--shadow-card)]"
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${
                  v ? "bg-[var(--measured-green)]" : "bg-[var(--measured-border)]"
                }`}
              />
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-[var(--measured-dark)]">
                  {meta.label}
                </div>
                {meta.hint && (
                  <div className="text-[12px] text-[var(--measured-subtext)]">
                    {meta.hint}
                  </div>
                )}
              </div>
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                  v
                    ? "bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]"
                    : "bg-[var(--measured-cream)] text-[var(--measured-subtext)]"
                }`}
              >
                {v ? "configured" : "not set"}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
