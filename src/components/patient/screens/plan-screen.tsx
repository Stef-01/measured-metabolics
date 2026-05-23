"use client";

import Link from "next/link";
import { CheckCheck, ChevronRight } from "lucide-react";
import { PatientAppHeader } from "@/components/patient/app-header";
import { ASHA_PLAN, RECIPES } from "@/lib/mock";
import type { MealType } from "@/lib/mock/types";

const MEAL_LABEL: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

const MEAL_EMOJI: Record<MealType, string> = {
  breakfast: "🥣",
  lunch: "🍲",
  dinner: "🍛",
  snack: "🥜",
};

export function PatientPlanScreen() {
  const approvedAt = ASHA_PLAN.approvedByDietitianAt
    ? new Date(ASHA_PLAN.approvedByDietitianAt).toLocaleDateString()
    : null;

  return (
    <>
      <PatientAppHeader
        eyebrow={approvedAt ? `Approved ${approvedAt}` : "Draft"}
        title="Today's plan"
      />

      <div className="mx-auto flex max-w-md flex-col gap-3 px-5 pt-3 pb-8">
        <div className="rounded-2xl border border-[var(--measured-green)]/20 bg-[var(--measured-green)]/5 px-4 py-3">
          <div className="flex items-center gap-2 text-[13px] font-medium text-[var(--measured-dark-green)]">
            <CheckCheck size={16} strokeWidth={2.2} aria-hidden="true" />
            Plan approved by Maya Singh, APD
          </div>
          <p className="mt-1 text-[12px] leading-relaxed text-[var(--measured-subtext)]">
            Tap any meal to open the recipe and a one-line rationale.
          </p>
        </div>

        {ASHA_PLAN.items.map((item) => {
          const recipe = RECIPES.find((r) =>
            r.title
              .toLowerCase()
              .startsWith(item.title.split(" ")[0].toLowerCase()),
          );
          return (
            <Link
              key={item.mealType + item.title}
              href={recipe ? `/p/plan/${recipe.id}` : "/p/plan"}
              className="group block rounded-2xl border border-[var(--measured-border-soft)] bg-white p-4 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-raised)]"
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--measured-cream)] text-[24px]"
                  aria-hidden="true"
                >
                  {MEAL_EMOJI[item.mealType]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
                      {MEAL_LABEL[item.mealType]}
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-[var(--measured-subtext)] transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-0.5 text-[15px] font-semibold text-[var(--measured-dark)]">
                    {item.title}
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-[var(--measured-subtext)]">
                    {item.description}
                  </p>
                  {item.rationale && (
                    <p className="mt-2 rounded-lg bg-[var(--measured-cream)] px-3 py-2 text-[12px] italic leading-relaxed text-[var(--measured-dark)]">
                      Why: {item.rationale}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
