"use client";

import { useState } from "react";
import { Plus, Trash2, FileDown } from "lucide-react";
import type { Patient } from "@/lib/mock/types";
import { toast } from "@/lib/hooks/use-toast";

interface DraftSection {
  key: "problems" | "goals" | "team";
  label: string;
  add: string;
}

const SECTIONS: DraftSection[] = [
  { key: "problems", label: "Problems", add: "Add problem" },
  { key: "goals", label: "Goals", add: "Add goal" },
  { key: "team", label: "Team", add: "Add team member" },
];

const COMMON_PROBLEMS: Record<string, string[]> = {
  "Type 2 diabetes": ["T2DM with elevated HbA1c", "Weight management"],
  Prediabetes: ["Prediabetes with insulin resistance"],
  Hypertension: ["Hypertension stage 1"],
  PCOS: ["PCOS with metabolic features"],
  Obesity: ["BMI ≥30 with metabolic risk"],
};

export function GpCarePlanCard({ patient }: { patient: Patient }) {
  const [problems, setProblems] = useState<string[]>(
    patient.conditions.flatMap((c) => COMMON_PROBLEMS[c] ?? [c]),
  );
  const [goals, setGoals] = useState<string[]>([
    `HbA1c < 7% within 6 months`,
    `Maintain current weight or reduce ${Math.max(2, Math.round(patient.weightKg * 0.05))} kg`,
  ]);
  const [team, setTeam] = useState<string[]>([
    "GP — Dr Lee",
    "Dietitian — Maya Singh, APD",
  ]);
  const [reviewDate, setReviewDate] = useState<string>(() =>
    new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
  );
  const [exported, setExported] = useState(false);

  const stateFor: Record<
    DraftSection["key"],
    [string[], (next: string[]) => void]
  > = {
    problems: [problems, setProblems],
    goals: [goals, setGoals],
    team: [team, setTeam],
  };

  const exportPlan = () => {
    setExported(true);
    toast.push({
      variant: "success",
      title: "Care plan exported",
      duration: 2000,
    });
    setTimeout(() => setExported(false), 2400);
  };

  return (
    <div className="space-y-3">
      {SECTIONS.map((s) => {
        const [items, setItems] = stateFor[s.key];
        return (
          <section
            key={s.key}
            className="rounded-xl border border-[var(--measured-border-soft)] bg-white p-3"
          >
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
                {s.label}
              </div>
              <button
                type="button"
                onClick={() => setItems([...items, ""])}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--measured-dark-green)]"
              >
                <Plus size={12} strokeWidth={2.4} aria-hidden="true" />
                {s.add}
              </button>
            </div>
            <ul className="mt-2 space-y-1.5 text-[12px]">
              {items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      setItems(
                        items.map((it, i) => (i === idx ? e.target.value : it)),
                      )
                    }
                    className="flex-1 rounded-md border border-transparent bg-[var(--measured-cream)] px-2 py-1 focus:border-[var(--measured-green)] focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setItems(items.filter((_, i) => i !== idx))}
                    aria-label={`Remove ${s.label} item`}
                    className="text-[var(--measured-subtext)] hover:text-[var(--measured-evaluate)]"
                  >
                    <Trash2 size={12} strokeWidth={2} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <label className="block rounded-xl border border-[var(--measured-border-soft)] bg-white p-3 text-[12px]">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
          Review date
        </span>
        <input
          type="date"
          value={reviewDate}
          onChange={(e) => setReviewDate(e.target.value)}
          className="mt-1 w-full rounded-md bg-[var(--measured-cream)] px-2 py-1 focus:bg-white focus:outline-none"
        />
      </label>

      <button
        type="button"
        onClick={exportPlan}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--measured-green)] px-3 py-2.5 text-[13px] font-semibold text-white hover:bg-[var(--measured-dark-green)]"
      >
        <FileDown size={14} strokeWidth={2.2} aria-hidden="true" />
        {exported ? "Exporting…" : "Export care plan"}
      </button>
    </div>
  );
}
