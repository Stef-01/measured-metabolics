"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceArea,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Pencil, MessageSquare, Sparkles, Sunrise } from "lucide-react";
import { mealImageBySlug } from "@/lib/images";
import { nearestMealForSpike } from "@/lib/engine/cgm-spike-meal";
import { CHART } from "@/lib/chart-tokens";
import { cn } from "@/lib/utils/cn";
import type { CgmReading, MealLog } from "@/lib/mock/types";
import type { MealAnnotation } from "@/lib/storage/patient-store";

interface Props {
  readings: CgmReading[];
  meals: MealLog[];
  annotations?: MealAnnotation[];
  height?: number;
  /** When set, hovering a spike shows a Pencil cue and clicking calls back. */
  onAnnotateMeal?: (meal: MealLog) => void;
}

interface PointDatum {
  time: number;
  mmolL: number;
}

const SPIKE_THRESHOLD_DELTA = 1.5;
const FILL_GRADIENT_ID = "cgm-meal-grad";
const MEAL_WINDOW_MS = 150 * 60 * 1000; // 2.5h post-prandial arc, matches buildDay spike duration
const PRE_MEAL_OFFSET_MS = 15 * 60 * 1000; // 15 min before eatenAt

// Hex values required for SVG fill attributes — CSS vars don't resolve in SVG context.
const MEAL_COLOR: Record<string, string> = {
  breakfast: "#2c5e8a",
  lunch: "#2d5a3d",
  dinner: "#d4a84b",
  snack: "#b8860b",
};

type SpikeContext = "dawn" | "unknown";

function classifySpikeContext(timestampMs: number): SpikeContext {
  const hour = new Date(timestampMs).getHours();
  if (hour >= 3 && hour < 8) return "dawn";
  return "unknown";
}

/** Nearest CGM reading within `toleranceMs` of `timestampMs`. */
function glucoseAt(
  data: PointDatum[],
  timestampMs: number,
  toleranceMs = 10 * 60 * 1000,
): number | null {
  let best: PointDatum | null = null;
  let bestDiff = Infinity;
  for (const d of data) {
    const diff = Math.abs(d.time - timestampMs);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = d;
    }
  }
  return best && bestDiff <= toleranceMs ? best.mmolL : null;
}

/**
 * Glucose graph that pops out the causal meal photo on hover and (optionally)
 * lets the dietitian leave a note for the patient with a single click.
 *
 * Used on both the dietitian patient detail page and the patient metrics
 * screen — only `onAnnotateMeal` differs.
 */
