import Link from "next/link";
import { AlertTriangle } from "lucide-react";

interface Props {
  dietitianName: string;
  reason: string;
  /** Where the "Send now" / "Open thread" CTA goes. */
  href: string;
  cta?: string;
}

/**
 * EscalationCard — surfaced when a severe symptom is logged or when the
 * dietitian has flagged the patient. Bright, unambiguous, single CTA.
 *
 * PRD §7.7 acceptance: severe nausea -> escalation card visible without scroll.
 */
export function EscalationCard({
  dietitianName,
  reason,
  href,
  cta = "Send now",
}: Props) {
  return (
    <div
      className="rounded-2xl border border-[var(--measured-evaluate)]/25 bg-[var(--measured-evaluate)]/5 p-4 shadow-[var(--shadow-card)]"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--measured-evaluate)] text-white"
          aria-hidden="true"
        >
          <AlertTriangle size={18} strokeWidth={2.4} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-evaluate)]">
            Worth a quick message
          </div>
          <p className="mt-1 text-[14px] leading-relaxed text-[var(--measured-dark)]">
            {reason}
          </p>
          <Link
            href={href}
            className="mt-3 inline-flex items-center justify-center rounded-xl bg-[var(--measured-evaluate)] px-4 py-2 text-[13px] font-semibold text-white shadow-[var(--shadow-card)] transition-colors hover:bg-[var(--measured-evaluate-hover)]"
          >
            {cta} → {dietitianName}
          </Link>
        </div>
      </div>
    </div>
  );
}
