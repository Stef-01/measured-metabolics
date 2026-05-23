"use client";

import { useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, MessageSquare, Sparkles } from "lucide-react";
import { mealImageBySlug } from "@/lib/images";
import {
  patientStore,
  useStoredAnnotations,
  useStoredMeals,
} from "@/lib/storage/patient-store";
import type { MealLog } from "@/lib/mock/types";

interface Props {
  patientId: string;
}

/**
 * Patient-side feed of dietitian annotations attached to meals. Notes the
 * dietitian leaves by clicking a CGM spike on `/d/patients/[id]` show up here
 * within the next render. Patient can acknowledge ("Got it") to clear.
 */
export function DietitianNotesCard({ patientId }: Props) {
  const annotations = useStoredAnnotations(patientId);
  const meals = useStoredMeals(patientId);

  const mealsById = useMemo(() => {
    const map = new Map<string, MealLog>();
    for (const m of meals) map.set(m.id, m);
    return map;
  }, [meals]);

  const visible = annotations.filter((a) => !a.acknowledgedAt);

  if (visible.length === 0) return null;

  return (
    <section className="surface-card overflow-hidden p-0">
      <header className="flex items-center justify-between gap-2 border-b border-[var(--measured-border-soft)] bg-[var(--measured-clinical-blue)]/8 px-4 py-3">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-clinical-blue)]">
          <MessageSquare size={12} strokeWidth={2.4} aria-hidden="true" />
          New notes from your dietitian
        </div>
        <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-[var(--measured-clinical-blue)]">
          {visible.length}
        </span>
      </header>

      <ul className="divide-y divide-[var(--measured-border-soft)]">
        <AnimatePresence initial={false}>
          {visible.map((ann) => {
            const meal = mealsById.get(ann.mealId);
            const slug = meal?.analysis.foods[0]?.name?.toLowerCase() ?? "";
            const peak = meal?.analysis.cgmPeakDeltaMmol;
            return (
              <motion.li
                key={ann.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18 }}
                className="px-4 py-3"
              >
                <div className="flex gap-3">
                  {meal && (
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[var(--measured-cream)]">
                      <Image
                        src={mealImageBySlug(slug)}
                        alt={meal.analysis.dietitianSummary}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
                      {meal
                        ? `${meal.mealType} · ${new Date(
                            meal.eatenAt,
                          ).toLocaleString([], {
                            weekday: "short",
                            hour: "numeric",
                          })}`
                        : "Meal note"}
                      {peak !== undefined && (
                        <span className="ml-1 text-[var(--measured-evaluate)] normal-case">
                          · peak Δ {peak.toFixed(1)} mmol/L
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[14px] leading-relaxed text-[var(--measured-dark)]">
                      {ann.body}
                    </p>
                    {ann.recommendation && (
                      <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[var(--measured-green)]/10 px-2 py-0.5 text-[11px] font-semibold text-[var(--measured-dark-green)]">
                        <Sparkles
                          size={10}
                          strokeWidth={2.4}
                          aria-hidden="true"
                        />
                        Try: {ann.recommendation}
                      </div>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-[11px] text-[var(--measured-subtext)]">
                        {ann.fromDietitianName} ·{" "}
                        {new Date(ann.createdAt).toLocaleString([], {
                          weekday: "short",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          patientStore.acknowledgeAnnotation(patientId, ann.id)
                        }
                        className="inline-flex items-center gap-1 rounded-full border border-[var(--measured-border)] bg-white px-2.5 py-1 text-[11px] font-semibold text-[var(--measured-dark-green)] hover:bg-[var(--measured-cream)]"
                      >
                        <CheckCircle2
                          size={11}
                          strokeWidth={2.2}
                          aria-hidden="true"
                        />
                        Got it
                      </button>
                    </div>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </section>
  );
}
