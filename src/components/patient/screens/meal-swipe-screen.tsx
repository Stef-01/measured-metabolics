"use client";

import { useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  AnimatePresence,
} from "framer-motion";
import type { PanInfo } from "framer-motion";
import { Check, X, RefreshCw, Camera, Leaf } from "lucide-react";
import { PatientAppHeader } from "@/components/patient/app-header";
import {
  MEAL_SUGGESTIONS,
  type MealSuggestion,
} from "@/lib/mock/meal-suggestions";

const SWIPE_THRESHOLD = 80;
const VELOCITY_THRESHOLD = 350;

const MACRO_LABELS: Record<string, string> = {
  low: "Low",
  moderate: "Mod",
  high: "High",
};

function MacroPill({
  label,
  value,
}: {
  label: string;
  value: "low" | "moderate" | "high";
}) {
  return (
    <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
      {label}: {MACRO_LABELS[value]}
    </span>
  );
}

function DietitianTag({
  name,
  note,
}: {
  name: string;
  note: string | undefined;
}) {
  return (
    <motion.div
      className="absolute right-3 top-3 z-20 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/25 px-2.5 py-1.5 backdrop-blur-md"
      initial={{ opacity: 0, scale: 0.88, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.25, type: "spring", stiffness: 380, damping: 22 }}
    >
      <Leaf
        size={10}
        strokeWidth={2.5}
        className="text-emerald-300"
        aria-hidden="true"
      />
      <div>
        <div className="text-[9px] font-semibold uppercase tracking-wider text-white/90">
          {name}&apos;s pick
        </div>
        {note && (
          <div className="text-[8px] leading-tight text-white/55">{note}</div>
        )}
      </div>
    </motion.div>
  );
}

interface SwipeableCardProps {
  suggestion: MealSuggestion;
  onSwipe: (dir: "left" | "right") => void;
  isTop: boolean;
  offset: number;
  dietitianName: string;
}

