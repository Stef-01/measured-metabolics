"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Users,
  ClipboardCheck,
  FileText,
  MessageSquare,
  Stethoscope,
} from "lucide-react";
import { useNavigation, type DietitianTabId } from "@/lib/hooks/use-navigation";
import { PersonaSwitcher } from "@/components/shared/persona-switcher";
import { THREADS } from "@/lib/mock";
import { cn } from "@/lib/utils/cn";

const ICON_BY_TAB: Record<DietitianTabId, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  referrals: Inbox,
  patients: Users,
  queue: ClipboardCheck,
  reports: FileText,
  messages: MessageSquare,
};

/**
 * DietitianSideNav — vertical left rail for `/d/*` routes (PRD §8.3).
 *
 * 240px wide on desktop; collapses to icons-only at lg breakpoint.
 * Per PRD: keyboard navigation must work — `Tab` cycles, focus rings honour
 * the `:focus-visible` browser default. We rely on Next/Link + button defaults.
 */
const UNREAD_COUNT = THREADS.reduce(
  (sum, t) =>
    sum + t.messages.filter((m) => m.fromRole === "patient" && !m.read).length,
  0,
);

export function DietitianSideNav() {
  const tabs = useNavigation("dietitian");
  const pathname = usePathname();

  return (
    <nav
      className="fixed left-0 top-0 z-40 flex h-screen w-[240px] flex-col border-r border-[var(--measured-border-soft)] bg-white"
      aria-label="Dietitian navigation"
    >
      <div className="flex items-center gap-2 px-5 pt-6 pb-7">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--measured-green)] text-white">
          <Stethoscope size={18} strokeWidth={2.2} aria-hidden="true" />
        </div>
        <div className="font-serif text-[18px] tracking-tight text-[var(--measured-dark)]">
          Measured
        </div>
      </div>

      <ul className="flex flex-col gap-0.5 px-3">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const Icon = ICON_BY_TAB[tab.id];
          return (
            <li key={tab.id}>
              <Link
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]"
                    : "text-[var(--measured-subtext)] hover:bg-[var(--measured-cream)] hover:text-[var(--measured-dark)]",
                )}
              >
                <span className="relative shrink-0">
                  <Icon
                    size={18}
                    strokeWidth={2}
                    className={cn(
                      isActive
                        ? "text-[var(--measured-green)]"
                        : "text-[var(--measured-subtext)]",
                    )}
                    aria-hidden="true"
                  />
                  {tab.id === "messages" && UNREAD_COUNT > 0 && (
                    <span
                      aria-label={`${UNREAD_COUNT} unread`}
                      className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--measured-evaluate)] text-[8px] font-bold text-white"
                    >
                      {UNREAD_COUNT > 9 ? "9+" : UNREAD_COUNT}
                    </span>
                  )}
                </span>
                <span>{tab.label}</span>
                {tab.id === "messages" && UNREAD_COUNT > 0 && (
                  <span className="ml-auto rounded-full bg-[var(--measured-evaluate)] px-1.5 py-0.5 text-[9px] font-bold text-white">
                    {UNREAD_COUNT}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto border-t border-[var(--measured-border-soft)] p-3">
        <PersonaSwitcher active="dietitian" variant="rail" />
      </div>
    </nav>
  );
}
