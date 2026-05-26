"use client";

import { CheckCircle2, ExternalLink, Receipt, FileChartColumn, TrendingDown, TrendingUp, Utensils, Activity } from "lucide-react";
import Link from "next/link";
import type { Patient } from "@/lib/mock/types";
import { mealsForPatient } from "@/lib/mock/meals";
import { symptomsForPatient } from "@/lib/mock/symptoms";
import { cn } from "@/lib/utils/cn";

export function GpReportCard({ patient }: { patient: Patient }) {
  const mealCount = mealsForPatient(patient.id).length;
  const symptomCount = symptomsForPatient(patient.id).length;

  const stats = [
    {
      label: "Meals",
      value: String(mealCount),
      Icon: Utensils,
      tone: "green" as const,
    },
    {
      label: "TIR",
      value: `${patient.timeInRangePct}%`,
      Icon: Activity,
      tone: patient.timeInRangePct >= 70 ? ("green" as const) : ("amber" as const),
    },
    {
      label: "Weight",
      value: `${patient.weightDeltaKg > 0 ? "+" : ""}${patient.weightDeltaKg.toFixed(1)} kg`,
      Icon: patient.weightDeltaKg < 0 ? TrendingDown : TrendingUp,
      tone: patient.weightDeltaKg < 0 ? ("green" as const) : ("amber" as const),
    },
    {
      label: "Symptoms",
      value: String(symptomCount),
      Icon: Activity,
      tone: symptomCount === 0 ? ("green" as const) : ("amber" as const),
    },
  ];

  const toneClasses = {
    green: {
      bg: "bg-[var(--measured-green)]/8 ring-[var(--measured-green)]/20",
      icon: "text-[var(--measured-dark-green)]",
      value: "text-[var(--measured-dark)]",
    },
    amber: {
      bg: "bg-[var(--measured-clinical-amber)]/8 ring-[var(--measured-clinical-amber)]/25",
      icon: "text-[var(--measured-clinical-amber)]",
      value: "text-[var(--measured-dark)]",
    },
  };

  const recommendations = [
    "Continue current dose; reinforce dinner-rice substitution.",
    "Repeat HbA1c in 6 weeks.",
    "Refer to exercise physiologist if BP remains elevated.",
  ];

  return (
    <div className="space-y-3">
      {/* Stat mini tiles */}
      <div className="grid grid-cols-4 gap-1.5">
        {stats.map((s) => {
          const tone = toneClasses[s.tone];
          return (
            <div
              key={s.label}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl p-2 text-center ring-1",
                tone.bg,
              )}
            >
              <s.Icon size={12} strokeWidth={2.2} className={tone.icon} aria-hidden="true" />
              <div className="font-serif text-[16px] leading-tight text-[var(--measured-dark)]">
                {s.value}
              </div>
              <div className="text-[9px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
                {s.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* 30-second narrative */}
      <div className="rounded-xl border border-[var(--measured-border-soft)] bg-[var(--measured-green)]/5 p-3">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-dark-green)]">
          <FileChartColumn size={11} strokeWidth={2.2} aria-hidden="true" />
          30-second read
        </div>
        <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--measured-dark)]">
          Over 4 weeks, {patient.firstName} uploaded {mealCount} meals, logged{" "}
          {symptomCount} symptom check-ins, and held {patient.timeInRangePct}%
          time-in-range. Weight{" "}
          {patient.weightDeltaKg < 0 ? "down" : "up"}{" "}
          {Math.abs(patient.weightDeltaKg).toFixed(1)} kg.{" "}
          {patient.alerts.length > 0
            ? `Open alerts: ${patient.alerts.join(", ").toLowerCase()}.`
            : "No open alerts."}
        </p>
      </div>

      {/* Recommendations */}
      <section className="rounded-xl border border-[var(--measured-border-soft)] bg-white p-3">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
          Recommendations from Maya
        </div>
        <ul className="space-y-2">
          {recommendations.map((rec) => (
            <li key={rec} className="flex items-start gap-2">
              <CheckCircle2
                size={13}
                strokeWidth={2.2}
                className="mt-0.5 shrink-0 text-[var(--measured-dark-green)]"
                aria-hidden="true"
              />
              <span className="text-[12px] leading-relaxed text-[var(--measured-dark)]">
                {rec}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--measured-border)] bg-white px-2 py-2.5 text-[12px] font-semibold text-[var(--measured-dark)] hover:bg-[var(--measured-cream)] transition-colors"
        >
          <ExternalLink size={12} strokeWidth={2.2} aria-hidden="true" />
          Open PDF
        </button>
        <Link
          href={`/gp/${patient.id}/billing`}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--measured-green)] px-2 py-2.5 text-[12px] font-semibold text-white hover:bg-[var(--measured-dark-green)] transition-colors"
        >
          <Receipt size={12} strokeWidth={2.2} aria-hidden="true" />
          To billing
        </Link>
      </div>
    </div>
  );
}
