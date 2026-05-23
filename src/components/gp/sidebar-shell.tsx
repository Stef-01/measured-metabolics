"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

  return (
    <div className="gp-sidebar mx-auto flex flex-col" data-gp-sidebar>
      <header className="border-b border-[var(--measured-border-soft)] bg-white px-5 pt-6 pb-4">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[var(--measured-subtext)]">
          <Stethoscope size={14} strokeWidth={2.2} aria-hidden="true" />
          Measured · GP sidebar
        </div>
        <div className="mt-3 font-serif text-[22px] leading-tight text-[var(--measured-dark)]">
          {patient.firstName} {patient.lastName}
        </div>
        <div className="mt-1 text-[12px] text-[var(--measured-subtext)]">
          {patient.age}
          {patient.sex.toLowerCase()} · {patient.conditions.join(", ")}
        </div>
      </header>

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
                "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors",
                isActive
                  ? "bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]"
                  : "text-[var(--measured-subtext)] hover:bg-[var(--measured-cream)] hover:text-[var(--measured-dark)]",
              )}
            >
              <Icon size={14} strokeWidth={2} aria-hidden="true" />
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <main className="flex-1 overflow-y-auto px-4 py-4">{children}</main>
    </div>
  );
}
