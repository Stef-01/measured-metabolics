"use client";

import Link from "next/link";
import { useMemo, useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import {
  Camera,
  Activity,
  CalendarDays,
  MessageCircle,
  ChevronRight,
  X,
  Flame,
} from "lucide-react";
import { CHART } from "@/lib/chart-tokens";
import { PatientAppHeader } from "@/components/patient/app-header";
import { EscalationCard } from "@/components/patient/escalation-card";
import { DietitianNotesCard } from "@/components/patient/dietitian-notes-card";
import { MealIdeasCard } from "@/components/patient/meal-ideas-card";
import {
  useSeedPatientStore,
  useStoredMeals,
  useStoredSymptoms,
  useStoredThread,
} from "@/lib/storage/patient-store";
import {
  PATIENTS,
  ASHA_PLAN,
  MEALS,
  THREADS,
  SYMPTOMS,
  CURRENT_PATIENT_ID,
  CGM_BY_PATIENT,
} from "@/lib/mock";
import type { MealType, MealLog } from "@/lib/mock/types";

const MEAL_LABEL: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

// Evaluated once at module load; ASHA_PLAN.approvedByDietitianAt is stable.
const PLAN_APPROVED_RECENTLY = (() => {
  const at = ASHA_PLAN.approvedByDietitianAt;
  if (!at) return false;
  return Date.now() - new Date(at).getTime() < 48 * 3600 * 1000;
})();

export function PatientHomeScreen() {
  const me = PATIENTS.find((p) => p.id === CURRENT_PATIENT_ID)!;
  const [planBannerDismissed, setPlanBannerDismissed] = useState(false);

  // Stable references so the seed/reconcile effect doesn't re-run every render.
  const seedMeals = useMemo(
    () => MEALS.filter((m) => m.patientId === me.id),
    [me.id],
  );
  const seedSymptoms = useMemo(
    () => SYMPTOMS.filter((s) => s.patientId === me.id),
    [me.id],
  );
  const seedThread = useMemo(
    () => THREADS.find((t) => t.patientId === me.id)?.messages ?? [],
    [me.id],
  );
  useSeedPatientStore(me.id, {
    meals: seedMeals,
    symptoms: seedSymptoms,
    thread: seedThread,
  });

  const meals = useStoredMeals(me.id);
  const symptoms = useStoredSymptoms(me.id);
  const thread = useStoredThread(me.id);

  const lastSymptom = symptoms[0];
  const escalate =
    lastSymptom &&
    (lastSymptom.nausea === "severe" ||
      lastSymptom.constipation === "severe" ||
      lastSymptom.hypoSymptoms);

  const lastDietitianMsg = [...thread]
    .reverse()
    .find((m) => m.fromRole === "dietitian");
  const unreadFromMaya = thread.filter(
    (m) => m.fromRole === "dietitian" && !m.read,
  ).length;

  const nextMeal = nextMealForToday(meals);
  const streak = computeStreak(meals);

  const todayDow = new Date().getDay();
  const todayIdx = todayDow === 0 ? 6 : todayDow - 1;
  const todayPlan = ASHA_PLAN.dayItems?.[todayIdx] ?? ASHA_PLAN.items;
  const todayStr = new Date().toDateString();
  const todayLogged = meals.filter(
    (m) => new Date(m.eatenAt).toDateString() === todayStr,
  ).length;

  const showNewPlanBanner = PLAN_APPROVED_RECENTLY && !planBannerDismissed;

  return (
    <>
      <PatientAppHeader
        eyebrow={`Week ${me.weekNumber} · Maya Singh, APD`}
        title={`Hi ${me.firstName.split(" ")[0]}`}
      />

      <div className="mx-auto flex max-w-md flex-col gap-4 px-5 pt-4 pb-8">
        {escalate && (
          <EscalationCard
            dietitianName="Maya"
            reason="You logged severe nausea recently. A quick note to Maya helps her adjust your plan."
            href="/p/messages"
            cta="Open thread"
          />
        )}

        {showNewPlanBanner && (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--measured-green)]/25 bg-[var(--measured-green)]/8 px-4 py-3">
            <p className="text-[13px] text-[var(--measured-dark-green)]">
              Maya updated your meal plan.
            </p>
            <button
              type="button"
              onClick={() => setPlanBannerDismissed(true)}
              aria-label="Dismiss plan notification"
              className="shrink-0 text-[var(--measured-subtext)] hover:text-[var(--measured-dark)]"
            >
              <X size={14} strokeWidth={2.2} aria-hidden="true" />
            </button>
          </div>
        )}

        <DietitianNotesCard patientId={me.id} />

        <MealIdeasCard patientId={me.id} dietitianName="Maya" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden rounded-3xl bg-[var(--measured-green)] p-5 text-white shadow-[0_4px_20px_-4px_rgba(45,90,61,0.35)]"
          style={{ originY: 0.5 }}
        >
          {/* Decorative circle */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/8"
          />
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
                <span className="tnum">
                  Today · {todayLogged}/{todayPlan.length}
                </span>{" "}
                logged
              </div>
              <div className="mt-1 font-serif text-[24px] leading-tight">
                {nextMeal !== null ? "Log your next meal" : "All meals logged!"}
              </div>
            </div>
            {streak > 0 && (
              <motion.div
                className="flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-2.5 py-1"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 18,
                  delay: 0.2,
                }}
              >
                <motion.span
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                >
                  <Flame size={13} strokeWidth={2.2} aria-hidden="true" />
                </motion.span>
                <span
                  className="tnum text-[12px] font-bold"
                  aria-label={`${streak} day streak`}
                >
                  <AnimatedCount target={streak} />d
                </span>
              </motion.div>
            )}
          </div>

          {/* Meal progress dots */}
          <div className="mt-3 flex gap-1.5">
            {todayPlan.map((item, i) => (
              <div
                key={item.mealType}
                className="h-1.5 flex-1 rounded-full"
                style={{
                  backgroundColor:
                    i < todayLogged
                      ? "rgba(255,255,255,0.9)"
                      : "rgba(255,255,255,0.25)",
                }}
                title={item.mealType}
              />
            ))}
          </div>

          <Link
            href="/p/meal"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-[15px] font-semibold text-[var(--measured-dark-green)] shadow-[var(--shadow-card)] transition-opacity hover:opacity-90"
          >
            <Camera size={20} strokeWidth={2.2} aria-hidden="true" />
            Open camera
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            href="/p/plan"
            className="group block rounded-2xl border border-[var(--measured-border-soft)] bg-white p-4 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-raised)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]">
                  <CalendarDays size={18} strokeWidth={2} aria-hidden="true" />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-[var(--measured-dark)]">
                    Today&apos;s plan
                  </div>
                  <div className="text-[12px] text-[var(--measured-subtext)]">
                    {nextMeal !== null
                      ? (() => {
                          const todayDow = new Date().getDay();
                          const todayIdx = todayDow === 0 ? 6 : todayDow - 1;
                          const todayItems =
                            ASHA_PLAN.dayItems?.[todayIdx] ?? ASHA_PLAN.items;
                          const item = todayItems[nextMeal];
                          return item
                            ? `Up next: ${MEAL_LABEL[item.mealType]} · ${item.title}`
                            : "All meals logged today";
                        })()
                      : "All meals logged today"}
                  </div>
                </div>
              </div>
              <ChevronRight
                size={18}
                className="text-[var(--measured-subtext)] transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1], delay: 0.14 }}
          whileTap={{ scale: 0.98 }}
        >
          <GlucoseSparkCard
            patientId={me.id}
            tir={me.timeInRangePct}
            mealCount={meals.length}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            href="/p/messages"
            className="group block rounded-2xl border border-[var(--measured-border-soft)] bg-white p-4 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-raised)]"
          >
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--measured-gold)]/15 text-[#a07710]">
                  <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
                </div>
                {unreadFromMaya > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--measured-evaluate)] text-[8px] font-bold text-white ring-2 ring-white">
                    {unreadFromMaya > 9 ? "9+" : unreadFromMaya}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div
                    className={
                      unreadFromMaya > 0
                        ? "text-[13px] font-bold text-[var(--measured-dark)]"
                        : "text-[13px] font-semibold text-[var(--measured-dark)]"
                    }
                  >
                    Maya · APD
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-[var(--measured-subtext)] transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </div>
                <p
                  className={`mt-0.5 line-clamp-2 text-[12px] leading-relaxed ${unreadFromMaya > 0 ? "font-medium text-[var(--measured-dark)]" : "text-[var(--measured-subtext)]"}`}
                >
                  {lastDietitianMsg?.body ??
                    "Maya will message after your next review."}
                </p>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </>
  );
}

