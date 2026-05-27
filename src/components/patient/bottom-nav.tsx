"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
      <div className="mx-auto flex max-w-md items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const Icon = ICON_BY_TAB[tab.id];

          if (tab.id === "meal") {
            return (
              <div
                key={tab.id}
                style={{ WebkitTapHighlightColor: "transparent" }}
                onPointerDown={haptic}
                className="-mt-4"
              >
                <Link
                  href={tab.href}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={tab.label}
                  className="flex flex-col items-center gap-0.5"
                >
                  <motion.span
                    key={isActive ? "cam-active" : "cam-inactive"}
                    initial={isActive ? { scale: 0.82 } : false}
                    animate={isActive ? { scale: 1 } : {}}
                    transition={{ type: "spring", stiffness: 420, damping: 14 }}
                    className={cn(
                      "flex h-13 w-13 items-center justify-center rounded-full",
                      isActive
                        ? "bg-[var(--measured-dark-green)]"
                        : "bg-[var(--measured-green)]",
                    )}
                    style={{ boxShadow: "0 2px 12px -2px rgba(45,90,61,0.35)" }}
                  >
                    <Icon
                      size={22}
                      strokeWidth={2.2}
                      className="text-white"
                      aria-hidden="true"
                    />
                  </motion.span>
                  <span
                    className={cn(
                      "text-[11px] font-semibold transition-colors",
                      isActive
                        ? "text-[var(--measured-dark-green)]"
                        : "text-[var(--measured-subtext)]",
                    )}
                  >
                    {tab.label}
                  </span>
                </Link>
              </div>
            );
          }

          return (
            <div
              key={tab.id}
              style={{ WebkitTapHighlightColor: "transparent" }}
              onPointerDown={haptic}
            >
              <Link
                href={tab.href}
                className="relative flex flex-col items-center gap-0.5 rounded-xl px-4 py-1.5 text-[11px] font-medium"
                aria-current={isActive ? "page" : undefined}
                aria-label={tab.label}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-[var(--measured-green)]/10" />
                )}
                <div className="relative z-10 flex flex-col items-center gap-0.5">
                  <motion.span
                    key={isActive ? `${tab.id}-active` : `${tab.id}-inactive`}
                    initial={isActive ? { scale: 0.75 } : false}
                    animate={isActive ? { scale: 1 } : {}}
                    transition={{ type: "spring", stiffness: 420, damping: 14 }}
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
                  </motion.span>
                  <span
                    className={cn(
                      "transition-colors duration-150",
                      isActive
                        ? "text-[var(--measured-green)]"
                        : "text-[var(--measured-subtext)]",
                    )}
                  >
                    {tab.label}
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
