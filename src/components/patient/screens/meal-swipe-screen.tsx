"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  AnimatePresence,
  useAnimate,
  useReducedMotion,
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
const HINT_KEY = "meal-swipe-hint-v1";

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
  const reduceMotion = useReducedMotion();

  // One-shot swipe affordance peek — reads localStorage inside the setTimeout
  // callback (not the synchronous effect body) so no setState is needed.
  // Skipped entirely under prefers-reduced-motion.
  useEffect(() => {
    if (!isTop || reduceMotion) return;
    const timeout = setTimeout(async () => {
      try {
        if (localStorage.getItem(HINT_KEY)) return;
      } catch {}
      await animate(x, 18, { duration: 0.28, ease: [0.22, 1, 0.36, 1] });
      await animate(x, -8, { duration: 0.18, ease: "easeOut" });
      await animate(x, 0, { type: "spring", stiffness: 380, damping: 28 });
      try {
        localStorage.setItem(HINT_KEY, "1");
      } catch {}
    }, 700);
    return () => clearTimeout(timeout);
  }, [isTop, x, reduceMotion]);

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
      role="article"
      aria-roledescription="swipeable meal card"
      aria-label={
        isTop
          ? `${suggestion.name}. ${suggestion.mealType}${suggestion.origin ? `, ${suggestion.origin}` : ""}. Swipe right or press Add to add to plan; swipe left or press Skip to pass.`
          : suggestion.name
      }
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
        {/* Food photo + colour-identity tint */}
        {suggestion.imageUrl && (
          <>
            <Image
              src={suggestion.imageUrl}
              alt={suggestion.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 420px"
              draggable={false}
              priority={offset <= 1}
            />
            <div
              className="absolute inset-0 z-[1]"
              style={{
                background: `linear-gradient(180deg, ${suggestion.gradientFrom}cc 0%, ${suggestion.gradientFrom}44 30%, transparent 55%)`,
              }}
            />
          </>
        )}

        {/* Dietitian pick badge */}
        {isTop && suggestion.dietitianPick && (
          <div className="relative z-20">
            <DietitianTag
              name={dietitianName}
              note={suggestion.dietitianNote}
            />
          </div>
        )}

        {/* Swipe feedback overlays */}
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

        {/* Noise texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-[2] rounded-[2.5rem] opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Hero emoji — only when no photo */}
        {!suggestion.imageUrl && (
          <div className="flex h-[52%] items-center justify-center">
            <span
              className="select-none drop-shadow-2xl"
              style={{ fontSize: 100, lineHeight: 1 }}
              aria-hidden="true"
            >
              {suggestion.emoji}
            </span>
          </div>
        )}

        {/* Bottom info overlay */}
        <div
          className="absolute inset-x-0 bottom-0 z-[3] px-6 pb-7 pt-20"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.60) 45%, rgba(0,0,0,0) 100%)",
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

// Animated count that springs up from 0 (renders target directly if reduced motion)
function SpringCount({ target }: { target: number }) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (reduceMotion) return;
    let frame: number;
    const start = performance.now();
    const duration = 900;
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(ease * target));
      if (t < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, reduceMotion]);
  return <>{reduceMotion ? target : display}</>;
}

