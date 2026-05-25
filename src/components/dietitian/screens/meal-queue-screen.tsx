"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { DEMO_QUEUE_MEALS, PATIENTS } from "@/lib/mock";
import type { MealLog, ReviewStatus } from "@/lib/mock/types";
import { toast } from "@/lib/hooks/use-toast";
import { cn } from "@/lib/utils/cn";
import { mealImageBySlug } from "@/lib/images";

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
    label: "Approve",
    Icon: Check,
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

interface Props {
  pool?: MealLog[];
}

export function DietitianMealQueueScreen({ pool }: Props = {}) {
  const baseMeals = pool ?? DEMO_QUEUE_MEALS;
  const [queueFilter, setQueueFilter] = useState<QueueFilter>("all");
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
  }, [reset, queueFilter]);

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
        toggleEditing();
        return;
      }
      if (action === "message") {
        toast.push({
          variant: "info",
          title: "Composer opening…",
          body: "Stage 6 wires this to the messages thread.",
          duration: 1800,
        });
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
    [cursor, recordAction, setCursor, toggleEditing],
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
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]">
          <CheckCircle2 size={32} strokeWidth={1.6} aria-hidden="true" />
        </div>
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
                : "All meals are reviewed."}
        </p>
        <div className="mt-3 flex gap-2">
          {queueFilter !== "all" && (
            <button
              type="button"
              onClick={() => setQueueFilter("all")}
              className="rounded-2xl border border-[var(--measured-border)] bg-white px-4 py-2 text-[13px] font-semibold text-[var(--measured-dark-green)]"
            >
              Clear filter
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            className="rounded-2xl border border-[var(--measured-border)] bg-white px-4 py-2 text-[13px] font-semibold text-[var(--measured-dark)]"
          >
            Reset (demo)
          </button>
        </div>
      </div>
    );
  }

  const patient = PATIENTS.find((p) => p.id === current.patientId);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
            Meal review queue
          </div>
          <h1 className="mt-1 font-serif text-[34px] leading-tight tracking-tight text-[var(--measured-dark)]">
            {remaining} meal{remaining === 1 ? "" : "s"} waiting
          </h1>
        </div>
        {sessionInfo && (
          <div className="rounded-2xl border border-[var(--measured-border-soft)] bg-white px-4 py-2 text-[12px] text-[var(--measured-dark)]">
            <span className="font-semibold">{sessionInfo.count}</span> reviewed
            ·{" "}
            <Clock
              size={11}
              strokeWidth={2}
              className="inline -mt-0.5 mx-1 text-[var(--measured-subtext)]"
            />
            {sessionInfo.elapsed}
          </div>
        )}
      </div>

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
              const p = PATIENTS.find((pp) => pp.id === m.patientId);
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => setCursor(idx)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-[12px]",
                      isActive
                        ? "border-[var(--measured-green)] bg-[var(--measured-green)]/10"
                        : "border-transparent hover:bg-[var(--measured-cream)]",
                      isPast && "opacity-50",
                    )}
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
                  </button>
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

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-[var(--measured-cream)] p-3 text-[13px]">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
                  <ListChecks size={12} strokeWidth={2.2} aria-hidden="true" />
                  AI summary
                  <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[10px] font-bold normal-case tracking-normal text-[var(--measured-subtext)]">
                    {Math.round(current.analysis.confidence * 100)}%
                  </span>
                </div>
                <p className="mt-1.5 leading-relaxed text-[var(--measured-dark)]">
                  {current.analysis.dietitianSummary}
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
                  <Utensils size={12} strokeWidth={2.2} aria-hidden="true" />
                  CGM context
                </div>
                <p className="mt-1.5 leading-relaxed text-[var(--measured-dark)]">
                  Peak Δ{" "}
                  <span className="font-semibold">
                    {current.analysis.cgmPeakDeltaMmol?.toFixed(1) ?? "?"}{" "}
                    mmol/L
                  </span>{" "}
                  at +{current.analysis.cgmPeakAtMin ?? 60} min after eating.
                </p>
                <div className="mt-2 grid grid-cols-4 gap-1.5 text-center text-[10px] uppercase tracking-wider text-[var(--measured-subtext)]">
                  {(["carb", "protein", "fibre", "fat"] as const).map(
                    (macro) => {
                      const k = `${macro}Load` as
                        | "carbLoad"
                        | "proteinLoad"
                        | "fibreLoad"
                        | "fatLoad";
                      const value = current.analysis[k];
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

            {editing && (
              <div className="rounded-xl border border-dashed border-[var(--measured-clinical-blue)]/40 bg-[var(--measured-clinical-blue)]/5 p-3 text-[12px]">
                <div className="font-semibold text-[var(--measured-clinical-blue)]">
                  Edit mode
                </div>
                <p className="mt-1 leading-relaxed text-[var(--measured-dark)]">
                  Stage 6 wires inline edit to the AI summary + macro chips.
                  Press <kbd className="rounded bg-white px-1 font-mono">E</kbd>{" "}
                  again to exit.
                </p>
              </div>
            )}

            {/* Action bar — Approve is primary, others secondary */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleAction("approved", current.id)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--measured-green)] px-4 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-[var(--measured-dark-green)]"
              >
                <Check size={18} strokeWidth={2.2} aria-hidden="true" />
                Approve
                <kbd className="ml-auto rounded bg-white/20 px-2 py-0.5 text-[11px] font-mono">
                  A
                </kbd>
              </button>
              <div className="grid grid-cols-4 gap-2">
                {SHORTCUTS.filter((sc) => sc.action !== "approved").map(
                  (sc) => (
                    <button
                      type="button"
                      key={sc.key}
                      onClick={() => handleAction(sc.action, current.id)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2.5 text-[11px] font-semibold transition-colors",
                        TONE_CLASS[sc.tone],
                      )}
                    >
                      <sc.Icon size={15} strokeWidth={2.2} aria-hidden="true" />
                      <span>{sc.label}</span>
                      <kbd className="rounded bg-black/10 px-1.5 py-0.5 text-[9px] font-mono opacity-80">
                        {sc.key}
                      </kbd>
                    </button>
                  ),
                )}
              </div>
            </div>
          </motion.section>
        </AnimatePresence>
      </div>
    </div>
  );
}