function GlucoseSparkCard({
  patientId,
  tir,
  mealCount,
}: {
  patientId: string;
  tir: number;
  mealCount: number;
}) {
  const cgm = CGM_BY_PATIENT[patientId];
  const sparkData = useMemo(() => {
    if (!cgm) return [];
    return cgm.readings.slice(-48).map((r) => ({
      mmolL: r.mmolL,
      inRange: r.mmolL >= 3.9 && r.mmolL <= 10,
    }));
  }, [cgm]);

  const tirColor =
    tir >= 70 ? CHART.green : tir >= 55 ? "#b97e12" : CHART.evaluate;

  return (
    <Link
      href="/p/metrics"
      className="group block overflow-hidden rounded-2xl border border-[var(--measured-border-soft)] bg-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-raised)]"
    >
      <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--measured-clinical-blue)]/10 text-[var(--measured-clinical-blue)]">
            <Activity size={18} strokeWidth={2} aria-hidden="true" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-[var(--measured-dark)]">
              Glucose this week
            </div>
            <div className="text-[12px] text-[var(--measured-subtext)]">
              <span style={{ color: tirColor }} className="tnum font-semibold">
                {tir}% in range
              </span>{" "}
              · <span className="tnum">{mealCount}</span> meals logged
            </div>
          </div>
        </div>
        <ChevronRight
          size={18}
          className="text-[var(--measured-subtext)] transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
      {sparkData.length > 0 && (
        <div className="h-[52px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={sparkData}
              margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={CHART.green}
                    stopOpacity={0.25}
                  />
                  <stop
                    offset="100%"
                    stopColor={CHART.green}
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="mmolL"
                stroke={CHART.green}
                strokeWidth={1.5}
                fill="url(#spark-grad)"
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Link>
  );
}

