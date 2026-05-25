"use client";

import Link from "next/link";
import { FileText, Send, ArrowRight } from "lucide-react";
import { PATIENTS, GP_PROFILES, CURRENT_DIETITIAN_ID } from "@/lib/mock";

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
          return (
            <li key={p.id}>
              <Link
                href={`/d/patients/${p.id}`}
                className="group block rounded-2xl border border-[var(--measured-border-soft)] bg-white p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-raised)]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]">
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
                        className="text-[var(--measured-subtext)] transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="text-[12px] text-[var(--measured-subtext)]">
                      Week {p.weekNumber} · {gp ? gp.name : p.referringGpId}
                    </div>
                    <p className="mt-2 text-[13px] leading-relaxed text-[var(--measured-dark)]">
                      Latest summary draft is ready. {p.timeInRangePct}% TIR ·
                      weight Δ {p.weightDeltaKg > 0 ? "+" : ""}
                      {p.weightDeltaKg.toFixed(1)} kg.
                    </p>
                  </div>
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--measured-cream)] px-3 py-1 text-[11px] font-semibold text-[var(--measured-dark-green)]">
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
