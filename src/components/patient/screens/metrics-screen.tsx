"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Check, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { CHART } from "@/lib/chart-tokens";
import { PatientAppHeader } from "@/components/patient/app-header";
import {
  CGM_BY_PATIENT,
  CURRENT_PATIENT_ID,
  MEALS,
  PATIENTS,
  ASHA_PLAN,
  SYMPTOMS,
  THREADS,
} from "@/lib/mock";
import {
  useSeedPatientStore,
  useStoredAnnotations,
  useStoredMeals,
  useStoredSymptoms,
  useStoredPlanEaten,
} from "@/lib/storage/patient-store";
import { CgmMealChart } from "@/components/shared/cgm-meal-chart";
import { cn } from "@/lib/utils/cn";
import type { MealType } from "@/lib/mock/types";

type TabId = "glucose" | "weight" | "symptoms" | "adherence";

const TABS: { id: TabId; label: string }[] = [
  { id: "glucose", label: "Glucose" },
  { id: "weight", label: "Weight" },
  { id: "symptoms", label: "Symptoms" },
  { id: "adherence", label: "Adherence" },
];

const MEAL_SHORT: Record<MealType, string> = {
  breakfast: "BK",
  lunch: "LU",
  dinner: "DN",
  snack: "SN",
};
const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeekDays(): Date[] {
  const today = new Date();
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

const WEEK_DAYS = getWeekDays();

const SEVERITY_TO_NUM = {
  none: 0,
  mild: 1,
  severe: 2,
} as const;

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];
const pillContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.06 } },
};
const pillItem: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.42, ease } },
};

