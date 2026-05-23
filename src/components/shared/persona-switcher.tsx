"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronUp,
  Smartphone,
  Stethoscope,
  PanelRightClose,
  Shield,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * PersonaSwitcher — demo-mode account switcher.
 *
 * Lets a single demo viewer hop between the four personas (Patient PWA,
 * Dietitian Web, GP sidebar, Admin console) without going back to the
 * landing page. Lives in the bottom-left of every shell as the user's
 * "profile chip" — clicking it opens a popover above with the four
 * destinations.
 *
 * Stage 5 will replace this with role-aware redirect after Supabase Auth
 * sign-in. Until then, this is the friction-removing demo affordance.
 */

export type ActivePersona = "patient" | "dietitian" | "gp" | "admin";

interface Persona {
  id: ActivePersona;
  name: string;
  role: string;
  href: string;
  initials: string;
  Icon: typeof Smartphone;
  accent: string;
}

const PERSONAS: Persona[] = [
  {
    id: "dietitian",
    name: "Maya Singh",
    role: "Dietitian, APD",
    href: "/d/dashboard",
    initials: "MS",
    Icon: Stethoscope,
    accent: "var(--measured-green)",
  },
  {
    id: "patient",
    name: "Asha Patel",
    role: "Patient, week 2",
    href: "/p/home",
    initials: "AP",
    Icon: Smartphone,
    accent: "var(--measured-clinical-blue)",
  },
  {
    id: "gp",
    name: "Dr Lee",
    role: "GP, Macquarie Family Practice",
    href: "/gp/asha/context",
    initials: "DL",
    Icon: PanelRightClose,
    accent: "var(--measured-gold)",
  },
  {
    id: "admin",
    name: "Org Admin",
    role: "Measured operations",
    href: "/admin/kpi",
    initials: "OA",
    Icon: Shield,
    accent: "var(--measured-evaluate)",
  },
];

interface Props {
  active: ActivePersona;
  variant?: "rail" | "compact" | "floating";
}

export function PersonaSwitcher({ active, variant = "rail" }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const activePersona = PERSONAS.find((p) => p.id === active) ?? PERSONAS[0];

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handlePick = (p: Persona) => {
    setOpen(false);
    if (p.id === active) return;
    router.push(p.href);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Switch persona — currently ${activePersona.name}`}
        className={cn(
          "group flex w-full items-center gap-3 rounded-2xl text-left transition-colors",
          variant === "rail" &&
            "border border-[var(--measured-border-soft)] bg-white px-3 py-2.5 hover:bg-[var(--measured-cream)]",
          variant === "compact" &&
            "rounded-full bg-white/90 px-2 py-1 backdrop-blur hover:bg-white",
          variant === "floating" &&
            "fixed bottom-24 left-4 z-50 rounded-full border border-[var(--measured-border-soft)] bg-white px-3 py-2 shadow-[var(--shadow-raised)]",
        )}
      >
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
          style={{ backgroundColor: activePersona.accent }}
        >
          {activePersona.initials}
        </span>
        {variant !== "compact" && (
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-semibold text-[var(--measured-dark)]">
              {activePersona.name}
            </span>
            <span className="block truncate text-[10px] text-[var(--measured-subtext)]">
              {activePersona.role}
            </span>
          </span>
        )}
        <ChevronUp
          size={14}
          strokeWidth={2.2}
          aria-hidden="true"
          className={cn(
            "shrink-0 text-[var(--measured-subtext)] transition-transform",
            open ? "rotate-0" : "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            role="listbox"
            aria-label="Switch persona"
            className={cn(
              "absolute z-[60] w-[260px] overflow-hidden rounded-2xl border border-[var(--measured-border-soft)] bg-white shadow-[var(--shadow-raised)]",
              variant === "rail" && "bottom-[calc(100%+8px)] left-0",
              variant === "compact" && "right-0 top-[calc(100%+6px)]",
              variant === "floating" && "bottom-[calc(100%+8px)] left-0",
            )}
          >
            <div className="border-b border-[var(--measured-border-soft)] bg-[var(--measured-cream)] px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
              Demo · Switch persona
            </div>
            <ul className="py-1">
              {PERSONAS.map((p) => {
                const isActive = p.id === active;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onClick={() => handlePick(p)}
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-2 text-left transition-colors",
                        isActive
                          ? "bg-[var(--measured-green)]/5"
                          : "hover:bg-[var(--measured-cream)]",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                        style={{ backgroundColor: p.accent }}
                      >
                        {p.initials}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <p.Icon
                            size={11}
                            strokeWidth={2.2}
                            className="text-[var(--measured-subtext)]"
                            aria-hidden="true"
                          />
                          <span className="truncate text-[13px] font-semibold text-[var(--measured-dark)]">
                            {p.name}
                          </span>
                        </span>
                        <span className="block truncate text-[11px] text-[var(--measured-subtext)]">
                          {p.role}
                        </span>
                      </span>
                      {isActive && (
                        <Check
                          size={14}
                          strokeWidth={2.4}
                          className="shrink-0 text-[var(--measured-dark-green)]"
                          aria-label="Currently active"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-[var(--measured-border-soft)] px-3 py-2 text-[10px] leading-relaxed text-[var(--measured-subtext)]">
              Demo build only. Stage 5 replaces this with Supabase Auth role
              redirect.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
