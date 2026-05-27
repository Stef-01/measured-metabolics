"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCheck, Check, ChevronRight, Sparkles } from "lucide-react";
import { PatientAppHeader } from "@/components/patient/app-header";
import { ASHA_PLAN, RECIPES, CURRENT_PATIENT_ID } from "@/lib/mock";
import { mealImageBySlug } from "@/lib/images";
import type { MealType } from "@/lib/mock/types";
import { cn } from "@/lib/utils/cn";
import { useStoredPlanEaten, patientStore } from "@/lib/storage/patient-store";

const MEAL_LABEL: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
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

function todayDayIdx(): number {
  const dow = new Date().getDay();
  return dow === 0 ? 6 : dow - 1;
}

/** Computed once at module load — stable reference, no render-phase Date calls. */
const WEEK_DAYS = getWeekDays();
const TODAY_IDX = todayDayIdx();

/** localStorage key identifying a specific meal on a specific calendar date. */
function eatenKey(date: Date, mealType: MealType): string {
  return `${date.toDateString()}-${mealType}`;
}

function findRecipe(itemTitle: string) {
  const t = itemTitle.toLowerCase();
  return RECIPES.find(
    (r) =>
      r.title.toLowerCase() === t ||
      r.title
        .toLowerCase()
        .split(" ")
        .some((word) => word.length > 4 && t.includes(word)),
  );
}

