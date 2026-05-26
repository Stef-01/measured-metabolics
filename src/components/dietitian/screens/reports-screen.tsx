"use client";

import Link from "next/link";
import {
  FileText,
  Send,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Minus,
} from "lucide-react";
import { PATIENTS, GP_PROFILES, CURRENT_DIETITIAN_ID } from "@/lib/mock";
import { cn } from "@/lib/utils/cn";

type StatStatus = "good" | "watch" | "high";

function StatChip({
  label,
  value,
  status,
  lowerBetter,
}: {
  label: string;
  value: string;
  status: StatStatus;
  lowerBetter?: boolean;
}) {
  const TrendIcon =
    status === "good"
      ? lowerBetter
        ? TrendingDown
        : TrendingUp
      : status === "watch"
        ? Minus
        : lowerBetter
          ? TrendingUp
          : TrendingDown;

  const tone: Record<StatStatus, string> = {
    good: "bg-[var(--measured-green)]/8 text-[var(--measured-dark-green)]",
    watch:
      "bg-[var(--measured-clinical-amber)]/15 text-[var(--measured-clinical-amber)]",
    high: "bg-[var(--measured-evaluate)]/10 text-[var(--measured-evaluate)]",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        tone[status],
      )}
    >
      <TrendIcon size={10} strokeWidth={2.5} aria-hidden="true" />
      <span>
        {label} {value}
      </span>
    </div>
  );
}

export function DietitianReportsScreen() {
  const myPatients = PATIENTS.filter(
    (p) => p.assignedDietitianId === CURRENT_DIETITIAN_ID,
  );

  return (
    <div className="mx-auto max-w-5xl">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
          Reports
        </div>
        <h1 className="mt-1 font-serif text-[34px] leading-tight tracking-tight text-[var(--measured-dark)]">
          GP report builder
        </h1>
        <p className="mt-1 text-[14px] text-[var(--measured-subtext)]">
          Pick a patient to draft a report. AI prefills the summary; you edit
          and send.
        </p>
      </div>

      <ul className="mt-6 grid gap-3 md:grid-cols-2">
        {myPatients.map((p) => {
          const gp = GP_PROFILES[p.referringGpId];
          const hbA1cStatus: StatStatus =
            p.hbA1cPct < 7 ? "good" : p.hbA1cPct < 8 ? "watch" : "high";
          const tirStatus: StatStatus =
            p.timeInRangePct >= 70
              ? "good"
              : p.timeInRangePct >= 55
                ? "watch"
                : "high";
          const wtStatus: StatStatus =
            p.weightDeltaKg < 0
              ? "good"
              : p.weightDeltaKg < 1
                ? "watch"
                : "high";
          return (
            <li key={p.id}>
              <Link
                href={`/d/patients/${p.id}`}
                className="group block rounded-2xl border border-[var(--measured-border-soft)] bg-white p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-raised)]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]">
                    <FileText size={18} strokeWidth={2} aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[15px] font-semibold text-[var(--measured-dark)]">
                        {p.firstName} {p.lastName}
                      </div>
                      <ArrowRight
                        size={14}
                        strokeWidth={2.2}
                        className="shrink-0 text-[var(--measured-subtext)] transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="text-[12px] text-[var(--measured-subtext)]">
                      Week {p.weekNumber} · {gp ? gp.name : p.referringGpId}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <StatChip
                        label="HbA1c"
                        value={`${p.hbA1cPct}%`}
                        status={hbA1cStatus}
                        lowerBetter
                      />
                      <StatChip
                        label="TIR"
                        value={`${p.timeInRangePct}%`}
                        status={tirStatus}
                      />
                      <StatChip
                        label="Wt Δ"
                        value={`${p.weightDeltaKg > 0 ? "+" : ""}${p.weightDeltaKg.toFixed(1)} kg`}
                        status={wtStatus}
                        lowerBetter
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--measured-green)]/8 px-3 py-1 text-[11px] font-semibold text-[var(--measured-dark-green)]">
                  <Send size={11} strokeWidth={2.2} aria-hidden="true" />
                  Open report builder
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-[12px] text-[var(--measured-subtext)]">
        Each &ldquo;Send to GP&rdquo; emits an immutable record to the audit
        log.
      </p>
    </div>
  );
}