// Sparkle particles radiating outward on celebration
function CelebrationBurst() {
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {angles.map((angle) => (
        <motion.div
          key={angle}
          className="absolute h-2 w-2 rounded-full bg-[var(--measured-green)]"
          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
          animate={{
            scale: [0, 1, 0],
            x: Math.cos((angle * Math.PI) / 180) * 60,
            y: Math.sin((angle * Math.PI) / 180) * 60,
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        />
      ))}
    </div>
  );
}

// Action button with a brief scale-pulse on press
function ActionButton({
  onClick,
  ariaLabel,
  variant,
  children,
}: {
  onClick: () => void;
  ariaLabel: string;
  variant: "skip" | "add";
  children: React.ReactNode;
}) {
  const [scope, animateEl] = useAnimate();
  const handleClick = useCallback(async () => {
    onClick();
    if (scope.current) {
      await animateEl(
        scope.current,
        { scale: [1, 1.22, 0.88, 1] },
        { duration: 0.32, ease: "easeOut" },
      );
    }
  }, [onClick, scope, animateEl]);

  return (
    <motion.button
      ref={scope}
      type="button"
      aria-label={ariaLabel}
      onClick={handleClick}
      className={
        variant === "add"
          ? "flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[var(--measured-green)] shadow-[0_4px_20px_-4px_rgba(45,90,61,0.5)]"
          : "flex h-[56px] w-[56px] items-center justify-center rounded-full border-2 border-[var(--measured-border)] bg-white shadow-[var(--shadow-card)]"
      }
      whileHover={{ scale: 1.08 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {children}
    </motion.button>
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
  const showBurst = done && savedCount > 0; // derived — no separate state needed
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  function handleSwipe(id: string, dir: "left" | "right") {
    if (dir === "right") setSavedCount((n) => n + 1);
    setCards((c) => c.filter((card) => card.id !== id));
  }

  function programmaticSwipe(dir: "left" | "right") {
    if (cards.length === 0) return;
    handleSwipe(cards[0].id, dir);
  }

  // Progress: how many of 12 have been decided
  const decided = MEAL_SUGGESTIONS.length - cards.length;
  const total = MEAL_SUGGESTIONS.length;

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ height: "calc(100dvh - 6rem)" }}
    >
      <PatientAppHeader eyebrow="Meal ideas" title="What sounds good?" />

      {/* Progress strip */}
      {!done && (
        <div className="mx-5 mb-1 mt-0.5 h-0.5 overflow-hidden rounded-full bg-[var(--measured-border-soft)]">
          <motion.div
            className="h-full rounded-full bg-[var(--measured-green)]"
            initial={{ width: 0 }}
            animate={{ width: `${(decided / total) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      )}

      {/* Card stack */}
      <div className="relative flex-1" aria-live="polite" aria-atomic="true">
        <AnimatePresence>
          {done ? (
            <motion.div
              key="done"
              ref={doneRef}
              tabIndex={-1}
              className="relative flex h-full flex-col items-center justify-center px-10 text-center focus:outline-none"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              {showBurst && <CelebrationBurst />}

              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                  delay: 0.05,
                }}
              >
                <span
                  className="select-none"
                  style={{ fontSize: 72 }}
                  aria-hidden="true"
                >
                  {savedCount > 0 ? "🌿" : "✨"}
                </span>
              </motion.div>

              {savedCount > 0 ? (
                <>
                  <motion.h2
                    className="mt-5 font-serif text-[32px] leading-tight tracking-tight text-[var(--measured-dark)]"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.18,
                      duration: 0.45,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <span className="tnum text-[var(--measured-dark-green)]">
                      <SpringCount target={savedCount} />
                    </span>{" "}
                    idea{savedCount > 1 ? "s" : ""} saved
                  </motion.h2>
                  <motion.p
                    className="mt-2 text-[14px] leading-relaxed text-[var(--measured-subtext)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.32 }}
                  >
                    {dietitianName} will see these before your next session.
                  </motion.p>
                </>
              ) : (
                <>
                  <h2 className="mt-5 font-serif text-[28px] leading-tight tracking-tight text-[var(--measured-dark)]">
                    All done for now
                  </h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-[var(--measured-subtext)]">
                    Check back after your next session for new suggestions.
                  </p>
                </>
              )}

              <motion.div
                className="mt-8 flex flex-col items-center gap-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.4,
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <motion.button
                  type="button"
                  onClick={() => {
                    setCards(MEAL_SUGGESTIONS);
                    setSavedCount(0);
                  }}
                  className="flex items-center gap-2 rounded-2xl bg-[var(--measured-green)] px-6 py-3.5 text-[14px] font-semibold text-white shadow-[0_4px_14px_-4px_rgba(45,90,61,0.4)]"
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
              </motion.div>
            </motion.div>
          ) : (
            <React.Fragment key="cards">
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
            </React.Fragment>
          )}
        </AnimatePresence>
      </div>

      {/* Action row */}
      {!done && (
        <div className="flex items-center justify-center gap-6 py-3">
          <ActionButton
            ariaLabel="Skip this meal"
            variant="skip"
            onClick={() => programmaticSwipe("left")}
          >
            <X
              size={22}
              strokeWidth={2.5}
              className="text-[var(--measured-subtext)]"
              aria-hidden="true"
            />
          </ActionButton>

          <Link
            href="/p/meal/log"
            className="flex items-center gap-1.5 rounded-2xl border border-[var(--measured-border-soft)] bg-white px-4 py-2.5 text-[12px] font-semibold text-[var(--measured-subtext)] shadow-[var(--shadow-card)] transition-colors hover:bg-[var(--measured-green)]/5 hover:text-[var(--measured-dark)]"
          >
            <Camera size={13} strokeWidth={2} aria-hidden="true" />
            Log a meal
          </Link>

          <ActionButton
            ariaLabel="Add to meal plan"
            variant="add"
            onClick={() => programmaticSwipe("right")}
          >
            <Check
              size={22}
              strokeWidth={2.5}
              className="text-white"
              aria-hidden="true"
            />
          </ActionButton>
        </div>
      )}

      {/* Card counter */}
      {!done && (
        <p className="tnum pb-2 text-center text-[11px] text-[var(--measured-subtext)]">
          {cards.length} of {total} remaining
        </p>
      )}
    </div>
  );
}
