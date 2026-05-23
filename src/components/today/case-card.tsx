"use client";

import { motion } from "framer-motion";
import { ChevronRight, Flag, Repeat, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type CaseTag = "priority" | "follow-up" | "intake";

export interface CaseRow {
  id: string;
  name: string;
  note: string;
  detail: string;
  tag: CaseTag;
}

const TAG_META: Record<
  CaseTag,
  { label: string; tone: string; Icon: typeof Flag }
> = {
  priority: {
    label: "Priority",
    tone:
      "bg-[var(--banksia-evaluate)]/10 text-[var(--banksia-evaluate)] ring-[var(--banksia-evaluate)]/15",
    Icon: Flag,
  },
  "follow-up": {
    label: "Follow-up",
    tone:
      "bg-[var(--banksia-green)]/10 text-[var(--banksia-dark-green)] ring-[var(--banksia-green)]/15",
    Icon: Repeat,
  },
  intake: {
    label: "Intake",
    tone:
      "bg-[var(--banksia-gold)]/15 text-[#7d6020] ring-[var(--banksia-gold)]/25",
    Icon: UserPlus,
  },
};

/**
 * CaseCard — the Today-page hero. Mirrors the Sous QuestCard visual:
 * rounded surface, generous padding, motion on mount and tap, single
 * primary action (open case).
 */
export function CaseCard({ row, onOpen }: { row: CaseRow; onOpen?: () => void }) {
  const { Icon, label, tone } = TAG_META[row.tag];

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className="surface-raised group relative w-full overflow-hidden p-5 text-left transition-shadow hover:shadow-[var(--shadow-cta-hover)]"
    >
      <div className="flex items-start gap-4">
        <div
          aria-hidden
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--banksia-green)]/8 font-serif text-base font-semibold text-[var(--banksia-dark-green)]"
        >
          {row.name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-serif text-lg font-semibold text-[var(--banksia-dark)]">
              {row.name}
            </h3>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset",
                tone,
              )}
            >
              <Icon size={11} strokeWidth={2.4} />
              {label}
            </span>
          </div>
          <p className="mt-0.5 text-sm font-medium text-[var(--banksia-dark)]">
            {row.note}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--banksia-subtext)]">
            {row.detail}
          </p>
        </div>
        <ChevronRight
          size={20}
          className="mt-1 shrink-0 text-[var(--banksia-subtext)] transition-transform group-hover:translate-x-0.5"
          strokeWidth={2}
        />
      </div>
    </motion.button>
  );
}
