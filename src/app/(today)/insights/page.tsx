"use client";

import { motion } from "framer-motion";
import { TrendingUp, Activity, Users } from "lucide-react";

const STATS = [
  {
    Icon: Users,
    label: "Active patients",
    value: "62",
    delta: "+4 this week",
    tone: "green" as const,
  },
  {
    Icon: TrendingUp,
    label: "Adherence (median)",
    value: "78%",
    delta: "+3pp vs last month",
    tone: "gold" as const,
  },
  {
    Icon: Activity,
    label: "Outcomes flagged",
    value: "9",
    delta: "2 need follow-up",
    tone: "warm" as const,
  },
];

const TONE: Record<"green" | "gold" | "warm", string> = {
  green: "bg-[var(--banksia-green)]/10 text-[var(--banksia-dark-green)]",
  gold: "bg-[var(--banksia-gold)]/15 text-[#7d6020]",
  warm: "bg-[var(--banksia-warm)]/12 text-[#aa4f1a]",
};

export default function InsightsPage() {
  return (
    <motion.div
      className="min-h-full bg-[var(--banksia-cream)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
    >
      <header className="app-header px-4 py-2.5">
        <div className="mx-auto max-w-md">
          <h1 className="font-serif text-lg font-semibold text-[var(--banksia-dark)]">
            Insights
          </h1>
          <p className="text-[11px] text-[var(--banksia-subtext)]">
            Population-level signal across your panel
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-4 px-4 pt-4 pb-8">
        <div className="grid gap-3">
          {STATS.map(({ Icon, label, value, delta, tone }) => (
            <div key={label} className="surface-card p-4">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${TONE[tone]}`}
                >
                  <Icon size={18} strokeWidth={1.9} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--banksia-subtext)]">
                    {label}
                  </p>
                  <p className="mt-0.5 font-serif text-2xl text-[var(--banksia-dark)]">
                    {value}
                  </p>
                  <p className="text-[11px] text-[var(--banksia-subtext)]">
                    {delta}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-[var(--banksia-border-soft)] bg-white p-5 text-center shadow-[var(--shadow-card)]">
          <p className="font-serif text-base font-semibold text-[var(--banksia-dark)]">
            Charts are coming soon
          </p>
          <p className="mt-1 text-xs text-[var(--banksia-subtext)]">
            Trend lines for weight, HbA1c, and adherence will live here, gated
            behind 30+ patients to keep the signal honest.
          </p>
        </div>
      </main>
    </motion.div>
  );
}
