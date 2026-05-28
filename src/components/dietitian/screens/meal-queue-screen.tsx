"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Pencil,
  Flag,
  MessageCircle,
  ArrowRight,
  Clock,
  Utensils,
  ListChecks,
  CheckCircle2,
} from "lucide-react";
import { useDietitianQueue } from "@/lib/store/dietitian-store";
import { DEMO_QUEUE_MEALS, PATIENTS, CURRENT_PATIENT_ID } from "@/lib/mock";
import { useStoredMeals } from "@/lib/storage/patient-store";
import type { MealLog, ReviewStatus } from "@/lib/mock/types";
import { toast } from "@/lib/hooks/use-toast";
import { cn } from "@/lib/utils/cn";
import { mealImageBySlug } from "@/lib/images";

type MacroLevel = "low" | "moderate" | "high";
type MacroValues = {
  carbLoad: MacroLevel;
  proteinLoad: MacroLevel;
  fibreLoad: MacroLevel;
  fatLoad: MacroLevel;
};
type SavedMealEdit = { summary: string; macros: MacroValues };

const SHORTCUTS: {
  key: string;
  action: ReviewStatus | "edit" | "message" | "next";
  label: string;
  Icon: typeof Check;
  tone: "approve" | "edit" | "flag" | "message" | "neutral";
}[] = [
  {
    key: "A",
    action: "approved",
    label: "Reviewed",
    Icon: CheckCircle2,
    tone: "approve",
  },
  { key: "E", action: "edit", label: "Edit", Icon: Pencil, tone: "edit" },
  { key: "F", action: "flagged", label: "Flag", Icon: Flag, tone: "flag" },
  {
    key: "M",
    action: "message",
    label: "Message",
    Icon: MessageCircle,
    tone: "message",
  },
  {
    key: "N",
    action: "next",
    label: "Skip",
    Icon: ArrowRight,
    tone: "neutral",
  },
];

const TONE_CLASS: Record<(typeof SHORTCUTS)[number]["tone"], string> = {
  approve:
    "bg-[var(--measured-green)] text-white hover:bg-[var(--measured-dark-green)]",
  edit: "bg-[var(--measured-clinical-blue)] text-white hover:bg-[var(--measured-clinical-blue)]/90",
  flag: "bg-[var(--measured-evaluate)] text-white hover:bg-[var(--measured-evaluate-hover)]",
  message:
    "bg-[var(--measured-gold)] text-[#3a2700] hover:bg-[var(--measured-gold)]/85",
  neutral:
    "bg-[var(--measured-cream)] text-[var(--measured-dark)] hover:bg-[var(--measured-input-bg)]",
};

type QueueFilter = "all" | "flagged" | "high_spike";

function triageLabel(m: MealLog): { label: string; color: string } | null {
  if (m.analysis.clinicalFlags.length > 0)
    return { label: "Flag", color: "var(--measured-evaluate)" };
  if ((m.analysis.cgmPeakDeltaMmol ?? 0) >= 3)
    return { label: "High Δ", color: "var(--measured-evaluate)" };
  if ((m.analysis.cgmPeakDeltaMmol ?? 0) >= 1.5)
    return { label: "Spike", color: "var(--measured-clinical-amber)" };
  return null;
}

interface Props {
  pool?: MealLog[];
}

