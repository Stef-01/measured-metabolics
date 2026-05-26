import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  CheckCircle2,
  Circle,
  Database,
  BarChart3,
  Bug,
  Brain,
  Zap,
  FlaskConical,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const FLAG_META: Record<
  string,
  {
    label: string;
    hint: string;
    Icon: React.ComponentType<{
      size?: number;
      strokeWidth?: number;
      className?: string;
      "aria-hidden"?: "true";
    }>;
  }
> = {
  supabase: {
    label: "Supabase",
    hint: "Auth, database, storage",
    Icon: Database,
  },
  posthog: { label: "PostHog", hint: "Product analytics", Icon: BarChart3 },
  sentry: { label: "Sentry", hint: "Error monitoring", Icon: Bug },
  openai: { label: "OpenAI", hint: "Meal analysis & plan drafts", Icon: Brain },
  anthropic: { label: "Anthropic", hint: "Report generation", Icon: Brain },
  inngest: { label: "Inngest", hint: "Background jobs & workflows", Icon: Zap },
  pilot: { label: "Pilot live", hint: "Real-patient cohort gate", Icon: Users },
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
  const total = Object.keys(flags).length;
  const allGreen = configuredCount === total;
  const pct = Math.round((configuredCount / total) * 100);

  return (
    <div className="max-w-lg">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
        Configuration
      </p>
      <h1 className="mt-1 font-serif text-[34px] leading-tight tracking-tight text-[var(--measured-dark)]">
        Platform settings
      </h1>
      <p className="mt-1 text-[13px] text-[var(--measured-subtext)]">
        Env-driven flags that gate Stage 5–8 features.
      </p>

      {/* System health summary */}
      <div
        className={cn(
          "mt-6 rounded-2xl border p-4 shadow-[var(--shadow-card)]",
          allGreen
            ? "border-[var(--measured-green)]/25 bg-[var(--measured-green)]/5"
            : "border-[var(--measured-clinical-amber)]/30 bg-[var(--measured-clinical-amber)]/5",
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <div
              className={cn(
                "text-[10px] font-semibold uppercase tracking-wider",
                allGreen
                  ? "text-[var(--measured-dark-green)]"
                  : "text-[var(--measured-clinical-amber)]",
              )}
            >
              System health
            </div>
            <div className="mt-0.5 font-serif text-[28px] leading-none text-[var(--measured-dark)]">
              {configuredCount}
              <span className="text-[18px] text-[var(--measured-subtext)]">
                /{total}
              </span>
            </div>
            <div className="mt-0.5 text-[12px] text-[var(--measured-subtext)]">
              {pct}% of integrations configured
            </div>
          </div>
          <FlaskConical
            size={36}
            strokeWidth={1.5}
            className={
              allGreen
                ? "text-[var(--measured-green)]"
                : "text-[var(--measured-clinical-amber)]"
            }
            aria-hidden="true"
          />
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/60">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              allGreen
                ? "bg-[var(--measured-green)]"
                : "bg-[var(--measured-clinical-amber)]",
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {Object.entries(flags).map(([k, v]) => {
          const meta = FLAG_META[k] ?? { label: k, hint: "", Icon: Circle };
          const { Icon } = meta;
          return (
            <li
              key={k}
              className="flex items-center gap-3 rounded-2xl border border-[var(--measured-border-soft)] bg-[var(--measured-card)] px-4 py-3 shadow-[var(--shadow-card)]"
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                  v
                    ? "bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]"
                    : "bg-[var(--measured-cream)] text-[var(--measured-subtext)]",
                )}
              >
                <Icon size={14} strokeWidth={2.2} aria-hidden="true" />
              </div>
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
              {v ? (
                <CheckCircle2
                  size={16}
                  strokeWidth={2.2}
                  className="shrink-0 text-[var(--measured-dark-green)]"
                  aria-hidden="true"
                />
              ) : (
                <span className="rounded-full bg-[var(--measured-cream)] px-3 py-1 text-[11px] font-semibold text-[var(--measured-subtext)]">
                  not set
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