function AnimatedCount({ target }: { target: number }) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    if (reduceMotion) return;
    const start = performance.now();
    const dur = 600;
    function tick(now: number) {
      const t = Math.min((now - start) / dur, 1);
      setDisplay(Math.round((1 - Math.pow(1 - t, 3)) * target));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, reduceMotion]);
  return <>{reduceMotion ? target : display}</>;
}

function computeStreak(meals: MealLog[]): number {
  if (meals.length === 0) return 0;
  const loggedDays = new Set(
    meals.map((m) => new Date(m.eatenAt).toDateString()),
  );
  let count = 0;
  const d = new Date();
  // start from today if logged, else yesterday
  if (!loggedDays.has(d.toDateString())) d.setDate(d.getDate() - 1);
  while (loggedDays.has(d.toDateString())) {
    count++;
    d.setDate(d.getDate() - 1);
    if (count > 365) break;
  }
  return count;
}

function nextMealForToday(meals: MealLog[]): number | null {
  const todayStr = new Date().toDateString();
  const todayDow = new Date().getDay();
  const todayIdx = todayDow === 0 ? 6 : todayDow - 1;
  const todayItems = ASHA_PLAN.dayItems?.[todayIdx] ?? ASHA_PLAN.items;
  const todayCount = meals.filter(
    (m) => new Date(m.eatenAt).toDateString() === todayStr,
  ).length;
  if (todayCount >= todayItems.length) return null;
  return todayCount;
}