export function DietitianMealQueueScreen({ pool }: Props = {}) {
  const router = useRouter();
  const storedMeals = useStoredMeals(CURRENT_PATIENT_ID);
  const baseMeals = useMemo(() => {
    const base = pool ?? DEMO_QUEUE_MEALS;
    const pendingStored = storedMeals.filter(
      (m) => m.reviewStatus === "pending_review",
    );
    const baseIds = new Set(base.map((m) => m.id));
    const newStored = pendingStored.filter((m) => !baseIds.has(m.id));
    return [...newStored.slice().reverse(), ...base];
  }, [pool, storedMeals]);
  const [queueFilter, setQueueFilter] = useState<QueueFilter>("all");
  const [savedEdits, setSavedEdits] = useState<Record<string, SavedMealEdit>>(
    {},
  );
  const [editDraft, setEditDraft] = useState<SavedMealEdit | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const meals = useMemo(() => {
    switch (queueFilter) {
      case "flagged":
        return baseMeals.filter((m) => m.analysis.clinicalFlags.length > 0);
      case "high_spike":
        return baseMeals.filter((m) => (m.analysis.cgmPeakDeltaMmol ?? 0) >= 3);
      default:
        return baseMeals;
    }
  }, [baseMeals, queueFilter]);
  const cursor = useDietitianQueue((s) => s.cursor);
  const setCursor = useDietitianQueue((s) => s.setCursor);
  const recordAction = useDietitianQueue((s) => s.recordAction);
  const editing = useDietitianQueue((s) => s.editing);
  const toggleEditing = useDietitianQueue((s) => s.toggleEditing);
  const reset = useDietitianQueue((s) => s.reset);
  const acted = useDietitianQueue((s) => s.actedThisSession);

  // Track session start in state so it's stable across renders without
  // touching Date.now() during the render phase.
  const [sessionStartAt, setSessionStartAt] = useState<number | null>(null);
  // tick: bumped every second when there's an active session, so elapsed
  // time renders live without calling Date.now() during render.
  const [tick, setTick] = useState(0);

  const current = meals[cursor];
  const remaining = Math.max(0, meals.length - cursor);

  // Reset cursor on mount and whenever the filter changes.
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelected(new Set());
  }, [reset, queueFilter]);

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bulkAct = (action: "approved" | "flagged") => {
    selected.forEach((id) => recordAction(id, action));
    const verb = action === "approved" ? "Approved" : "Flagged";
    toast.push({
      variant: action === "flagged" ? "info" : "success",
      title: `${verb} ${selected.size} meal${selected.size === 1 ? "" : "s"}`,
      duration: 1800,
    });
    setSelected(new Set());
  };

  // Initialise session start once, after mount, away from render purity rules.
  useEffect(() => {
    if (sessionStartAt === null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSessionStartAt(Date.now());
    }
  }, [sessionStartAt]);

  // 1Hz tick while session is active so elapsed updates visibly.
  useEffect(() => {
    if (acted.length === 0) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [acted.length]);

  const handleAction = useCallback(
    (action: (typeof SHORTCUTS)[number]["action"], id: string | undefined) => {
      if (!id) return;
      if (action === "next") {
        setCursor(cursor + 1);
        return;
      }
      if (action === "edit") {
        if (!editing) {
          const meal = meals.find((m) => m.id === id);
          if (meal) {
            setEditDraft(
              savedEdits[id] ?? {
                summary: meal.analysis.dietitianSummary,
                macros: {
                  carbLoad: (meal.analysis.carbLoad ??
                    "moderate") as MacroLevel,
                  proteinLoad: (meal.analysis.proteinLoad ??
                    "moderate") as MacroLevel,
                  fibreLoad: (meal.analysis.fibreLoad ??
                    "moderate") as MacroLevel,
                  fatLoad: (meal.analysis.fatLoad ?? "moderate") as MacroLevel,
                },
              },
            );
          }
        } else {
          setEditDraft(null);
        }
        toggleEditing();
        return;
      }
      if (action === "message") {
        const meal = meals.find((m) => m.id === id);
        if (meal) {
          router.push(
            `/d/messages?patient=${encodeURIComponent(meal.patientId)}`,
          );
        }
        return;
      }
      const verb =
        action === "approved"
          ? "Approved"
          : action === "flagged"
            ? "Flagged"
            : "Saved";
      recordAction(id, action);
      toast.push({
        variant: action === "flagged" ? "info" : "success",
        title: `${verb} · ${id}`,
        duration: 1400,
        dedupKey: "queue-action",
      });
    },
    [
      cursor,
      editing,
      meals,
      recordAction,
      router,
      savedEdits,
      setCursor,
      toggleEditing,
    ],
  );

  // === Keyboard shortcuts ===
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Don't fire when user is typing in a textarea / input
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
      )
        return;
      const k = e.key.toUpperCase();
      const sc = SHORTCUTS.find((s) => s.key === k);
      if (!sc) return;
      e.preventDefault();
      handleAction(sc.action, current?.id);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleAction, current?.id]);

  // Reference `tick` so the eslint react-hooks rule sees it consumed; the
  // value itself doesn't matter — its update triggers re-render of the timer.
  void tick;
  let sessionInfo: { count: number; elapsed: string } | null = null;
  if (acted.length > 0 && sessionStartAt !== null) {
    const last = acted[acted.length - 1].at;
    const elapsedSec = Math.max(0, Math.round((last - sessionStartAt) / 1000));
    const mm = Math.floor(elapsedSec / 60)
      .toString()
      .padStart(2, "0");
    const ss = (elapsedSec % 60).toString().padStart(2, "0");
    sessionInfo = { count: acted.length, elapsed: `${mm}:${ss}` };
  }

  if (!current) {
    return (
      <motion.div
        className="mx-auto flex max-w-3xl flex-col items-center gap-3 py-24 text-center"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 18,
            delay: 0.1,
          }}
        >
          <CheckCircle2 size={32} strokeWidth={1.6} aria-hidden="true" />
        </motion.div>
        <h2 className="font-serif text-[28px] text-[var(--measured-dark)]">
          {queueFilter !== "all" ? "No matches" : "Queue clear"}
        </h2>
        <p className="text-[14px] text-[var(--measured-subtext)]">
          {queueFilter === "flagged"
            ? "No flagged meals in the queue."
            : queueFilter === "high_spike"
              ? "No high-spike meals (≥3 mmol/L) found."
              : acted.length > 0
                ? `${acted.length} meals reviewed${sessionInfo ? ` in ${sessionInfo.elapsed}` : ""}.`
                : "All meals reviewed — great session."}
        </p>
        <div className="mt-3 flex gap-2">
          {queueFilter !== "all" && (
            <motion.button
              type="button"
              onClick={() => setQueueFilter("all")}
              className="rounded-2xl border border-[var(--measured-border)] bg-white px-4 py-2 text-[13px] font-semibold text-[var(--measured-dark-green)]"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              Clear filter
            </motion.button>
          )}
          <motion.button
            type="button"
            onClick={reset}
            className="rounded-2xl border border-[var(--measured-border)] bg-white px-4 py-2 text-[13px] font-semibold text-[var(--measured-dark)]"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            Reset queue
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const patient = PATIENTS.find((p) => p.id === current.patientId);

  return (
    <div className="mx-auto max-w-6xl">
      <motion.div
        className="flex items-end justify-between gap-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
            Meal review queue
          </div>
          <h1 className="mt-1 font-serif text-[34px] leading-tight tracking-tight text-[var(--measured-dark)]">
            {remaining} meal{remaining === 1 ? "" : "s"} for clinical review
          </h1>
        </div>
        <AnimatePresence>
          {sessionInfo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-[var(--measured-border-soft)] bg-white px-4 py-2 text-[12px] text-[var(--measured-dark)]"
            >
              <span className="font-semibold">{sessionInfo.count}</span>{" "}
              reviewed ·{" "}
              <Clock
                size={11}
                strokeWidth={2}
                className="inline -mt-0.5 mx-1 text-[var(--measured-subtext)]"
              />
              {sessionInfo.elapsed}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Filter strip */}
      <div className="mt-4 flex items-center gap-2">
        {(
          [
            { id: "all" as QueueFilter, label: "All", count: baseMeals.length },
            {
              id: "flagged" as QueueFilter,
              label: "Flagged",
              count: baseMeals.filter(
                (m) => m.analysis.clinicalFlags.length > 0,
              ).length,
            },
            {
              id: "high_spike" as QueueFilter,
              label: "High spike",
              count: baseMeals.filter(
                (m) => (m.analysis.cgmPeakDeltaMmol ?? 0) >= 3,
              ).length,
            },
          ] as const
        ).map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setQueueFilter(f.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors",
              queueFilter === f.id
                ? "bg-[var(--measured-dark)] text-white"
                : "border border-[var(--measured-border)] bg-white text-[var(--measured-subtext)] hover:bg-[var(--measured-cream)]",
            )}
          >
            {f.label}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                queueFilter === f.id
                  ? "bg-white/20 text-white"
                  : "bg-[var(--measured-cream)] text-[var(--measured-subtext)]",
              )}
            >
              {f.count}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Left rail: queue */}
        <aside className="surface-card max-h-[calc(100dvh-180px)] overflow-y-auto p-3 scrollbar-hide">
          <ul className="space-y-1.5">
            {meals.map((m, idx) => {
              const isActive = idx === cursor;
              const isPast = idx < cursor;
              const isSelected = selected.has(m.id);
              const p = PATIENTS.find((pp) => pp.id === m.patientId);
              return (
                <li key={m.id} className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => toggleSelect(m.id, e)}
                    aria-label={isSelected ? "Deselect" : "Select"}
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                      isSelected
                        ? "border-[var(--measured-green)] bg-[var(--measured-green)]"
                        : "border-[var(--measured-border)] bg-white hover:border-[var(--measured-green)]",
                    )}
                  >
                    {isSelected && (
                      <Check
                        size={11}
                        strokeWidth={2.8}
                        className="text-white"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                  <motion.button
                    type="button"
                    onClick={() => setCursor(idx)}
                    className={cn(
                      "flex flex-1 items-center gap-2 rounded-xl border px-3 py-2 text-left text-[12px]",
                      isActive
                        ? "border-[var(--measured-green)] bg-[var(--measured-green)]/10"
                        : "border-transparent hover:bg-[var(--measured-cream)]",
                      isPast && "opacity-50",
                    )}
                    whileHover={isActive ? undefined : { x: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 24 }}
                  >
                    <span className="text-[20px]" aria-hidden="true">
                      {m.photoEmoji}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-[var(--measured-dark)]">
                        {p ? p.firstName : m.patientId}
                      </span>
                      <span className="block text-[10px] text-[var(--measured-subtext)]">
                        {m.mealType} · Δ
                        {m.analysis.cgmPeakDeltaMmol?.toFixed(1) ?? "?"} mmol
                      </span>
                    </span>
                    {m.analysis.clinicalFlags.length > 0 && (
                      <Flag
                        size={12}
                        className="text-[var(--measured-evaluate)]"
                        aria-hidden="true"
                      />
                    )}
                    {triageLabel(m) !== null && (
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase"
                        style={{
                          backgroundColor: `${triageLabel(m)!.color}15`,
                          color: triageLabel(m)!.color,
                        }}
                      >
                        {triageLabel(m)!.label}
                      </span>
                    )}
                  </motion.button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Right pane: current meal */}
        <AnimatePresence mode="wait">
          <motion.section
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="surface-raised flex flex-col gap-4 p-5"
          >
            <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-[var(--measured-cream)]">
              <Image
                src={mealImageBySlug(
                  current.analysis.foods[0]?.name?.toLowerCase() ?? "",
                )}
                alt={current.analysis.dietitianSummary}
                fill
                sizes="(min-width: 1024px) 720px, 100vw"
                className="object-cover"
                priority
              />
              <span
                className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1.5 text-[24px] shadow-[var(--shadow-card)]"
                aria-hidden="true"
              >
                {current.photoEmoji}
              </span>
              <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 bg-gradient-to-b from-black/55 to-transparent px-4 pt-4 pb-8 text-white">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider opacity-90">
                    {current.mealType} ·{" "}
                    {new Date(current.eatenAt).toLocaleString([], {
                      weekday: "short",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </div>
                  {patient ? (
                    <Link
                      href={`/d/patients/${patient.id}`}
                      className="block font-serif text-[26px] leading-tight tracking-tight hover:underline"
                    >
                      {patient.firstName} {patient.lastName}
                    </Link>
                  ) : (
                    <div className="font-serif text-[26px] leading-tight tracking-tight">
                      {current.patientId}
                    </div>
                  )}
                  {patient && (
                    <div className="text-[12px] opacity-90">
                      {patient.conditions.join(" · ")} · {patient.cuisineLabel}
                    </div>
                  )}
                </div>
                <div className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
                  Peak Δ {current.analysis.cgmPeakDeltaMmol?.toFixed(1) ?? "?"}{" "}
                  mmol/L
                </div>
              </div>
            </div>

            {(() => {
              const effectiveSummary =
                savedEdits[current.id]?.summary ??
                current.analysis.dietitianSummary;
              const effectiveMacros = savedEdits[current.id]?.macros;
              const macroValue = (
                k: "carbLoad" | "proteinLoad" | "fibreLoad" | "fatLoad",
              ): MacroLevel =>
                (effectiveMacros?.[k] ??
                  current.analysis[k] ??
                  "moderate") as MacroLevel;
              return (
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl bg-[var(--measured-cream)] p-3 text-[13px]">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
                      <ListChecks
                        size={12}
                        strokeWidth={2.2}
                        aria-hidden="true"
                      />
                      AI summary
                      {savedEdits[current.id] && (
                        <span className="ml-1 rounded-full bg-[var(--measured-clinical-blue)]/15 px-1.5 py-0.5 text-[9px] font-bold normal-case tracking-normal text-[var(--measured-clinical-blue)]">
                          edited
                        </span>
                      )}
                      <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[10px] font-bold normal-case tracking-normal text-[var(--measured-subtext)]">
                        {Math.round(current.analysis.confidence * 100)}%
                      </span>
                    </div>
                    <p className="mt-1.5 leading-relaxed text-[var(--measured-dark)]">
                      {effectiveSummary}
                    </p>
                    <ul className="mt-2 space-y-0.5 text-[12px] text-[var(--measured-subtext)]">
                      {current.analysis.foods.slice(0, 4).map((f) => (
                        <li key={f.name}>
                          <span className="font-medium text-[var(--measured-dark)]">
                            {f.name}
                          </span>{" "}
                          · {f.quantity}
                        </li>
                      ))}
                    </ul>
                    {current.analysis.clinicalFlags.length > 0 && (
                      <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-[var(--measured-evaluate)]/10 px-2 py-0.5 text-[11px] font-semibold text-[var(--measured-evaluate)]">
                        <Flag size={11} strokeWidth={2.2} aria-hidden="true" />
                        {current.analysis.clinicalFlags[0]}
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl bg-[var(--measured-clinical-blue)]/5 p-3 text-[13px]">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-clinical-blue)]">
                      <Utensils
                        size={12}
                        strokeWidth={2.2}
                        aria-hidden="true"
                      />
                      CGM context
                    </div>
                    <p className="mt-1.5 leading-relaxed text-[var(--measured-dark)]">
                      Peak Δ{" "}
                      <span className="font-semibold">
                        {current.analysis.cgmPeakDeltaMmol?.toFixed(1) ?? "?"}{" "}
                        mmol/L
                      </span>{" "}
                      at +{current.analysis.cgmPeakAtMin ?? 60} min after
                      eating.
                    </p>
                    <div className="mt-2 grid grid-cols-4 gap-1.5 text-center text-[10px] uppercase tracking-wider text-[var(--measured-subtext)]">
                      {(["carb", "protein", "fibre", "fat"] as const).map(
                        (macro) => {
                          const k = `${macro}Load` as
                            | "carbLoad"
                            | "proteinLoad"
                            | "fibreLoad"
                            | "fatLoad";
                          const value = macroValue(k);
                          return (
                            <div
                              key={macro}
                              className={cn(
                                "rounded-md py-1.5",
                                value === "high"
                                  ? "bg-[var(--measured-evaluate)]/15 text-[var(--measured-evaluate)]"
                                  : value === "moderate"
                                    ? "bg-[var(--measured-clinical-amber)]/15 text-[var(--measured-clinical-amber)]"
                                    : "bg-[var(--measured-green)]/15 text-[var(--measured-dark-green)]",
                              )}
                            >
                              <div className="text-[9px]">{macro}</div>
                              <div className="text-[12px] font-bold normal-case tracking-normal">
                                {value}
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {editing && editDraft && (
              <div className="rounded-xl border border-[var(--measured-clinical-blue)]/30 bg-[var(--measured-clinical-blue)]/5 p-4">
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-clinical-blue)]">
                  Edit AI summary
                </div>
                <textarea
                  rows={3}
                  value={editDraft.summary}
                  onChange={(e) =>
                    setEditDraft((d) =>
                      d ? { ...d, summary: e.target.value } : d,
                    )
                  }
                  className="w-full resize-none rounded-xl border border-[var(--measured-border)] bg-white px-3 py-2 text-[13px] leading-relaxed text-[var(--measured-dark)] focus:border-[var(--measured-clinical-blue)] focus:outline-none"
                />
                <div className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-clinical-blue)]">
                  Macro loads
                </div>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {(["carb", "protein", "fibre", "fat"] as const).map(
                    (macro) => {
                      const k = `${macro}Load` as keyof MacroValues;
                      return (
                        <div key={macro}>
                          <div className="mb-1 text-center text-[10px] uppercase tracking-wider text-[var(--measured-subtext)]">
                            {macro}
                          </div>
                          <div className="flex flex-col gap-1">
                            {(["low", "moderate", "high"] as MacroLevel[]).map(
                              (level) => (
                                <button
                                  type="button"
                                  key={level}
                                  onClick={() =>
                                    setEditDraft((d) =>
                                      d
                                        ? {
                                            ...d,
                                            macros: { ...d.macros, [k]: level },
                                          }
                                        : d,
                                    )
                                  }
                                  className={cn(
                                    "rounded-md py-1 text-[10px] font-semibold capitalize transition-colors",
                                    editDraft.macros[k] === level
                                      ? level === "high"
                                        ? "bg-[var(--measured-evaluate)] text-white"
                                        : level === "moderate"
                                          ? "bg-[var(--measured-clinical-amber)] text-white"
                                          : "bg-[var(--measured-dark-green)] text-white"
                                      : "bg-white text-[var(--measured-subtext)] hover:bg-[var(--measured-cream)]",
                                  )}
                                >
                                  {level}
                                </button>
                              ),
                            )}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSavedEdits((prev) => ({
                        ...prev,
                        [current.id]: editDraft,
                      }));
                      setEditDraft(null);
                      toggleEditing();
                      toast.push({
                        variant: "success",
                        title: "Edits saved",
                        duration: 1400,
                        dedupKey: "edit-save",
                      });
                    }}
                    className="flex-1 rounded-xl bg-[var(--measured-clinical-blue)] py-2 text-[13px] font-semibold text-white"
                  >
                    Save edits
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditDraft(null);
                      toggleEditing();
                    }}
                    className="rounded-xl border border-[var(--measured-border)] bg-white px-4 py-2 text-[13px] font-semibold text-[var(--measured-dark)]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Action bar — Approve is primary, others secondary */}
            <div className="space-y-2">
              <motion.button
                type="button"
                onClick={() => handleAction("approved", current.id)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--measured-green)] px-4 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-[var(--measured-dark-green)]"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <CheckCircle2 size={18} strokeWidth={2.2} aria-hidden="true" />
                Reviewed ✓
                <kbd className="ml-auto rounded bg-white/20 px-2 py-0.5 text-[11px] font-mono">
                  A
                </kbd>
              </motion.button>
              <div className="grid grid-cols-4 gap-2">
                {SHORTCUTS.filter((sc) => sc.action !== "approved").map(
                  (sc) => (
                    <motion.button
                      type="button"
                      key={sc.key}
                      onClick={() => handleAction(sc.action, current.id)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2.5 text-[11px] font-semibold transition-colors",
                        TONE_CLASS[sc.tone],
                      )}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.91 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                      }}
                    >
                      <sc.Icon size={15} strokeWidth={2.2} aria-hidden="true" />
                      <span>{sc.label}</span>
                      <kbd className="rounded bg-black/10 px-1.5 py-0.5 text-[9px] font-mono opacity-80">
                        {sc.key}
                      </kbd>
                    </motion.button>
                  ),
                )}
              </div>
            </div>
          </motion.section>
        </AnimatePresence>
      </div>

      {/* Floating bulk action bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-[var(--measured-border-soft)] bg-[var(--measured-dark)] px-4 py-3 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.35)]">
              <span className="mr-1 text-[13px] font-semibold text-white/80">
                {selected.size} selected
              </span>
              <button
                type="button"
                onClick={() => bulkAct("approved")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--measured-green)] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[var(--measured-dark-green)]"
              >
                <Check size={13} strokeWidth={2.4} aria-hidden="true" />
                Approve all
              </button>
              <button
                type="button"
                onClick={() => bulkAct("flagged")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--measured-evaluate)] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[var(--measured-evaluate-hover)]"
              >
                <Flag size={13} strokeWidth={2.2} aria-hidden="true" />
                Flag all
              </button>
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="rounded-xl px-2.5 py-1.5 text-[12px] font-semibold text-white/60 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