export function PatientMetricsScreen() {
  const [tab, setTab] = useState<TabId>("glucose");
  const me = PATIENTS.find((p) => p.id === CURRENT_PATIENT_ID)!;
  const pid = me.id;

  // Stable references so useSeedPatientStore's effect doesn't re-run on every render.
  // MEALS/SYMPTOMS/THREADS are module-level constants so pid is the only real dep.
  const seedMeals = useMemo(
    () => MEALS.filter((m) => m.patientId === pid),
    [pid],
  );
  const seedSymptoms = useMemo(
    () => SYMPTOMS.filter((s) => s.patientId === pid),
    [pid],
  );
  const seedThread = useMemo(
    () => THREADS.find((t) => t.patientId === pid)?.messages ?? [],
    [pid],
  );
  useSeedPatientStore(pid, {
    meals: seedMeals,
    symptoms: seedSymptoms,
    thread: seedThread,
  });

  const cgm = CGM_BY_PATIENT[me.id];
  const symptoms = useStoredSymptoms(me.id);
  const meals = useStoredMeals(me.id);
  const annotations = useStoredAnnotations(me.id);
  const planEaten = useStoredPlanEaten(me.id);

  const weightData = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        day: i + 1,
        kg:
          Math.round(
            (me.weightKg + (Math.sin(i / 1.7) * 0.4 + i * 0.04) - 0.6) * 10,
          ) / 10,
      })),
    [me.weightKg],
  );

  const symptomData = useMemo(() => {
    return symptoms
      .slice()
      .reverse()
      .map((s, idx) => ({
        idx,
        nausea: SEVERITY_TO_NUM[s.nausea],
        constipation: SEVERITY_TO_NUM[s.constipation],
      }));
  }, [symptoms]);

  return (
    <>
      <PatientAppHeader
        eyebrow={`Week ${me.weekNumber}`}
        title="Metrics"
        trailing={
          <div className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-[var(--measured-green)]/10 text-center text-[var(--measured-dark-green)]">
            <div className="tnum text-[14px] font-bold leading-none">
              {me.timeInRangePct}%
            </div>
            <div className="text-[8px] uppercase tracking-wider">in range</div>
          </div>
        }
      />

      <div className="mx-auto flex max-w-md flex-col gap-4 px-5 pt-3 pb-8">
        {/* Clinical stats strip */}
        <motion.div
          className="grid grid-cols-3 gap-2"
          variants={pillContainer}
          initial="hidden"
          animate="show"
        >
          <StatPill
            label="HbA1c"
            value={`${me.hbA1cPct}%`}
            status={
              me.hbA1cPct < 7 ? "good" : me.hbA1cPct < 8 ? "watch" : "high"
            }
            lower
          />
          <StatPill
            label="In range"
            value={`${me.timeInRangePct}%`}
            status={
              me.timeInRangePct >= 70
                ? "good"
                : me.timeInRangePct >= 55
                  ? "watch"
                  : "high"
            }
          />
          <StatPill
            label="Weight Δ"
            value={`${me.weightDeltaKg > 0 ? "+" : ""}${me.weightDeltaKg.toFixed(1)} kg`}
            status={me.weightDeltaKg < 0 ? "good" : "watch"}
            lower
          />
        </motion.div>

        <div className="flex gap-2 rounded-full border border-[var(--measured-border)] bg-white p-1">
          {TABS.map((t) => (
            <motion.button
              type="button"
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-pressed={tab === t.id}
              className={cn(
                "flex-1 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors",
                tab === t.id
                  ? "bg-[var(--measured-green)] text-white"
                  : "text-[var(--measured-subtext)]",
              )}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {t.label}
            </motion.button>
          ))}
        </div>

        <div className="surface-card p-4">
          <AnimatePresence mode="wait">
            {tab === "glucose" && (
              <motion.div
                key="glucose"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <ChartShell
                  title="Glucose · last 48h"
                  subtitle={`${me.timeInRangePct}% time in range`}
                >
                  {cgm ? (
                    <CgmMealChart
                      readings={cgm.readings}
                      meals={meals}
                      annotations={annotations}
                      height={220}
                    />
                  ) : (
                    <div className="flex h-[220px] items-center justify-center text-[13px] text-[var(--measured-subtext)]">
                      Connect your sensor to see glucose patterns.
                    </div>
                  )}
                  <p className="mt-3 text-[12px] leading-relaxed text-[var(--measured-subtext)]">
                    Tap any spike on the chart to see the meal that caused it
                    {annotations.length > 0
                      ? ", along with Maya's note."
                      : "."}{" "}
                    {cgm && (
                      <>
                        Highest spike: {cgm.highestSpike.deltaMmol.toFixed(1)}{" "}
                        mmol/L after {cgm.highestSpike.mealType}.
                      </>
                    )}
                  </p>
                </ChartShell>
              </motion.div>
            )}
            {tab === "weight" && (
              <motion.div
                key="weight"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <ChartShell
                  title="Weight · last 14 days"
                  subtitle={`${me.weightDeltaKg > 0 ? "+" : ""}${me.weightDeltaKg.toFixed(1)} kg`}
                >
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={weightData}>
                      <CartesianGrid
                        stroke="rgba(0,0,0,0.06)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="day"
                        stroke="rgba(0,0,0,0.4)"
                        fontSize={10}
                      />
                      <YAxis
                        domain={["auto", "auto"]}
                        stroke="rgba(0,0,0,0.4)"
                        fontSize={10}
                      />
                      <Tooltip
                        formatter={(v: number) => `${v.toFixed(1)} kg`}
                      />
                      <Line
                        type="monotone"
                        dataKey="kg"
                        stroke={CHART.green}
                        strokeWidth={2.4}
                        dot={{ r: 3, fill: CHART.green }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartShell>
              </motion.div>
            )}
            {tab === "symptoms" && (
              <motion.div
                key="symptoms"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <ChartShell title="Symptoms" subtitle="Last logged check-ins">
                  {symptomData.length === 0 ? (
                    <div className="flex h-[220px] items-center justify-center text-center text-[13px] text-[var(--measured-subtext)]">
                      No symptom check-ins yet. Open the Symptoms tab to log
                      one.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={symptomData}>
                        <CartesianGrid
                          stroke="rgba(0,0,0,0.06)"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="idx"
                          stroke="rgba(0,0,0,0.4)"
                          fontSize={10}
                        />
                        <YAxis
                          domain={[0, 2]}
                          ticks={[0, 1, 2]}
                          tickFormatter={(v: number) =>
                            ["none", "mild", "severe"][v] ?? ""
                          }
                          stroke="rgba(0,0,0,0.4)"
                          fontSize={10}
                        />
                        <Tooltip />
                        <Line
                          type="monotone"
                          name="Nausea"
                          dataKey="nausea"
                          stroke={CHART.evaluate}
                          strokeWidth={2}
                          dot={{ r: 3, fill: CHART.evaluate }}
                        />
                        <Line
                          type="monotone"
                          name="Constipation"
                          dataKey="constipation"
                          stroke={CHART.clinical}
                          strokeWidth={2}
                          dot={{ r: 3, fill: CHART.clinical }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </ChartShell>
              </motion.div>
            )}
            {tab === "adherence" && (
              <motion.div
                key="adherence"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <AdherencePanel planEaten={planEaten} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.a
          href="/p/symptoms"
          className="rounded-2xl border border-[var(--measured-border)] bg-white px-4 py-3 text-center text-[13px] font-semibold text-[var(--measured-dark-green)] hover:bg-[var(--measured-cream)]"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          Quick symptom check
        </motion.a>
      </div>
    </>
  );
}

function StatPill({
  label,
  value,
  status,
  lower,
}: {
  label: string;
  value: string;
  status: "good" | "watch" | "high";
  lower?: boolean;
}) {
  const TrendIcon =
    status === "good"
      ? lower
        ? TrendingDown
        : TrendingUp
      : status === "watch"
        ? Minus
        : lower
          ? TrendingUp
          : TrendingDown;
  const tone = {
    good: "text-[var(--measured-dark-green)] bg-[var(--measured-green)]/8",
    watch:
      "text-[var(--measured-clinical-amber)] bg-[var(--measured-clinical-amber)]/10",
    high: "text-[var(--measured-evaluate)] bg-[var(--measured-evaluate)]/8",
  }[status];
  const iconColor = {
    good: "text-[var(--measured-dark-green)]",
    watch: "text-[var(--measured-clinical-amber)]",
    high: "text-[var(--measured-evaluate)]",
  }[status];
  return (
    <motion.div
      variants={pillItem}
      className={`flex flex-col items-center gap-1 rounded-2xl px-3 py-3 ${tone}`}
    >
      <div className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
        {label}
      </div>
      <div className="tnum font-serif text-[18px] leading-none">{value}</div>
      <TrendIcon
        size={11}
        strokeWidth={2.4}
        className={iconColor}
        aria-hidden="true"
      />
    </motion.div>
  );
}

function ChartShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2">
        <div className="font-serif text-[18px] text-[var(--measured-dark)]">
          {title}
        </div>
        {subtitle && (
          <div className="text-[12px] text-[var(--measured-subtext)]">
            {subtitle}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function AdherencePanel({ planEaten }: { planEaten: Record<string, true> }) {
  const allMealTypes: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

  const weekTotals = WEEK_DAYS.reduce(
    (acc, date, idx) => {
      const meals = ASHA_PLAN.dayItems?.[idx] ?? ASHA_PLAN.items;
      acc.planned += meals.length;
      acc.eaten += meals.filter(
        (m) => !!planEaten[`${date.toDateString()}-${m.mealType}`],
      ).length;
      return acc;
    },
    { planned: 0, eaten: 0 },
  );

  const pct =
    weekTotals.planned > 0
      ? Math.round((weekTotals.eaten / weekTotals.planned) * 100)
      : 0;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="font-serif text-[18px] text-[var(--measured-dark)]">
          Plan adherence
        </div>
        <div className="tnum text-[13px] font-semibold text-[var(--measured-dark-green)]">
          {pct}%
        </div>
      </div>

      {weekTotals.eaten === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <span className="text-[40px]" aria-hidden="true">
            📋
          </span>
          <p className="font-serif text-[17px] text-[var(--measured-dark)]">
            Nothing tracked yet
          </p>
          <p className="max-w-[220px] text-[12px] leading-relaxed text-[var(--measured-subtext)]">
            Mark meals eaten on the Plan tab and your weekly grid will appear
            here.
          </p>
          <Link
            href="/p/plan"
            className="mt-1 rounded-xl bg-[var(--measured-green)] px-4 py-2 text-[12px] font-semibold text-white"
          >
            Open Plan
          </Link>
        </div>
      ) : (
        <>
          {/* Progress bar */}
          <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-[var(--measured-cream)]">
            <motion.div
              className="h-full rounded-full bg-[var(--measured-green)]"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          {/* 7-day × 4-meal grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-center text-[11px]">
              <thead>
                <tr>
                  <th className="w-8 pb-2 text-[var(--measured-subtext)]" />
                  {WEEK_DAYS.map((date, idx) => (
                    <th
                      key={idx}
                      className="pb-2 font-semibold text-[var(--measured-subtext)]"
                    >
                      {DAY_SHORT[idx]}
                      <br />
                      <span className="font-normal">{date.getDate()}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allMealTypes.map((meal) => (
                  <tr key={meal}>
                    <td className="py-1 pr-2 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
                      {MEAL_SHORT[meal]}
                    </td>
                    {WEEK_DAYS.map((date, idx) => {
                      const dayMeals =
                        ASHA_PLAN.dayItems?.[idx] ?? ASHA_PLAN.items;
                      const hasMeal = dayMeals.some((m) => m.mealType === meal);
                      const eaten =
                        hasMeal &&
                        !!planEaten[`${date.toDateString()}-${meal}`];
                      return (
                        <td key={idx} className="py-1">
                          {hasMeal ? (
                            <span
                              className={cn(
                                "mx-auto flex h-5 w-5 items-center justify-center rounded-full",
                                eaten
                                  ? "bg-[var(--measured-green)]"
                                  : "border border-[var(--measured-border)] bg-white",
                              )}
                            >
                              {eaten && (
                                <Check
                                  size={10}
                                  strokeWidth={2.5}
                                  className="text-white"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          ) : (
                            <span className="mx-auto block h-5 w-5" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-[12px] leading-relaxed text-[var(--measured-subtext)]">
            <span className="tnum">{weekTotals.eaten}</span> of{" "}
            <span className="tnum">{weekTotals.planned}</span> planned meals
            eaten this week. Maya can see this when reviewing your next
            check-in.
          </p>
        </>
      )}
    </div>
  );
}
