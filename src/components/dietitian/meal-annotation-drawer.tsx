"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Send, Trash2, X, Sparkles } from "lucide-react";
import { mealImageBySlug } from "@/lib/images";
import { patientStore, type MealAnnotation } from "@/lib/storage/patient-store";
import type { MealLog } from "@/lib/mock/types";
import { toast } from "@/lib/hooks/use-toast";

interface Props {
  open: boolean;
  meal: MealLog | null;
  patientId: string;
  patientFirstName: string;
  dietitianName: string;
  existing?: MealAnnotation;
  onClose: () => void;
}

const SUGGESTIONS = [
  "Try swapping rice for cauliflower rice next time — it kept your peak under 1.5 mmol/L last week.",
  "This was a great choice — pattern is much steadier than your dinners last fortnight.",
  "If a similar meal causes another spike, message me and we'll adjust.",
];

/**
 * Modal-style drawer where the dietitian writes feedback against a single
 * meal. Saves to the patient localStorage namespace so the patient home +
 * metrics surfaces pick it up via `useStoredAnnotations`.
 */
export function MealAnnotationDrawer({
  open,
  meal,
  patientId,
  patientFirstName,
  dietitianName,
  existing,
  onClose,
}: Props) {
  return (
    <AnimatePresence>
      {open && meal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="w-full max-w-lg overflow-hidden rounded-t-3xl bg-white shadow-[var(--shadow-raised)] sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Annotate ${meal.mealType}`}
          >
            <DrawerForm
              key={`${meal.id}-${existing?.id ?? "new"}`}
              meal={meal}
              patientId={patientId}
              patientFirstName={patientFirstName}
              dietitianName={dietitianName}
              existing={existing}
              onClose={onClose}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface FormProps {
  meal: MealLog;
  patientId: string;
  patientFirstName: string;
  dietitianName: string;
  existing?: MealAnnotation;
  onClose: () => void;
}

/**
 * Inner form is keyed by meal id + annotation id, so React unmounts and
 * remounts it when the dietitian opens a different meal — that's how we
 * reset the local state without setting state inside an effect.
 */
function DrawerForm({
  meal,
  patientId,
  patientFirstName,
  dietitianName,
  existing,
  onClose,
}: FormProps) {
  const [body, setBody] = useState(existing?.body ?? "");
  const [recommendation, setRecommendation] = useState(
    existing?.recommendation ?? "",
  );
  const slug = meal.analysis.foods[0]?.name?.toLowerCase() ?? "";

  const save = () => {
    const trimmed = body.trim();
    if (!trimmed) return;
    patientStore.upsertAnnotation(patientId, {
      id: existing?.id ?? `ann-${meal.id}-${Date.now()}`,
      mealId: meal.id,
      patientId,
      fromDietitianName: dietitianName,
      body: trimmed,
      recommendation: recommendation.trim() || undefined,
      createdAt: new Date().toISOString(),
    });
    toast.push({
      variant: "success",
      title: `Note sent to ${patientFirstName}`,
      body: "It will appear on their dashboard immediately.",
      duration: 2200,
    });
    onClose();
  };

  const remove = () => {
    if (!existing) return;
    patientStore.removeAnnotation(patientId, existing.id);
    toast.push({
      variant: "info",
      title: "Note removed",
      duration: 1500,
    });
    onClose();
  };

  return (
    <>
      <header className="relative h-[180px] w-full">
        <Image
          src={mealImageBySlug(slug)}
          alt={meal.analysis.dietitianSummary}
          fill
          sizes="(max-width: 640px) 100vw, 512px"
          className="object-cover"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[var(--measured-dark)] hover:bg-white"
        >
          <X size={16} strokeWidth={2.2} />
        </button>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pt-8 pb-3 text-white">
          <div className="text-[10px] font-semibold uppercase tracking-wider opacity-90">
            {meal.mealType} ·{" "}
            {new Date(meal.eatenAt).toLocaleString([], {
              weekday: "short",
              hour: "numeric",
              minute: "2-digit",
            })}
          </div>
          <h3 className="mt-0.5 font-serif text-[22px] leading-tight">
            {meal.analysis.foods
              .slice(0, 3)
              .map((f) => f.name)
              .join(" + ")}
          </h3>
          <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold backdrop-blur">
            Peak Δ {meal.analysis.cgmPeakDeltaMmol?.toFixed(1) ?? "?"} mmol/L
            {meal.analysis.cgmPeakAtMin
              ? ` · +${meal.analysis.cgmPeakAtMin} min`
              : ""}
          </div>
        </div>
      </header>

      <div className="space-y-3 p-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-clinical-blue)]">
          <Pencil size={11} strokeWidth={2.4} aria-hidden="true" />
          Note for {patientFirstName}
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder={`What should ${patientFirstName} know about this meal?`}
          className="w-full resize-none rounded-2xl border border-[var(--measured-border)] bg-[var(--measured-cream)] p-3 text-[13px] leading-relaxed text-[var(--measured-dark)] placeholder:text-[var(--measured-subtext)] focus:border-[var(--measured-green)] focus:outline-none"
        />
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-dark-green)]">
          <Sparkles size={11} strokeWidth={2.4} aria-hidden="true" />
          Concrete swap (optional)
        </div>
        <input
          type="text"
          value={recommendation}
          onChange={(e) => setRecommendation(e.target.value)}
          placeholder="e.g. Swap basmati rice for ½ cauliflower rice"
          className="w-full rounded-xl border border-[var(--measured-border)] bg-white px-3 py-2 text-[13px] text-[var(--measured-dark)] placeholder:text-[var(--measured-subtext)] focus:border-[var(--measured-green)] focus:outline-none"
        />

        <div className="flex flex-wrap gap-1.5 pt-1">
          {SUGGESTIONS.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setBody(s)}
              className="rounded-full bg-[var(--measured-cream)] px-2.5 py-1 text-[11px] text-[var(--measured-subtext)] hover:bg-[var(--measured-green)]/10 hover:text-[var(--measured-dark-green)]"
            >
              {s.length > 60 ? `${s.slice(0, 58)}…` : s}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 pt-2">
          {existing ? (
            <button
              type="button"
              onClick={remove}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--measured-evaluate)] hover:underline"
            >
              <Trash2 size={12} strokeWidth={2.2} aria-hidden="true" />
              Remove note
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={save}
            disabled={!body.trim()}
            className="inline-flex items-center gap-2 rounded-2xl bg-[var(--measured-green)] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[var(--measured-dark-green)] disabled:cursor-not-allowed disabled:bg-[var(--measured-cream)] disabled:text-[var(--measured-subtext)]"
          >
            <Send size={14} strokeWidth={2.2} aria-hidden="true" />
            {existing ? "Update note" : `Send to ${patientFirstName}`}
          </button>
        </div>
      </div>
    </>
  );
}