function SwipeableCard({
  suggestion,
  onSwipe,
  isTop,
  offset,
  dietitianName,
}: SwipeableCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-22, 22]);
  const addOpacity = useTransform(x, [40, 130], [0, 1]);
  const skipOpacity = useTransform(x, [-130, -40], [1, 0]);

  async function handleDragEnd(_: PointerEvent, info: PanInfo) {
    if (
      info.offset.x > SWIPE_THRESHOLD ||
      info.velocity.x > VELOCITY_THRESHOLD
    ) {
      await animate(x, 900, {
        type: "spring",
        stiffness: 180,
        damping: 26,
        velocity: info.velocity.x,
      });
      onSwipe("right");
    } else if (
      info.offset.x < -SWIPE_THRESHOLD ||
      info.velocity.x < -VELOCITY_THRESHOLD
    ) {
      await animate(x, -900, {
        type: "spring",
        stiffness: 180,
        damping: 26,
        velocity: info.velocity.x,
      });
      onSwipe("left");
    } else {
      animate(x, 0, { type: "spring", stiffness: 420, damping: 32 });
    }
  }

  const scale = 1 - offset * 0.04;
  const yShift = offset * 12;

  return (
    <motion.div
      className="absolute inset-x-3 touch-none"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        scale,
        y: yShift,
        zIndex: 30 - offset * 10,
        transformOrigin: "50% 110%",
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.88}
      onDragEnd={isTop ? handleDragEnd : undefined}
    >
      <div
        className="relative select-none overflow-hidden rounded-[2.5rem] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.45)]"
        style={{
          height: "calc(100dvh - 13rem)",
          background: `linear-gradient(160deg, ${suggestion.gradientFrom} 0%, ${suggestion.gradientTo} 100%)`,
          cursor: isTop ? "grab" : "default",
        }}
      >
        {/* Dietitian pick badge */}
        {isTop && suggestion.dietitianPick && (
          <DietitianTag name={dietitianName} note={suggestion.dietitianNote} />
        )}

        {/* Swipe feedback overlays — only rendered on the top card */}
        {isTop && (
          <>
            <motion.div
              className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-[2.5rem] bg-emerald-600/60"
              style={{ opacity: addOpacity }}
            >
              <div className="flex flex-col items-center gap-3 text-white">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/80">
                  <Check size={32} strokeWidth={2.5} aria-hidden="true" />
                </div>
                <span className="text-[17px] font-bold tracking-wide">
                  Add to plan
                </span>
              </div>
            </motion.div>
            <motion.div
              className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-[2.5rem] bg-rose-700/55"
              style={{ opacity: skipOpacity }}
            >
              <div className="flex flex-col items-center gap-3 text-white">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/80">
                  <X size={32} strokeWidth={2.5} aria-hidden="true" />
                </div>
                <span className="text-[17px] font-bold tracking-wide">
                  Skip
                </span>
              </div>
            </motion.div>
          </>
        )}

        {/* Noise texture overlay for depth */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[2.5rem] opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Hero emoji */}
        <div className="flex h-[52%] items-center justify-center">
          <span
            className="select-none drop-shadow-2xl"
            style={{ fontSize: 100, lineHeight: 1 }}
            aria-hidden="true"
          >
            {suggestion.emoji}
          </span>
        </div>

        {/* Bottom info overlay */}
        <div
          className="absolute inset-x-0 bottom-0 px-6 pb-7 pt-16"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0) 100%)",
          }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">
            {suggestion.mealType}
            {suggestion.origin ? (
              <>
                <span className="mx-1.5 opacity-40">·</span>
                {suggestion.origin}
              </>
            ) : null}
          </p>
          <h2 className="mt-0.5 font-serif text-[30px] leading-tight tracking-tight text-white">
            {suggestion.name}
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-white/65">
            {suggestion.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <MacroPill label="Carbs" value={suggestion.macros.carbs} />
            <MacroPill label="Protein" value={suggestion.macros.protein} />
            <MacroPill label="Fibre" value={suggestion.macros.fibre} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function MealSwipeScreen({
  dietitianName = "Maya",
}: {
  dietitianName?: string;
}) {
  const [cards, setCards] = useState(MEAL_SUGGESTIONS);
  const [savedCount, setSavedCount] = useState(0);
  const done = cards.length === 0;

  function handleSwipe(id: string, dir: "left" | "right") {
    if (dir === "right") setSavedCount((n) => n + 1);
    setCards((c) => c.filter((card) => card.id !== id));
  }

  function programmaticSwipe(dir: "left" | "right") {
    if (cards.length === 0) return;
    handleSwipe(cards[0].id, dir);
  }

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ height: "calc(100dvh - 6rem)" }}
    >
      {/* Header */}
      <PatientAppHeader eyebrow="Meal ideas" title="What sounds good?" />

      {/* Card stack */}
      <div className="relative flex-1">
        <AnimatePresence>
          {done ? (
            <motion.div
              key="done"
              className="flex h-full flex-col items-center justify-center px-10 text-center"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <span
                className="select-none"
                style={{ fontSize: 64 }}
                aria-hidden="true"
              >
                🌿
              </span>
              <h2 className="mt-4 font-serif text-[26px] leading-tight tracking-tight text-[var(--measured-dark)]">
                {savedCount > 0
                  ? `${savedCount} idea${savedCount > 1 ? "s" : ""} saved`
                  : "All done for now"}
              </h2>
              <p className="mt-2.5 text-[14px] leading-relaxed text-[var(--measured-subtext)]">
                {savedCount > 0
                  ? `${dietitianName} will see these before your next session.`
                  : "Check back after your next session for new suggestions."}
              </p>
              <div className="mt-6 flex flex-col items-center gap-3">
                <motion.button
                  type="button"
                  onClick={() => {
                    setCards(MEAL_SUGGESTIONS);
                    setSavedCount(0);
                  }}
                  className="flex items-center gap-2 rounded-2xl bg-[var(--measured-green)] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_4px_14px_-4px_rgba(45,90,61,0.4)]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <RefreshCw size={14} strokeWidth={2.4} aria-hidden="true" />
                  See all again
                </motion.button>
                <Link
                  href="/p/meal/log"
                  className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--measured-subtext)] underline underline-offset-2"
                >
                  <Camera size={13} strokeWidth={2} aria-hidden="true" />
                  Log what I actually ate
                </Link>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Render cards back-to-front so front card sits on top in DOM */}
              {cards
                .slice(0, 3)
                .slice()
                .reverse()
                .map((card, revIdx) => {
                  const offset =
                    Math.min(cards.slice(0, 3).length - 1, 2) - revIdx;
                  return (
                    <SwipeableCard
                      key={card.id}
                      suggestion={card}
                      onSwipe={(dir) => handleSwipe(card.id, dir)}
                      isTop={offset === 0}
                      offset={offset}
                      dietitianName={dietitianName}
                    />
                  );
                })}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Action row */}
      {!done && (
        <div className="flex items-center justify-center gap-6 py-3">
          <motion.button
            type="button"
            aria-label="Skip this meal"
            onClick={() => programmaticSwipe("left")}
            className="flex h-[52px] w-[52px] items-center justify-center rounded-full border-2 border-[var(--measured-border)] bg-white shadow-[var(--shadow-card)]"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.88 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <X
              size={20}
              strokeWidth={2.5}
              className="text-[var(--measured-subtext)]"
              aria-hidden="true"
            />
          </motion.button>

          <Link
            href="/p/meal/log"
            className="flex items-center gap-1.5 rounded-2xl border border-[var(--measured-border-soft)] bg-white px-4 py-2.5 text-[12px] font-semibold text-[var(--measured-subtext)] shadow-[var(--shadow-card)] transition-colors hover:bg-[var(--measured-green)]/5 hover:text-[var(--measured-dark)]"
          >
            <Camera size={13} strokeWidth={2} aria-hidden="true" />
            Log a meal
          </Link>

          <motion.button
            type="button"
            aria-label="Add to meal plan"
            onClick={() => programmaticSwipe("right")}
            className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[var(--measured-green)] shadow-[0_4px_16px_-4px_rgba(45,90,61,0.45)]"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.88 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Check
              size={22}
              strokeWidth={2.5}
              className="text-white"
              aria-hidden="true"
            />
          </motion.button>
        </div>
      )}
    </div>
  );
}
