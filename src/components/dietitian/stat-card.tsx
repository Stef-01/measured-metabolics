import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

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

export function DietitianStatCard({
  label,
  value,
  Icon,
  tone = "default",
  hint,
}: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl p-5 shadow-[var(--shadow-card)] ring-1",
        TONE_BG[tone],
        TONE_RING[tone],
      )}
    >
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
        {Icon && (
          <Icon
            size={14}
            strokeWidth={2}
            className={TONE_ICON[tone]}
            aria-hidden="true"
          />
        )}
        {label}
      </div>
      <div className="mt-2 font-serif text-[34px] leading-tight text-[var(--measured-dark)]">
        {value}
      </div>
      {hint && (
        <div className="mt-1 text-[12px] text-[var(--measured-subtext)]">
          {hint}
        </div>
      )}
    </div>
  );
}
