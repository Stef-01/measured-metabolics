"use client";

import { ExternalLink, Receipt, FileChartColumn } from "lucide-react";
import Link from "next/link";
import type { Patient } from "@/lib/mock/types";
import { mealsForPatient } from "@/lib/mock/meals";
import { symptomsForPatient } from "@/lib/mock/symptoms";

export function GpReportCard({ patient }: { patient: Patient }) {
  const mealCount = mealsForPatient(patient.id).length;
  const symptomCount = symptomsForPatient(patient.id).length;

  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-[var(--measured-green)]/5 p-3">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-dark-green)]">
          <FileChartColumn size={12} strokeWidth={2.2} aria-hidden="true" />
          30-second read
        </div>
        <p className="mt-1 text-[13px] leading-relaxed text-[var(--measured-dark)]">
          Over 4 weeks, {patient.firstName} uploaded {mealCount} meals, logged{" "}
          {symptomCount} symptom check-ins, and held {patient.timeInRangePct}%
          time-in-range. Weight {patient.weightDeltaKg < 0 ? "down" : "up"}{" "}
          {Math.abs(patient.weightDeltaKg).toFixed(1)} kg.{" "}
          {patient.alerts.length > 0
            ? `Open alerts: ${patient.alerts.join(", ").toLowerCase()}.`
            : "No open alerts."}
        </p>
      </div>

      <section>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
          Recommendations from Maya
        </div>
        <ul className="mt-1 space-y-1 text-[13px] leading-relaxed text-[var(--measured-dark)]">
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--measured-green)]" />
            <span>
              Continue current dose; reinforce dinner-rice substitution.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--measured-green)]" />
            <span>Repeat HbA1c in 6 weeks.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--measured-green)]" />
            <span>Refer to exercise physiologist if BP remains elevated.</span>
          </li>
        </ul>
      </section>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-1 rounded-xl border border-[var(--measured-border)] bg-white px-2 py-2 text-[12px] font-semibold text-[var(--measured-dark)]"
        >
          <ExternalLink size={12} strokeWidth={2.2} aria-hidden="true" />
          Open PDF
        </button>
        <Link
          href={`/gp/${patient.id}/billing`}
          className="inline-flex items-center justify-center gap-1 rounded-xl bg-[var(--measured-green)] px-2 py-2 text-[12px] font-semibold text-white"
        >
          <Receipt size={12} strokeWidth={2.2} aria-hidden="true" />
          To billing
        </Link>
      </div>
    </div>
  );
}
