"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { PatientAppHeader } from "@/components/patient/app-header";
import { useStoredMeals } from "@/lib/storage/patient-store";
import { CURRENT_PATIENT_ID } from "@/lib/mock";

const MEAL_LABEL: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

export function PatientMealSavedScreen() {
  const params = useSearchParams();
  const id = params.get("id");
  const meals = useStoredMeals(CURRENT_PATIENT_ID);
  const meal = meals.find((m) => m.id === id);

  return (
    <>
      <PatientAppHeader eyebrow="Saved" title="Got it." />

      <div className="mx-auto flex max-w-md flex-col gap-5 px-5 pt-8 pb-8 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 18 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]"
        >
          <CheckCircle2 size={48} strokeWidth={1.6} aria-hidden="true" />
        </motion.div>

        <div>
          <h2 className="font-serif text-[26px] leading-tight text-[var(--measured-dark)]">
            Meal logged
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--measured-subtext)]">
            {meal
              ? `${MEAL_LABEL[meal.mealType] ?? meal.mealType} sent for review. Maya will check it shortly.`
              : "Your meal is saved. Maya will review it shortly."}
          </p>
        </div>

        {meal && meal.analysis.confidence > 0 && (
          <div className="w-full rounded-2xl border border-[var(--measured-border)] bg-white px-4 py-3 text-left">
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-dark-green)]">
              AI first read
            </div>
            <p className="text-[13px] leading-relaxed text-[var(--measured-dark)]">
              {meal.analysis.dietitianSummary}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                `Carbs ${meal.analysis.carbLoad}`,
                `Protein ${meal.analysis.proteinLoad}`,
                `Fat ${meal.analysis.fatLoad}`,
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--measured-cream)] px-2 py-0.5 text-[10px] font-semibold text-[var(--measured-subtext)]"
                >
                  {tag}
                </span>
              ))}
            </div>
            {meal.analysis.clinicalFlags.length > 0 && (
              <p className="mt-2 text-[11px] font-medium text-[var(--measured-clinical-amber)]">
                {meal.analysis.clinicalFlags.join(" · ")}
              </p>
            )}
            <p className="mt-2 text-[11px] text-[var(--measured-subtext)]">
              Maya reviews before this appears on your plan.
            </p>
          </div>
        )}

        <div className="mt-2 flex flex-col gap-2 text-[13px]">
          <Link
            href="/p/plan"
            className="cta-shadow inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--measured-green)] px-5 py-4 font-semibold text-white"
          >
            See today&apos;s plan
            <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
          </Link>
          <Link
            href="/p/home"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--measured-border)] bg-white px-5 py-3.5 font-semibold text-[var(--measured-dark)]"
          >
            Back to home
          </Link>
        </div>
      </div>
    </>
  );
}
