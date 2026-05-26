"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Pencil, Send, Sparkles, Trash2, X } from "lucide-react";
import { mealImageBySlug } from "@/lib/images";
import {
  patientStore,
  type MealAnnotation,
  type PointAnnotation,
} from "@/lib/storage/patient-store";
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
            className="flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-[var(--shadow-raised)] sm:rounded-3xl"
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
  const [points, setPoints] = useState<PointAnnotation[]>(
    existing?.points ?? [],
  );

  const slug = meal.analysis.foods[0]?.name?.toLowerCase() ?? "";

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setPoints((prev) => [...prev, { id: `pin-${Date.now()}`, x, y, note: "" }]);
  };

  const updatePinNote = (id: string, note: string) => {
    setPoints((prev) => prev.map((p) => (p.id === id ? { ...p, note } : p)));
  };

  const removePin = (id: string) => {
    setPoints((prev) => prev.filter((p) => p.id !== id));
  };

  const canSave =
    body.trim().length > 0 || points.some((p) => p.note.trim().length > 0);

  const save = () => {
    if (!canSave) return;
    patientStore.upsertAnnotation(patientId, {
      id: existing?.id ?? `ann-${meal.id}-${Date.now()}`,
      mealId: meal.id,
      patientId,
      fromDietitianName: dietitianName,
      body: body.trim(),
      recommendation: recommendation.trim() || undefined,
      points: points.length > 0 ? points : undefined,
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
    toast.push({ variant: "info", title: "Note removed", duration: 1500 });
    onClose();
  };

  return (
    <>
      {/* Annotatable image — click anywhere to drop a pin */}
      <div
        className="relative h-[300px] w-full shrink-0 cursor-crosshair overflow-hidden"
        onClick={handleImageClick}
      >
        <Image
          src={mealImageBySlug(slug)}
          alt={meal.analysis.dietitianSummary}
          fill
          sizes="(max-width: 640px) 100vw, 512px"
          className="pointer-events-none object-cover"
        />
        {/* Bottom gradient + meal meta */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-5 pb-4 pt-14 text-white">
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

        {/* Close button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[var(--measured-dark)] hover:bg-white"
        >
          <X size={16} strokeWidth={2.2} />
        </button>

        {/* "Tap to pin" hint */}
        {points.length === 0 && (
          <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur">
            <MapPin size={11} strokeWidth={2.4} />
            Tap image to add pin
          </div>
        )}

        {/* Pin markers */}
        {points.map((pin, i) => (
          <div
            key={pin.id}
            onClick={(e) => e.stopPropagation()}
            className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 cursor-default select-none items-center justify-center rounded-full bg-[var(--measured-clinical-blue)] text-[11px] font-bold text-white shadow-[var(--shadow-raised)] ring-2 ring-white"
            style={{ left: `${pin.x * 100}%`, top: `${pin.y * 100}%` }}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Scrollable form body */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3 p-5">
          {/* Pin annotation notes */}
          {points.length > 0 && (
            <div className="space-y-2 rounded-2xl bg-[var(--measured-clinical-blue)]/6 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-clinical-blue)]">
                <MapPin size={11} strokeWidth={2.4} aria-hidden="true" />
                Pin notes
              </div>
              {points.map((pin, i) => (
                <div key={pin.id} className="flex items-start gap-2">
                  <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--measured-clinical-blue)] text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  <input
                    type="text"
                    value={pin.note}
                    onChange={(e) => updatePinNote(pin.id, e.target.value)}
                    placeholder={`Note for pin ${i + 1}…`}
                    className="flex-1 rounded-xl border border-[var(--measured-border)] bg-white px-2.5 py-1.5 text-[12px] text-[var(--measured-dark)] placeholder:text-[var(--measured-subtext)] focus:border-[var(--measured-clinical-blue)] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removePin(pin.id)}
                    className="mt-1.5 shrink-0 text-[var(--measured-subtext)] hover:text-[var(--measured-evaluate)]"
                    aria-label={`Remove pin ${i + 1}`}
                  >
                    <X size={13} strokeWidth={2.2} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* General note */}
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
              disabled={!canSave}
              className="inline-flex items-center gap-2 rounded-2xl bg-[var(--measured-green)] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[var(--measured-dark-green)] disabled:cursor-not-allowed disabled:bg-[var(--measured-cream)] disabled:text-[var(--measured-subtext)]"
            >
              <Send size={14} strokeWidth={2.2} aria-hidden="true" />
              {existing ? "Update note" : `Send to ${patientFirstName}`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
