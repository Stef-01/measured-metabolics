"use client";

import { useState } from "react";
import { Receipt, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { toast } from "@/lib/hooks/use-toast";
import type { Patient } from "@/lib/mock/types";

interface MbsHint {
  item: string;
  description: string;
  rationale: string;
  needs: string[];
  confidence: number;
  matches: (p: Patient) => boolean;
}

const HINTS: MbsHint[] = [
  {
    item: "MBS 721",
    description: "GP Management Plan (GPMP)",
    rationale: "Multi-condition chronic disease; ≥6 months management.",
    needs: ["Patient consent", "≥1 follow-up scheduled"],
    confidence: 0.86,
    matches: (p) => p.conditions.length >= 2,
  },
  {
    item: "MBS 723",
    description: "Team Care Arrangement (TCA)",
    rationale: "Coordinates with allied health (dietitian, exercise).",
    needs: ["GPMP completed (721)", "≥2 contributing providers"],
    confidence: 0.78,
    matches: () => true,
  },
  {
    item: "MBS 10954",
    description: "Allied health visit (dietitian)",
    rationale: "Patient referred to dietitian under chronic disease plan.",
    needs: ["TCA in place"],
    confidence: 0.72,
    matches: () => true,
  },
  {
    item: "MBS 2700",
    description: "Mental Health Care Plan (MHCP)",
    rationale: "Mood / wellbeing review may be relevant for new diabetes Dx.",
    needs: ["K10 score", "Patient agreement"],
    confidence: 0.45,
    matches: (p) => p.weekNumber <= 4,
  },
];

export function GpBillingCard({ patient }: { patient: Patient }) {
  const items = HINTS.filter((h) => h.matches(patient));
  const [expanded, setExpanded] = useState<string | null>(
    items[0]?.item ?? null,
  );

  const copy = (h: MbsHint) => {
    const text = `${h.item} ${h.description} — ${h.rationale}`;
    void navigator.clipboard?.writeText(text);
    toast.push({
      variant: "info",
      title: `${h.item} copied`,
      duration: 1400,
    });
  };

  return (
    <div className="space-y-3">
      <p className="text-[12px] leading-relaxed text-[var(--measured-subtext)]">
        Eligibility hints. Never auto-claimed; you decide what to bill.
      </p>
      <ul className="space-y-2">
        {items.map((h) => {
          const isOpen = expanded === h.item;
          return (
            <li
              key={h.item}
              className="rounded-xl border border-[var(--measured-border-soft)] bg-white text-[12px]"
            >
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : h.item)}
                className="flex w-full items-start justify-between gap-3 px-3 py-2.5 text-left"
                aria-expanded={isOpen}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-[var(--measured-green)]/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--measured-dark-green)]">
                      {h.item}
                    </span>
                    <span className="font-semibold text-[var(--measured-dark)]">
                      {h.description}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[var(--measured-subtext)]">
                    {Math.round(h.confidence * 100)}% confidence · {h.rationale}
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp
                    size={14}
                    className="text-[var(--measured-subtext)]"
                    aria-hidden="true"
                  />
                ) : (
                  <ChevronDown
                    size={14}
                    className="text-[var(--measured-subtext)]"
                    aria-hidden="true"
                  />
                )}
              </button>
              {isOpen && (
                <div className="border-t border-[var(--measured-border-soft)] px-3 py-2.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
                    Still needs
                  </div>
                  <ul className="mt-1 space-y-0.5">
                    {h.needs.map((n) => (
                      <li key={n} className="text-[var(--measured-dark)]">
                        · {n}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => copy(h)}
                    className={cn(
                      "mt-2 inline-flex items-center gap-1 rounded-lg bg-[var(--measured-green)]/10 px-2.5 py-1 text-[11px] font-semibold text-[var(--measured-dark-green)]",
                    )}
                  >
                    <Receipt size={12} strokeWidth={2.2} aria-hidden="true" />
                    Copy item
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="text-[11px] text-[var(--measured-subtext)]">
        Stage 8 emits an audit row each time an item is copied.
      </p>
    </div>
  );
}