export function PatientPlanScreen() {
  const [selectedDay, setSelectedDay] = useState(TODAY_IDX);

  const planEaten = useStoredPlanEaten(CURRENT_PATIENT_ID);

  const approvedAt = ASHA_PLAN.approvedByDietitianAt
    ? new Date(ASHA_PLAN.approvedByDietitianAt).toLocaleDateString([], {
        month: "short",
        day: "numeric",
      })
    : null;

  const dayMeals = ASHA_PLAN.dayItems?.[selectedDay] ?? ASHA_PLAN.items;
  const selectedDate = WEEK_DAYS[selectedDay];
  const isToday = selectedDay === TODAY_IDX;

  const toggleEaten = (dayIdx: number, meal: MealType) => {
    patientStore.togglePlanEaten(
      CURRENT_PATIENT_ID,
      eatenKey(WEEK_DAYS[dayIdx], meal),
    );
  };

  const isDayMealEaten = (dayIdx: number, meal: MealType) =>
    !!planEaten[eatenKey(WEEK_DAYS[dayIdx], meal)];

  const dayEatenCount = dayMeals.filter((it) =>
    isDayMealEaten(selectedDay, it.mealType),
  ).length;

  // Weekly adherence across all 7 days
  const weekTotals = WEEK_DAYS.reduce(
    (acc, date, idx) => {
      const meals = ASHA_PLAN.dayItems?.[idx] ?? ASHA_PLAN.items;
      acc.planned += meals.length;
      acc.eaten += meals.filter(
        (m) => !!planEaten[eatenKey(date, m.mealType)],
      ).length;
      return acc;
    },
    { planned: 0, eaten: 0 },
  );

  return (
    <>
      <PatientAppHeader
        eyebrow={
          approvedAt ? `Approved ${approvedAt} · Maya Singh, APD` : "Draft"
        }
        title="Weekly plan"
      />

      {/* Weekly adherence bar — only shown once at least one meal is marked eaten */}
      {weekTotals.eaten > 0 && (
        <div className="border-b border-[var(--measured-border-soft)] bg-[var(--measured-cream)]">
          <div className="mx-auto max-w-md px-5 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-[12px] text-[var(--measured-subtext)]">
                <span className="font-semibold text-[var(--measured-dark)]">
                  {weekTotals.eaten}
                </span>{" "}
                of {weekTotals.planned} meals eaten this week
              </div>
              <div className="text-[12px] font-semibold text-[var(--measured-dark-green)]">
                {Math.round((weekTotals.eaten / weekTotals.planned) * 100)}%
              </div>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/60">
              <div
                className="h-full rounded-full bg-[var(--measured-green)] transition-all duration-500"
                style={{
                  width: `${(weekTotals.eaten / weekTotals.planned) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Day selector strip */}
      <div className="border-b border-[var(--measured-border-soft)] bg-white">
        <div className="mx-auto max-w-md px-4">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {DAY_SHORT.map((label, idx) => {
              const date = WEEK_DAYS[idx];
              const isDayToday = idx === TODAY_IDX;
              const isSelected = idx === selectedDay;
              const meals = ASHA_PLAN.dayItems?.[idx] ?? ASHA_PLAN.items;
              const dayEaten = meals.filter(
                (m) => !!planEaten[eatenKey(WEEK_DAYS[idx], m.mealType)],
              ).length;
              const allEaten = dayEaten === meals.length && dayEaten > 0;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setSelectedDay(idx)}
                  className={cn(
                    "relative flex min-w-[44px] flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-center transition-colors",
                    isSelected
                      ? "bg-[var(--measured-green)] text-white"
                      : isDayToday
                        ? "bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]"
                        : "text-[var(--measured-subtext)] hover:bg-[var(--measured-cream)]",
                  )}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wider">
                    {label}
                  </span>
                  <span
                    className={cn(
                      "text-[14px] font-semibold leading-none",
                      isSelected
                        ? "text-white"
                        : isDayToday
                          ? "text-[var(--measured-dark-green)]"
                          : "text-[var(--measured-dark)]",
                    )}
                  >
                    {date.getDate()}
                  </span>
                  {/* Eaten indicator: solid = all eaten, faded = partial */}
                  <span
                    className={cn(
                      "mt-0.5 h-1 w-1 rounded-full",
                      allEaten
                        ? isSelected
                          ? "bg-white"
                          : "bg-[var(--measured-green)]"
                        : dayEaten > 0
                          ? isSelected
                            ? "bg-white/50"
                            : "bg-[var(--measured-green)]/40"
                          : "bg-transparent",
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-md flex-col gap-3 px-5 pt-3 pb-8">
        {/* Day complete celebration */}
        <AnimatePresence>
          {dayEatenCount === dayMeals.length && dayMeals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="flex items-center gap-3 rounded-2xl bg-[var(--measured-green)] px-4 py-3 text-white shadow-[0_4px_16px_-4px_rgba(45,90,61,0.4)]"
            >
              <CheckCheck size={20} strokeWidth={2.2} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold">Day complete!</div>
                <div className="text-[11px] text-white/80">
                  All {dayMeals.length} meals eaten · great work
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Day header */}
        <div className="flex items-center justify-between pt-1">
          <div className="text-[13px] font-medium text-[var(--measured-dark)]">
            {isToday
              ? `Today · ${selectedDate.toLocaleDateString([], { month: "long", day: "numeric" })}`
              : selectedDate.toLocaleDateString([], {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
          </div>
          {dayEatenCount > 0 && dayEatenCount < dayMeals.length && (
            <div className="flex items-center gap-1 text-[12px] font-semibold text-[var(--measured-dark-green)]">
              <CheckCheck size={14} strokeWidth={2.2} aria-hidden="true" />
              {dayEatenCount}/{dayMeals.length} eaten
            </div>
          )}
        </div>

        {/* Meal cards — slide when day changes */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3"
          >
            {dayMeals.map((item) => {
              const recipe = findRecipe(item.title);
              const isEaten = isDayMealEaten(selectedDay, item.mealType);
              return (
                <div key={item.mealType} className="relative">
                  <Link
                    href={recipe ? `/p/plan/${recipe.id}` : "/p/plan"}
                    className={cn(
                      "group block rounded-2xl border bg-white p-4 pb-10 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-raised)]",
                      isEaten
                        ? "border-[var(--measured-green)]/30"
                        : "border-[var(--measured-border-soft)]",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[var(--measured-cream)]">
                        <Image
                          src={mealImageBySlug(
                            recipe?.id ?? item.title.toLowerCase(),
                          )}
                          alt=""
                          fill
                          sizes="64px"
                          className={cn(
                            "object-cover",
                            isEaten && "opacity-50",
                          )}
                        />
                        <AnimatePresence>
                          {isEaten && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.7 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.7 }}
                              transition={{
                                type: "spring",
                                stiffness: 480,
                                damping: 28,
                              }}
                              className="absolute inset-0 flex items-center justify-center rounded-xl bg-[var(--measured-green)]/50"
                            >
                              <Check
                                size={22}
                                strokeWidth={2.5}
                                className="text-white"
                                aria-hidden="true"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
                            {MEAL_LABEL[item.mealType]}
                          </div>
                          <ChevronRight
                            size={16}
                            className="text-[var(--measured-subtext)] transition-transform group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </div>
                        <div
                          className={cn(
                            "mt-0.5 text-[15px] font-semibold",
                            isEaten
                              ? "text-[var(--measured-subtext)] line-through"
                              : "text-[var(--measured-dark)]",
                          )}
                        >
                          {item.title}
                        </div>
                        <p className="mt-1 text-[13px] leading-relaxed text-[var(--measured-subtext)]">
                          {item.description}
                        </p>
                        {item.rationale && !isEaten && (
                          <div className="mt-2 flex items-start gap-1.5 rounded-xl bg-[var(--measured-green)]/5 px-3 py-2">
                            <Sparkles
                              size={11}
                              strokeWidth={2.2}
                              className="mt-0.5 shrink-0 text-[var(--measured-dark-green)]"
                              aria-hidden="true"
                            />
                            <p className="text-[12px] italic leading-relaxed text-[var(--measured-dark)]">
                              {item.rationale}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                  <motion.button
                    type="button"
                    onClick={() => toggleEaten(selectedDay, item.mealType)}
                    aria-label={
                      isEaten
                        ? `Unmark ${item.mealType} as eaten`
                        : `Mark ${item.mealType} as eaten`
                    }
                    whileTap={{ scale: 0.88 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={cn(
                      "absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors",
                      isEaten
                        ? "bg-[var(--measured-green)]/15 text-[var(--measured-dark-green)] hover:bg-[var(--measured-evaluate)]/10 hover:text-[var(--measured-evaluate)]"
                        : "bg-[var(--measured-cream)] text-[var(--measured-subtext)] hover:bg-[var(--measured-green)]/10 hover:text-[var(--measured-dark-green)]",
                    )}
                  >
                    <Check size={11} strokeWidth={2.5} aria-hidden="true" />
                    {isEaten ? "Eaten" : "Mark eaten"}
                  </motion.button>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
