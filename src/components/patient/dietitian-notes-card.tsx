"use client";

import { useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import { mealImageBySlug } from "@/lib/images";
import {
  patientStore,
  useStoredAnnotations,
  useStoredMeals,
  type MealAnnotation,
} from "@/lib/storage/patient-store";
import type { MealLog } from "@/lib/mock/types";

interface Props {
  patientId: string;
}

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
      <header className="border-b border-[var(--measured-border-soft)] px-4 py-3">
        <div className="text-[13px] font-semibold text-[var(--measured-dark)]">
          Notes from your dietitian
        </div>
      </header>

      <ul className="divide-y divide-[var(--measured-border-soft)]">
        <AnimatePresence initial={false}>
          {visible.map((ann) => {
            const meal = mealsById.get(ann.mealId);
            return (
              <motion.li
                key={ann.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18 }}
              >
                <NoteItem ann={ann} meal={meal} patientId={patientId} />
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </section>
  );
}

function NoteItem({
  ann,
  meal,
  patientId,
}: {
  ann: MealAnnotation;
  meal: MealLog | undefined;
  patientId: string;
}) {
  const slug = meal?.analysis.foods[0]?.name?.toLowerCase() ?? "";
  const peak = meal?.analysis.cgmPeakDeltaMmol;
  const hasPins = ann.points && ann.points.length > 0;

  return (
    <div className="px-4 py-3">
      {hasPins && meal ? (
        /* Annotated layout — wide image with pins, text below */
        <div>
          <div className="relative h-[180px] w-full overflow-hidden rounded-xl bg-[var(--measured-cream)]">
            <Image
              src={mealImageBySlug(slug)}
              alt={meal.analysis.dietitianSummary}
              fill
              sizes="(max-width: 480px) 100vw, 448px"
              className="object-cover"
            />
            {ann.points!.map((pin, i) => (
              <div
                key={pin.id}
                className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 select-none items-center justify-center rounded-full bg-[var(--measured-clinical-blue)] text-[10px] font-bold text-white shadow-[var(--shadow-raised)] ring-2 ring-white"
                style={{ left: `${pin.x * 100}%`, top: `${pin.y * 100}%` }}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Pin note list */}
          {ann.points!.some((p) => p.note.trim()) && (
            <div className="mt-2 space-y-1">
              {ann.points!.map((pin, i) =>
                pin.note.trim() ? (
                  <div key={pin.id} className="flex items-start gap-1.5">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--measured-clinical-blue)] text-[9px] font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-[12px] leading-relaxed text-[var(--measured-subtext)]">
                      {pin.note}
                    </span>
                  </div>
                ) : null,
              )}
            </div>
          )}

          <NoteBody ann={ann} meal={meal} peak={peak} patientId={patientId} />
        </div>
      ) : (
        /* Standard layout — thumbnail + text side by side */
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
            <NoteBody ann={ann} meal={meal} peak={peak} patientId={patientId} />
          </div>
        </div>
      )}
    </div>
  );
}

function NoteBody({
  ann,
  meal,
  peak,
  patientId,
}: {
  ann: MealAnnotation;
  meal: MealLog | undefined;
  peak: number | undefined;
  patientId: string;
}) {
  return (
    <>
      <div className="text-[11px] text-[var(--measured-subtext)]">
        {meal
          ? `${meal.mealType} · ${new Date(meal.eatenAt).toLocaleString([], {
              weekday: "short",
              hour: "numeric",
            })}`
          : "Meal note"}
        {peak !== undefined && (
          <span className="tnum ml-1 text-[var(--measured-evaluate)]">
            · peak Δ {peak.toFixed(1)} mmol/L
          </span>
        )}
      </div>
      {ann.body && (
        <p className="mt-0.5 text-[14px] leading-relaxed text-[var(--measured-dark)]">
          {ann.body}
        </p>
      )}
      {ann.recommendation && (
        <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[var(--measured-green)]/10 px-2 py-0.5 text-[11px] font-semibold text-[var(--measured-dark-green)]">
          <Sparkles size={10} strokeWidth={2.4} aria-hidden="true" />
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
          onClick={() => patientStore.acknowledgeAnnotation(patientId, ann.id)}
          className="inline-flex items-center gap-1 rounded-full border border-[var(--measured-border)] bg-white px-2.5 py-1 text-[11px] font-semibold text-[var(--measured-dark-green)] hover:bg-[var(--measured-cream)]"
        >
          <CheckCircle2 size={11} strokeWidth={2.2} aria-hidden="true" />
          Got it
        </button>
      </div>
    </>
  );
}
