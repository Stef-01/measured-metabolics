import { AlertTriangle, TrendingDown, TrendingUp, Minus, Pill } from "lucide-react";
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
      lowerIsBetter: true,
    },
    {
      label: "Weight Δ",
      value: `${patient.weightDeltaKg > 0 ? "+" : ""}${patient.weightDeltaKg.toFixed(1)} kg`,
      trend: patient.weightDeltaKg < 0 ? "good" : "watch",
      lowerIsBetter: true,
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
      lowerIsBetter: false,
    },
  ] as const;

  return (
    <div className="space-y-4">
      {severe.length > 0 && (
        <div className="rounded-xl border border-[var(--measured-evaluate)]/30 bg-[var(--measured-evaluate)]/5 p-3 text-[12px]">
          <div className="flex items-center gap-1.5 font-semibold text-[var(--measured-evaluate)]">
            <AlertTriangle size={12} strokeWidth={2.2} aria-hidden="true" />
            Severe symptoms — flag in consult
          </div>
          <p className="mt-1 leading-relaxed text-[var(--measured-dark)]">
            Last logged{" "}
            {new Date(severe[0].loggedAt).toLocaleString([], {
              weekday: "short",
              hour: "numeric",
            })}
            .
          </p>
        </div>
      )}

      {/* Clinical stat tiles */}
      <div className="grid grid-cols-3 gap-2">
        {tiles.map((t) => {
          const TrendIcon =
            t.trend === "good"
              ? t.lowerIsBetter
                ? TrendingDown
                : TrendingUp
              : t.trend === "watch"
                ? Minus
                : t.lowerIsBetter
                  ? TrendingUp
                  : TrendingDown;
          const iconColor =
            t.trend === "good"
              ? "text-[var(--measured-dark-green)]"
              : t.trend === "watch"
                ? "text-[var(--measured-clinical-amber)]"
                : "text-[var(--measured-evaluate)]";
          return (
            <div
              key={t.label}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl bg-white p-3 text-center shadow-[var(--shadow-card)] ring-1",
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
              <div className="font-serif text-[20px] leading-tight text-[var(--measured-dark)]">
                {t.value}
              </div>
              <TrendIcon size={11} strokeWidth={2.4} className={iconColor} aria-hidden="true" />
            </div>
          );
        })}
      </div>

      {/* Pattern summary — each point as a scannable card */}
      <section>
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
          Clinical patterns
        </div>
        <ul className="space-y-1.5">
          {patient.patternSummary.map((s) => (
            <li
              key={s}
              className="rounded-r-xl border-l-2 border-[var(--measured-green)] bg-white px-3 py-2 text-[12px] leading-relaxed text-[var(--measured-dark)] shadow-[var(--shadow-card)]"
            >
              {s}
            </li>
          ))}
        </ul>
      </section>

      {/* Medications — pill chips */}
      <section className="rounded-xl border border-[var(--measured-border-soft)] bg-[var(--measured-cream)] p-3">
        <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
          <Pill size={10} strokeWidth={2.4} aria-hidden="true" />
          Medications
        </div>
        <div className="flex flex-wrap gap-1.5">
          {patient.meds.length > 0 ? (
            patient.meds.map((m) => (
              <span
                key={m}
                className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-[var(--measured-dark)] shadow-[var(--shadow-card)] ring-1 ring-[var(--measured-border-soft)]"
              >
                {m}
              </span>
            ))
          ) : (
            <span className="rounded-full bg-[var(--measured-green)]/10 px-2.5 py-1 text-[11px] font-medium text-[var(--measured-dark-green)]">
              Nil regular
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
