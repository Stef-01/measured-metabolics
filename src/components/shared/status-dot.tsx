import { cn } from "@/lib/utils/cn";

type Tone = "high" | "medium" | "low" | "good" | "neutral";

const TONE_STYLES: Record<
  Tone,
  { chip: string; dot: string; label: string }
> = {
  high: {
    chip: "bg-[var(--measured-evaluate)]/10 text-[var(--measured-evaluate)]",
    dot: "bg-[var(--measured-evaluate)]",
    label: "text-[var(--measured-evaluate)]",
  },
  medium: {
    chip: "bg-[var(--measured-clinical-amber)]/15 text-[var(--measured-clinical-amber)]",
    dot: "bg-[var(--measured-clinical-amber)]",
    label: "text-[var(--measured-clinical-amber)]",
  },
  low: {
    chip: "bg-[var(--measured-clinical-blue)]/10 text-[var(--measured-clinical-blue)]",
    dot: "bg-[var(--measured-clinical-blue)]",
    label: "text-[var(--measured-clinical-blue)]",
  },
  good: {
    chip: "bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]",
    dot: "bg-[var(--measured-green)]",
    label: "text-[var(--measured-dark-green)]",
  },
  neutral: {
    chip: "bg-[var(--measured-border-soft)] text-[var(--measured-subtext)]",
    dot: "bg-[var(--measured-subtext)]",
    label: "text-[var(--measured-subtext)]",
  },
};

interface StatusDotProps {
  tone: Tone;
  label: string;
  className?: string;
  size?: "sm" | "md";
}

export function StatusDot({
  tone,
  label,
  className,
  size = "md",
}: StatusDotProps) {
  const styles = TONE_STYLES[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold capitalize",
        size === "sm"
          ? "px-2 py-0.5 text-[10px]"
          : "px-2.5 py-1 text-[11px]",
        styles.chip,
        className,
      )}
    >
      <span
        className={cn("shrink-0 rounded-full", styles.dot, size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2")}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
