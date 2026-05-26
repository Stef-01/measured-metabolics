"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, Check } from "lucide-react";
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
  accent: string;
}

const PERSONAS: Persona[] = [
  {
    id: "dietitian",
    name: "Maya Singh",
    role: "Dietitian, APD",
    href: "/d/dashboard",
    initials: "MS",
    accent: "var(--measured-green)",
  },
  {
    id: "patient",
    name: "Asha Patel",
    role: "Patient, week 2",
    href: "/p/home",
    initials: "AP",
    accent: "var(--measured-clinical-blue)",
  },
  {
    id: "gp",
    name: "Dr Lee",
    role: "GP, Macquarie Family Practice",
    href: "/gp/asha/context",
    initials: "DL",
    accent: "var(--measured-gold)",
  },
  {
    id: "admin",
    name: "Org Admin",
    role: "Measured operations",
    href: "/admin/kpi",
    initials: "OA",
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
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="listbox"
            aria-label="Switch account"
            className={cn(
              "absolute z-[60] w-[280px] overflow-hidden rounded-3xl border border-[var(--measured-border-soft)] bg-white/95 shadow-[0_12px_48px_-8px_rgba(0,0,0,0.18),0_4px_16px_-4px_rgba(0,0,0,0.08)] backdrop-blur-xl",
              variant === "rail" && "bottom-[calc(100%+10px)] left-0",
              variant === "compact" && "right-0 top-[calc(100%+8px)]",
              variant === "floating" && "bottom-[calc(100%+10px)] left-0",
            )}
          >
            <div className="border-b border-[var(--measured-border-soft)] px-4 py-3">
              <p className="text-[12px] font-semibold text-[var(--measured-dark)]">
                Switch persona
              </p>
            </div>

            <ul className="px-2 py-2 space-y-0.5">
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
                        "group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all duration-150",
                        isActive
                          ? "bg-[var(--measured-green)]/8"
                          : "hover:bg-[var(--measured-cream)]",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-[13px] font-bold text-white shadow-[var(--shadow-card)]"
                        style={{ backgroundColor: p.accent }}
                      >
                        {p.initials}
                        {isActive && (
                          <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--measured-dark-green)] ring-2 ring-white">
                            <Check size={9} strokeWidth={3} className="text-white" aria-hidden="true" />
                          </span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-semibold text-[var(--measured-dark)]">
                          {p.name}
                        </span>
                        <span className="block truncate text-[11px] text-[var(--measured-subtext)]">
                          {p.role}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
