"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCheck, Check, ChevronRight } from "lucide-react";
import { PatientAppHeader } from "@/components/patient/app-header";
import { ASHA_PLAN, RECIPES } from "@/lib/mock";
import { mealImageBySlug } from "@/lib/images";
import type { MealType } from "@/lib/mock/types";
import { cn } from "@/lib/utils/cn";

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
  const weekDays = getWeekDays();
  const [selectedDay, setSelectedDay] = useState(todayDayIdx());
  const [eaten, setEaten] = useState<Set<string>>(new Set());

  const approvedAt = ASHA_PLAN.approvedByDietitianAt
    ? new Date(ASHA_PLAN.approvedByDietitianAt).toLocaleDateString([], {
        month: "short",
        day: "numeric",
      })
    : null;

  const toggleEaten = (dayIdx: number, mealType: MealType) => {
    setEaten((prev) => {
      const next = new Set(prev);
      const key = `${dayIdx}-${mealType}`;
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const dayEatenCount = ASHA_PLAN.items.filter((it) =>
    eaten.has(`${selectedDay}-${it.mealType}`),
  ).length;

  const selectedDate = weekDays[selectedDay];
  const isToday = selectedDay === todayDayIdx();

  return (
    <>
      <PatientAppHeader
        eyebrow={
          approvedAt ? `Approved ${approvedAt} · Maya Singh, APD` : "Draft"
        }
        title="Weekly plan"
      />

      {/* Day selector strip */}
      <div className="border-b border-[var(--measured-border-soft)] bg-white">
        <div className="mx-auto max-w-md px-4">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {DAY_SHORT.map((label, idx) => {
              const date = weekDays[idx];
              const isDayToday = idx === todayDayIdx();
              const isSelected = idx === selectedDay;
              const dayEaten = ASHA_PLAN.items.filter((it) =>
                eaten.has(`${idx}-${it.mealType}`),
              ).length;
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
                  {/* Eaten indicator dot */}
                  <span
                    className={cn(
                      "mt-0.5 h-1 w-1 rounded-full",
                      dayEaten > 0
                        ? isSelected
                          ? "bg-white/70"
                          : "bg-[var(--measured-green)]"
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
          {dayEatenCount > 0 && (
            <div className="flex items-center gap-1 text-[12px] font-semibold text-[var(--measured-dark-green)]">
              <CheckCheck size={14} strokeWidth={2.2} aria-hidden="true" />
              {dayEatenCount}/{ASHA_PLAN.items.length} eaten
            </div>
          )}
        </div>

        {ASHA_PLAN.items.map((item) => {
          const recipe = findRecipe(item.title);
          const isEaten = eaten.has(`${selectedDay}-${item.mealType}`);
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
                      className={cn("object-cover", isEaten && "opacity-50")}
                    />
                    {isEaten && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-[var(--measured-green)]/50">
                        <Check
                          size={22}
                          strokeWidth={2.5}
                          className="text-white"
                          aria-hidden="true"
                        />
                      </div>
                    )}
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
                      <p className="mt-2 rounded-lg bg-[var(--measured-cream)] px-3 py-2 text-[12px] italic leading-relaxed text-[var(--measured-dark)]">
                        Why: {item.rationale}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => toggleEaten(selectedDay, item.mealType)}
                aria-label={
                  isEaten
                    ? `Unmark ${item.mealType} as eaten`
                    : `Mark ${item.mealType} as eaten`
                }
                className={cn(
                  "absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors",
                  isEaten
                    ? "bg-[var(--measured-green)]/15 text-[var(--measured-dark-green)] hover:bg-[var(--measured-evaluate)]/10 hover:text-[var(--measured-evaluate)]"
                    : "bg-[var(--measured-cream)] text-[var(--measured-subtext)] hover:bg-[var(--measured-green)]/10 hover:text-[var(--measured-dark-green)]",
                )}
              >
                <Check size={11} strokeWidth={2.5} aria-hidden="true" />
                {isEaten ? "Eaten" : "Mark eaten"}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
