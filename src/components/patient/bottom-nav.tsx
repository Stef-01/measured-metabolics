"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, LayoutGroup } from "framer-motion";
import {
  Home,
  Camera,
  CalendarDays,
  Activity,
  MessageCircle,
} from "lucide-react";
import { useNavigation, type PatientTabId } from "@/lib/hooks/use-navigation";
import { useHaptic } from "@/lib/hooks/use-haptic";
import { cn } from "@/lib/utils/cn";

const ICON_BY_TAB: Record<PatientTabId, typeof Home> = {
  home: Home,
  meal: Camera,
  plan: CalendarDays,
  metrics: Activity,
  messages: MessageCircle,
};

/**
 * PatientBottomNav — 5-tab bottom bar for the patient PWA (PRD §7.3).
 *
 * Lives only inside `(patient)/p/*` routes. Touch-first; uses Framer Motion
 * `LayoutGroup` for the active-tab indicator slide and the `useHaptic` hook
 * for tap feedback (mobile only).
 */
export function PatientBottomNav() {
  const tabs = useNavigation("patient");
  const pathname = usePathname();
  const haptic = useHaptic();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--measured-border)] bg-white safe-area-bottom"
      style={{
        boxShadow:
          "0 -1px 0 rgba(0,0,0,0.02), 0 -8px 24px -12px rgba(13,13,13,0.08)",
      }}
      aria-label="Main navigation"
    >
      <LayoutGroup>
        <div className="mx-auto flex max-w-md items-center justify-around py-2">
          {tabs.map((tab) => {
            const isActive =
              pathname === tab.href || pathname.startsWith(`${tab.href}/`);
            const Icon = ICON_BY_TAB[tab.id];

            // Primary action tab — raised green circle, lifted above the bar
            if (tab.id === "meal") {
              return (
                <motion.div
                  key={tab.id}
                  whileTap={{ scale: 0.88 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  style={{ WebkitTapHighlightColor: "transparent" }}
                  onTapStart={haptic}
                  className="-mt-5"
                >
                  <Link
                    href={tab.href}
                    aria-current={isActive ? "page" : undefined}
                    aria-label={tab.label}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <span
                      className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-full shadow-[0_4px_16px_-2px_rgba(45,90,61,0.45)] transition-all",
                        isActive
                          ? "bg-[var(--measured-dark-green)]"
                          : "bg-[var(--measured-green)]",
                      )}
                    >
                      <Icon size={24} strokeWidth={2.2} className="text-white" aria-hidden="true" />
                    </span>
                    <span className={cn("text-xs font-semibold transition-colors", isActive ? "text-[var(--measured-dark-green)]" : "text-[var(--measured-subtext)]")}>
                      {tab.label}
                    </span>
                  </Link>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={tab.id}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                style={{ WebkitTapHighlightColor: "transparent" }}
                onTapStart={haptic}
              >
                <Link
                  href={tab.href}
                  className="relative flex flex-col items-center gap-0.5 rounded-xl px-4 py-1.5 text-xs font-medium"
                  aria-current={isActive ? "page" : undefined}
                  aria-label={tab.label}
                >
                  {isActive && (
                    <motion.div
                      layoutId="patient-tab-indicator"
                      className="absolute inset-0 rounded-xl bg-[var(--measured-green)]/10"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                        mass: 0.8,
                      }}
                    />
                  )}
                  <motion.div
                    className="relative z-10 flex flex-col items-center gap-0.5"
                    animate={
                      isActive ? { scale: 1, y: 0 } : { scale: 0.95, y: 0 }
                    }
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <Icon
                      size={22}
                      strokeWidth={2}
                      className={cn(
                        "transition-colors",
                        isActive
                          ? "text-[var(--measured-green)]"
                          : "text-[var(--measured-subtext)]",
                      )}
                      aria-hidden="true"
                    />
                    <span
                      className={cn(
                        "transition-colors duration-200",
                        isActive
                          ? "text-[var(--measured-green)]"
                          : "text-[var(--measured-subtext)] hover:text-[var(--measured-dark)]",
                      )}
                    >
                      {tab.label}
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </LayoutGroup>
    </nav>
  );
}
