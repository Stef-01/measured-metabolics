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

export function DietitianStatCard({ label, value, tone = "default" }: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl p-5 shadow-[var(--shadow-card)] ring-1",
        TONE_BG[tone],
        TONE_RING[tone],
      )}
    >
      <div className="text-[11px] text-[var(--measured-subtext)]">{label}</div>
      <div className="mt-1.5 font-serif text-[34px] leading-tight text-[var(--measured-dark)]">
        {value}
      </div>
    </div>
  );
}
