import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function AdminSettingsPage() {
  const flags = {
    supabase: isSupabaseConfigured(),
    posthog: Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY),
    sentry: Boolean(process.env.SENTRY_DSN),
    openai: Boolean(process.env.OPENAI_API_KEY),
    anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
    inngest: Boolean(process.env.INNGEST_EVENT_KEY),
    pilot: process.env.NEXT_PUBLIC_PILOT_LIVE === "true",
  };
  return (
    <div>
      <h1 className="font-serif text-[34px] leading-tight tracking-tight text-[var(--measured-dark)]">
        Platform settings
      </h1>
      <p className="mt-1 text-[13px] text-[var(--measured-subtext)]">
        Surfaces the env-driven flags that gate Stage 5–8 features.
      </p>
      <ul className="mt-6 space-y-2">
        {Object.entries(flags).map(([k, v]) => (
          <li
            key={k}
            className="flex items-center justify-between rounded-2xl border border-[var(--measured-border)] bg-[var(--measured-card)] px-4 py-3"
          >
            <span className="text-[14px] text-[var(--measured-text)]">{k}</span>
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
        ))}
      </ul>
    </div>
  );
}
