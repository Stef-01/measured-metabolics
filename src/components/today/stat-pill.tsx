"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

/**
 * StatPill — compact streak-style chip for surface-level metrics.
 * Mirrors the Sous StreakCounter visual: rounded full, soft tint, motion on mount.
 */
export function StatPill({
  label,
  value,
  tone = "green",
}: {
  label: string;
  value: string | number;
  tone?: "green" | "warm" | "gold" | "muted";
}) {
  const palette = {
    green:
      "bg-[var(--banksia-green)]/10 text-[var(--banksia-dark-green)] ring-[var(--banksia-green)]/15",
    warm:
      "bg-[var(--banksia-warm)]/12 text-[#aa4f1a] ring-[var(--banksia-warm)]/20",
    gold:
      "bg-[var(--banksia-gold)]/15 text-[#7d6020] ring-[var(--banksia-gold)]/25",
    muted: "bg-neutral-100 text-[var(--banksia-subtext)] ring-black/5",
  }[tone];

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset",
        palette,
      )}
    >
      <span className="tabular-nums">{value}</span>
      <span className="font-medium opacity-80">{label}</span>
    </motion.span>
  );
}
