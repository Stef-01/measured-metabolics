"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  FileText,
  Receipt,
  ClipboardList,
  Send,
  FileChartColumn,
  Stethoscope,
} from "lucide-react";
import { gpSidebarTabs, type GpTabId } from "@/lib/hooks/use-navigation";
import { PersonaSwitcher } from "@/components/shared/persona-switcher";
import { cn } from "@/lib/utils/cn";
import type { Patient } from "@/lib/mock/types";

const ICON_BY_TAB: Record<GpTabId, typeof User> = {
  context: User,
  transcript: FileText,
  billing: Receipt,
  "care-plan": ClipboardList,
  referral: Send,
  report: FileChartColumn,
};

interface Props {
  patient: Patient;
  children: React.ReactNode;
}

/**
 * GpSidebarShell — 360px column the GP sidebar lives inside (PRD §9.1, §9.3).
 *
 * Mimics how Best Practice / Medical Director embed external panels: narrow,
 * stacked, no chrome. Top header shows patient identity; the tab strip beneath
 * routes between the 6 PRD §9 cards.
 */
export function GpSidebarShell({ patient, children }: Props) {
  const tabs = gpSidebarTabs(patient.id);
  const pathname = usePathname();

  const riskBar =
    patient.risk === "high"
      ? "bg-[var(--measured-evaluate)]"
      : patient.risk === "medium"
        ? "bg-[var(--measured-clinical-amber)]"
        : "bg-[var(--measured-green)]";

  const riskChip =
    patient.risk === "high"
      ? "bg-[var(--measured-evaluate)]/10 text-[var(--measured-evaluate)]"
      : patient.risk === "medium"
        ? "bg-[var(--measured-clinical-amber)]/15 text-[var(--measured-clinical-amber)]"
        : "bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]";

  return (
    <div className="gp-sidebar mx-auto flex flex-col" data-gp-sidebar>
      {/* Risk-level accent bar */}
      <div className={cn("h-1 w-full shrink-0", riskBar)} aria-hidden="true" />

      <motion.header
        className="border-b border-[var(--measured-border-soft)] bg-white px-5 pt-3 pb-3"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[var(--measured-subtext)]">
            <Stethoscope size={14} strokeWidth={2.2} aria-hidden="true" />
            Measured · GP sidebar
          </div>
          <PersonaSwitcher active="gp" variant="compact" />
        </div>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-serif text-[22px] leading-tight text-[var(--measured-dark)]">
              {patient.firstName} {patient.lastName}
            </div>
            <div className="mt-0.5 text-[12px] text-[var(--measured-subtext)]">
              {patient.age}
              {patient.sex.toLowerCase()} · wk {patient.weekNumber} ·{" "}
              {patient.conditions.join(", ")}
            </div>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
              riskChip,
            )}
          >
            {patient.risk} risk
          </span>
        </div>
      </motion.header>

      <nav
        className="flex gap-1 overflow-x-auto border-b border-[var(--measured-border-soft)] bg-white px-2 py-2 scrollbar-hide"
        aria-label="GP sidebar sections"
      >
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = ICON_BY_TAB[tab.id];
          return (
            <Link
              key={tab.id}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[12px] font-medium transition-colors",
                isActive
                  ? "text-[var(--measured-dark-green)]"
                  : "text-[var(--measured-subtext)] hover:bg-[var(--measured-cream)] hover:text-[var(--measured-dark)]",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="gp-nav-tab"
                  className="absolute inset-0 rounded-xl bg-[var(--measured-green)]/10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon size={14} strokeWidth={2} aria-hidden="true" />
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <motion.main
        className="flex-1 overflow-y-auto px-4 py-4"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >{children}</motion.main>
    </div>
  );
}
