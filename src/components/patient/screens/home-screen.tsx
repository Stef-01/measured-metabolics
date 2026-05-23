"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Camera,
  Activity,
  CalendarDays,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { PatientAppHeader } from "@/components/patient/app-header";
import { EscalationCard } from "@/components/patient/escalation-card";
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
import type { MealType } from "@/lib/mock/types";

const MEAL_LABEL: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

export function PatientHomeScreen() {
  const me = PATIENTS.find((p) => p.id === CURRENT_PATIENT_ID)!;

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

  const nextMeal = nextMealForToday(meals.length);

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

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="surface-raised relative overflow-hidden p-5"
        >
          <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--measured-subtext)]">
            Single action
          </div>
          <div className="mt-1 font-serif text-[24px] leading-tight text-[var(--measured-dark)]">
            Snap your next meal
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-[var(--measured-subtext)]">
            One photo. We&apos;ll log it for Maya to review.
          </p>
          <Link
            href="/p/meal"
            className="cta-shadow mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--measured-green)] px-5 py-4 font-semibold text-white"
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
                    ? `${MEAL_LABEL[ASHA_PLAN.items[nextMeal].mealType]} · ${ASHA_PLAN.items[nextMeal].title}`
                    : "All meals logged"}
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
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--measured-gold)]/15 text-[#a07710]">
              <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-semibold text-[var(--measured-dark)]">
                  Maya · APD
                </div>
                <ChevronRight
                  size={16}
                  className="text-[var(--measured-subtext)] transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-0.5 line-clamp-2 text-[12px] leading-relaxed text-[var(--measured-subtext)]">
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

function nextMealForToday(loggedToday: number): number | null {
  // Simple heuristic for the vibe stage: index of next plan slot based on
  // how many meals were already logged today (capped at the 4 plan items).
  if (loggedToday >= ASHA_PLAN.items.length) return null;
  return loggedToday;
}
