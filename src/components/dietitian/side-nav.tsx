"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
      <motion.div
        className="flex items-center gap-2 px-5 pt-6 pb-7"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--measured-green)] text-white">
          <Stethoscope size={18} strokeWidth={2.2} aria-hidden="true" />
        </div>
        <div className="font-serif text-[18px] tracking-tight text-[var(--measured-dark)]">
          Measured
        </div>
      </motion.div>

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
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
                  isActive
                    ? "text-[var(--measured-dark-green)]"
                    : "text-[var(--measured-subtext)] hover:bg-[var(--measured-cream)] hover:text-[var(--measured-dark)]",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="dietitian-nav-active"
                    className="absolute inset-0 rounded-xl bg-[var(--measured-green)]/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
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
                      className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[var(--measured-evaluate)]"
                    />
                  )}
                </span>
                <span className="relative">{tab.label}</span>
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
