import { AlertTriangle } from "lucide-react";
import type { Patient } from "@/lib/mock/types";
import { recentSevereSymptoms } from "@/lib/mock/symptoms";
import { cn } from "@/lib/utils/cn";

export function GpContextCard({ patient }: { patient: Patient }) {
  const severe = recentSevereSymptoms().filter(
    (s) => s.patientId === patient.id,
  );
  const tiles = [
    {
      label: "HbA1c",
      value: `${patient.hbA1cPct}%`,
      trend:
        patient.hbA1cPct < 7 ? "good" : patient.hbA1cPct < 8 ? "watch" : "high",
    },
    {
      label: "Weight Δ",
      value: `${patient.weightDeltaKg > 0 ? "+" : ""}${patient.weightDeltaKg.toFixed(1)} kg`,
      trend: patient.weightDeltaKg < 0 ? "good" : "watch",
    },
    {
      label: "TIR",
      value: `${patient.timeInRangePct}%`,
      trend:
        patient.timeInRangePct >= 80
          ? "good"
          : patient.timeInRangePct >= 70
            ? "watch"
            : "high",
    },
  ] as const;

  return (
    <div className="space-y-4">
      {severe.length > 0 && (
        <div className="rounded-xl border border-[var(--measured-evaluate)]/30 bg-[var(--measured-evaluate)]/5 p-3 text-[12px]">
          <div className="flex items-center gap-1.5 font-semibold text-[var(--measured-evaluate)]">
            <AlertTriangle size={12} strokeWidth={2.2} aria-hidden="true" />
            Severe symptoms reported recently
          </div>
          <p className="mt-1 leading-relaxed text-[var(--measured-dark)]">
            Last logged{" "}
            {new Date(severe[0].loggedAt).toLocaleString([], {
              weekday: "short",
              hour: "numeric",
            })}
            . Worth flagging in the consult.
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {tiles.map((t) => (
          <div
            key={t.label}
            className={cn(
              "rounded-xl bg-white p-3 text-center shadow-[var(--shadow-card)] ring-1",
              t.trend === "good"
                ? "ring-[var(--measured-green)]/30"
                : t.trend === "watch"
                  ? "ring-[var(--measured-clinical-amber)]/40"
                  : "ring-[var(--measured-evaluate)]/30",
            )}
          >
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
              {t.label}
            </div>
            <div className="mt-1 font-serif text-[20px] leading-tight text-[var(--measured-dark)]">
              {t.value}
            </div>
          </div>
        ))}
      </div>

      <section>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
          Pattern summary
        </div>
        <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-[var(--measured-dark)]">
          {patient.patternSummary.map((s) => (
            <li key={s} className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--measured-green)]" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl bg-[var(--measured-cream)] p-3 text-[12px] leading-relaxed text-[var(--measured-dark)]">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
          Meds
        </div>
        <div className="mt-1">
          {patient.meds.length > 0 ? patient.meds.join(", ") : "Nil regular"}
        </div>
      </section>
    </div>
  );
}