export function CgmMealChart({
  readings,
  meals,
  annotations = [],
  height = 240,
  onAnnotateMeal,
}: Props) {
  const data = useMemo<PointDatum[]>(
    () =>
      readings.map((r) => ({ time: new Date(r.ts).getTime(), mmolL: r.mmolL })),
    [readings],
  );
  const [hovered, setHovered] = useState<{
    time: number;
    mmolL: number;
  } | null>(null);

  const annotationByMealId = useMemo(() => {
    const map = new Map<string, MealAnnotation>();
    for (const ann of annotations) map.set(ann.mealId, ann);
    return map;
  }, [annotations]);

  const preMealGlucose = useMemo(() => {
    const map = new Map<string, number>(); // meal.id → glucose 15 min before eatenAt
    for (const m of meals) {
      const preTs = new Date(m.eatenAt).getTime() - PRE_MEAL_OFFSET_MS;
      const val = glucoseAt(data, preTs);
      if (val !== null) map.set(m.id, val);
    }
    return map;
  }, [meals, data]);

  const interactive = Boolean(onAnnotateMeal);

  const handleClick = (state: ChartState) => {
    if (!interactive) return;
    const time = toTime(state?.activeLabel);
    if (time === null) return;
    const match = nearestMealForSpike(meals, time);
    if (!match) return;
    onAnnotateMeal?.(match.meal);
  };

  const handleMouseMove = (state: ChartState) => {
    if (!state?.isTooltipActive || !state.activePayload?.length) {
      if (hovered !== null) setHovered(null);
      return;
    }
    const datum = state.activePayload[0]?.payload as PointDatum | undefined;
    if (!datum) return;
    if (
      hovered === null ||
      hovered.time !== datum.time ||
      hovered.mmolL !== datum.mmolL
    ) {
      setHovered({ time: datum.time, mmolL: datum.mmolL });
    }
  };

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={data}
          onMouseLeave={() => setHovered(null)}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
        >
          <defs>
            <linearGradient id={FILL_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART.green} stopOpacity={0.32} />
              <stop offset="100%" stopColor={CHART.green} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(0,0,0,0.06)" vertical={false} />
          <XAxis
            dataKey="time"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(t: number) =>
              new Date(t).toLocaleTimeString([], {
                hour: "numeric",
                hour12: false,
              })
            }
            stroke="rgba(0,0,0,0.4)"
            fontSize={10}
          />
          <YAxis domain={[3, 12]} stroke="rgba(0,0,0,0.4)" fontSize={10} />
          <ReferenceArea
            y1={3.9}
            y2={10}
            fill={CHART.green}
            fillOpacity={0.06}
          />
          <Tooltip
            cursor={{ stroke: "rgba(45,90,61,0.4)", strokeDasharray: "3 3" }}
            content={() => null}
          />
          {/* Stage 2: post-prandial window shading — 2.5h arc per meal */}
          {meals.map((m) => {
            const x1 = new Date(m.eatenAt).getTime();
            const color = MEAL_COLOR[m.mealType] ?? CHART.green;
            return (
              <ReferenceArea
                key={`window-${m.id}`}
                x1={x1}
                x2={x1 + MEAL_WINDOW_MS}
                fill={color}
                fillOpacity={0.04}
              />
            );
          })}
          {/* Stage 1: meal-time tick markers */}
          {meals.map((m) => (
            <ReferenceLine
              key={m.id}
              x={new Date(m.eatenAt).getTime()}
              stroke={MEAL_COLOR[m.mealType] ?? CHART.green}
              strokeDasharray="3 5"
              strokeWidth={1.5}
              strokeOpacity={0.6}
              label={{
                value: m.photoEmoji,
                position: "insideTopRight",
                fontSize: 13,
                offset: 4,
              }}
            />
          ))}
          <Area
            type="monotone"
            dataKey="mmolL"
            stroke={CHART.green}
            strokeWidth={2}
            fill={`url(#${FILL_GRADIENT_ID})`}
          />
          {/* Stage 3: pre-meal glucose dots at T−15 min */}
          {meals.map((m) => {
            const preTs = new Date(m.eatenAt).getTime() - PRE_MEAL_OFFSET_MS;
            const preVal = glucoseAt(data, preTs);
            if (preVal === null) return null;
            const color = MEAL_COLOR[m.mealType] ?? CHART.green;
            return (
              <ReferenceDot
                key={`pre-${m.id}`}
                x={preTs}
                y={preVal}
                r={3.5}
                fill={color}
                stroke="white"
                strokeWidth={1.5}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>

      {hovered &&
        (() => {
          const match = nearestMealForSpike(meals, hovered.time);
          const annotation = match
            ? annotationByMealId.get(match.meal.id)
            : undefined;
          const isSpike =
            match?.meal.analysis.cgmPeakDeltaMmol !== undefined &&
            match.meal.analysis.cgmPeakDeltaMmol >= SPIKE_THRESHOLD_DELTA;
          const preMealMmol = match
            ? preMealGlucose.get(match.meal.id)
            : undefined;
          return (
            <SpikeMealCallout
              hoveredAt={hovered.time}
              hoveredMmol={hovered.mmolL}
              match={match}
              annotation={annotation}
              isSpike={isSpike}
              showAnnotateCta={interactive}
              preMealMmol={preMealMmol}
            />
          );
        })()}
    </div>
  );
}

interface ChartState {
  isTooltipActive?: boolean;
  activeLabel?: string | number;
  activePayload?: { payload?: unknown }[];
}

function toTime(value: string | number | undefined): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.length > 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

interface CalloutProps {
  hoveredAt: number;
  hoveredMmol: number;
  match: ReturnType<typeof nearestMealForSpike>;
  annotation?: MealAnnotation;
  isSpike: boolean;
  showAnnotateCta: boolean;
  preMealMmol?: number;
}

function SpikeMealCallout({
  hoveredAt,
  hoveredMmol,
  match,
  annotation,
  isSpike,
  showAnnotateCta,
  preMealMmol,
}: CalloutProps) {
  const time = new Date(hoveredAt).toLocaleString([], {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });

  if (!match) {
    const ctx = classifySpikeContext(hoveredAt);
    return (
      <div className="pointer-events-none absolute right-2 top-2 max-w-[240px] rounded-2xl border border-[var(--measured-border-soft)] bg-white/95 px-3 py-2 text-[12px] shadow-[var(--shadow-card)] backdrop-blur">
        <div className="tnum font-semibold text-[var(--measured-dark)]">
          {hoveredMmol.toFixed(1)} mmol/L
        </div>
        {ctx === "dawn" ? (
          <div className="mt-0.5 flex items-center gap-1 text-[var(--measured-gold)]">
            <Sunrise size={11} strokeWidth={2.2} aria-hidden="true" />
            <span className="font-semibold">Dawn rise</span>
            <span className="text-[var(--measured-subtext)]">
              · cortisol, expected 3–7 am
            </span>
          </div>
        ) : (
          <div className="text-[var(--measured-subtext)]">
            {time} · No meal logged within 3 h
          </div>
        )}
      </div>
    );
  }

  const peak = match.meal.analysis.cgmPeakDeltaMmol;
  const slug = match.meal.analysis.foods[0]?.name?.toLowerCase() ?? "";

  return (
    <div
      className={cn(
        "pointer-events-none absolute right-2 top-2 w-[280px] overflow-hidden rounded-2xl border bg-white/97 shadow-[var(--shadow-raised)] backdrop-blur",
        isSpike
          ? "border-[var(--measured-evaluate)]/40"
          : "border-[var(--measured-border-soft)]",
      )}
    >
      <div className="relative h-[140px] w-full">
        <Image
          src={mealImageBySlug(slug)}
          alt={match.meal.analysis.dietitianSummary}
          fill
          sizes="280px"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-3 pt-6 pb-2 text-white">
          <div className="tnum text-[10px] font-semibold uppercase tracking-wider opacity-90">
            {match.meal.mealType} · +{match.minutesAfter} min after eating
          </div>
          <div className="text-[14px] font-semibold leading-tight">
            {match.meal.analysis.foods
              .slice(0, 2)
              .map((f) => f.name)
              .join(" + ")}
          </div>
        </div>
      </div>
      <div className="px-3 py-2 text-[12px] text-[var(--measured-dark)]">
        <div className="flex items-center justify-between text-[11px] text-[var(--measured-subtext)]">
          <span>{time}</span>
          <span className="tnum">
            {hoveredMmol.toFixed(1)} mmol/L
            {peak !== undefined && (
              <span className="ml-1 text-[var(--measured-evaluate)]">
                · peak Δ {peak.toFixed(1)}
              </span>
            )}
          </span>
        </div>
        {preMealMmol !== undefined && (
          <div className="mt-1.5 flex items-center justify-between rounded-xl bg-[var(--measured-cream)] px-2.5 py-1.5 text-[11px]">
            <span className="text-[var(--measured-subtext)]">Pre-meal</span>
            <span
              className={cn(
                "tnum font-semibold",
                preMealMmol > 7.0
                  ? "text-[var(--measured-clinical-amber)]"
                  : "text-[var(--measured-dark-green)]",
              )}
            >
              {preMealMmol.toFixed(1)} mmol/L
              {preMealMmol > 7.0 && (
                <span className="ml-1 font-normal text-[var(--measured-subtext)]">
                  · elevated baseline
                </span>
              )}
            </span>
          </div>
        )}
        <p className="mt-1 leading-snug">
          {match.meal.analysis.dietitianSummary}
        </p>
        {match.meal.analysis.clinicalFlags.length > 0 && (
          <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-[var(--measured-evaluate)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--measured-evaluate)]">
            <Sparkles size={10} strokeWidth={2.4} aria-hidden="true" />
            {match.meal.analysis.clinicalFlags[0]}
          </div>
        )}
        {annotation && (
          <div className="mt-2 rounded-xl bg-[var(--measured-clinical-blue)]/8 px-2.5 py-1.5">
            <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-clinical-blue)]">
              <MessageSquare size={10} strokeWidth={2.4} aria-hidden="true" />
              {annotation.fromDietitianName}
            </div>
            <p className="mt-0.5 leading-snug text-[var(--measured-dark)]">
              {annotation.body}
            </p>
          </div>
        )}
        {showAnnotateCta && !annotation && (
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-[var(--measured-green)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--measured-dark-green)]">
            <Pencil size={10} strokeWidth={2.4} aria-hidden="true" />
            Click to add a note for the patient
          </div>
        )}
      </div>
    </div>
  );
}
