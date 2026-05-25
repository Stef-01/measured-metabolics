"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Activity,
  CalendarDays,
  MessageCircle,
  ChevronRight,
  Sparkles,
  X,
  Flame,
} from "lucide-react";
import { PatientAppHeader } from "@/components/patient/app-header";
import { EscalationCard } from "@/components/patient/escalation-card";
import { DietitianNotesCard } from "@/components/patient/dietitian-notes-card";
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

  useSeedPatientStore(me.id, {
    meals: MEALS.filter((m) => m.patientId === me.id),
    symptoms: SYMPTOMS.filter((s) => s.patientId === me.id),
    thread: THREADS.find((t) => t.patientId === me.id)?.messages ?? [],
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
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-between gap-3 rounded-2xl border border-[var(--measured-green)]/25 bg-[var(--measured-green)]/10 px-4 py-3"
          >
            <div className="flex items-start gap-2">
              <Sparkles
                size={15}
                strokeWidth={2.2}
                className="mt-0.5 shrink-0 text-[var(--measured-dark-green)]"
                aria-hidden="true"
              />
              <div>
                <div className="text-[13px] font-semibold text-[var(--measured-dark-green)]">
                  New plan from Maya
                </div>
                <p className="text-[12px] leading-relaxed text-[var(--measured-subtext)]">
                  Your meal plan was updated. See what&apos;s new below.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPlanBannerDismissed(true)}
              aria-label="Dismiss plan notification"
              className="shrink-0 text-[var(--measured-subtext)] hover:text-[var(--measured-dark)]"
            >
              <X size={14} strokeWidth={2.2} aria-hidden="true" />
            </button>
          </motion.div>
        )}

        <DietitianNotesCard patientId={me.id} />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-3xl bg-[var(--measured-green)] p-5 text-white shadow-[0_4px_20px_-4px_rgba(45,90,61,0.35)]"
        >
          {/* Decorative circle */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/8"
          />
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
                Today · {todayLogged}/{todayPlan.length} logged
              </div>
              <div className="mt-1 font-serif text-[24px] leading-tight">
                {nextMeal !== null ? "Log your next meal" : "All meals logged!"}
              </div>
            </div>
            {streak > 0 && (
              <div className="flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-2.5 py-1">
                <Flame size={13} strokeWidth={2.2} aria-hidden="true" />
                <span className="text-[12px] font-bold">{streak}d</span>
              </div>
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
                    i < todayLogged ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)",
                }}
                title={item.mealType}
              />
            ))}
          </div>

          <Link
            href="/p/meal"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-[15px] font-semibold text-[var(--measured-dark-green)] shadow-sm transition-opacity hover:opacity-90"
          >
            <Camera size={20} strokeWidth={2.2} aria-hidden="true" />
            Open camera
          </Link>
        </motion.div>

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

        <Link
          href="/p/metrics"
          className="group block rounded-2xl border border-[var(--measured-border-soft)] bg-white p-4 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-raised)]"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--measured-clinical-blue)]/10 text-[var(--measured-clinical-blue)]">
                <Activity size={18} strokeWidth={2} aria-hidden="true" />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-[var(--measured-dark)]">
                  Glucose this week
                </div>
                <div className="text-[12px] text-[var(--measured-subtext)]">
                  {me.timeInRangePct}% in range · {meals.length} meals logged
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
                <div className={unreadFromMaya > 0 ? "text-[13px] font-bold text-[var(--measured-dark)]" : "text-[13px] font-semibold text-[var(--measured-dark)]"}>
                  Maya · APD
                </div>
                <ChevronRight
                  size={16}
                  className="text-[var(--measured-subtext)] transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </div>
              <p className={`mt-0.5 line-clamp-2 text-[12px] leading-relaxed ${unreadFromMaya > 0 ? "font-medium text-[var(--measured-dark)]" : "text-[var(--measured-subtext)]"}`}>
                {lastDietitianMsg?.body ??
                  "Maya will message after your next review."}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
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
