"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  Icon?: LucideIcon;
  tone?: "default" | "warning" | "success" | "danger";
  hint?: string;
}

const TONE_RING: Record<NonNullable<Props["tone"]>, string> = {
  default: "ring-[var(--measured-border-soft)]",
  warning: "ring-[var(--measured-clinical-amber)]/40",
  success: "ring-[var(--measured-green)]/40",
  danger: "ring-[var(--measured-evaluate)]/40",
};

const TONE_BG: Record<NonNullable<Props["tone"]>, string> = {
  default: "bg-white",
  warning: "bg-[var(--measured-clinical-amber)]/5",
  success: "bg-[var(--measured-green)]/5",
  danger: "bg-[var(--measured-evaluate)]/5",
};

const TONE_ICON: Record<NonNullable<Props["tone"]>, string> = {
  default: "text-[var(--measured-subtext)]",
  warning: "text-[var(--measured-clinical-amber)]",
  success: "text-[var(--measured-green)]",
  danger: "text-[var(--measured-evaluate)]",
};

function AnimatedCount({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(mv, target, { duration: 0.72, ease: "easeOut" });
    return () => controls.stop();
  }, [isInView, target, mv]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export function DietitianStatCard({
  label,
  value,
  Icon,
  tone = "default",
  hint,
}: Props) {
  return (
    <motion.div
      className={cn(
        "rounded-2xl p-5 shadow-[var(--shadow-card)] ring-1",
        TONE_BG[tone],
        TONE_RING[tone],
      )}
      whileHover={{ y: -2, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 350, damping: 24 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-[11px] text-[var(--measured-subtext)]">
          {label}
        </div>
        {Icon && (
          <Icon
            size={14}
            strokeWidth={2}
            className={cn("mt-0.5 shrink-0", TONE_ICON[tone])}
            aria-hidden="true"
          />
        )}
      </div>
      <div className="mt-2 font-serif text-[34px] leading-tight text-[var(--measured-dark)]">
        {typeof value === "number" ? <AnimatedCount target={value} /> : value}
      </div>
      {hint && (
        <div className={cn("mt-1 text-[11px] font-medium", TONE_ICON[tone])}>
          {hint}
        </div>
      )}
    </motion.div>
  );
}
