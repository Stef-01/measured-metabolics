"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Stethoscope,
  Smartphone,
  ClipboardList,
  PanelRightClose,
  Shield,
  ArrowRight,
} from "lucide-react";

const PERSONAS = [
  {
    id: "patient",
    title: "Patient",
    tagline: "Capture meals, log symptoms, track your plan",
    href: "/p/home",
    Icon: Smartphone,
    accent: "var(--measured-clinical-blue)",
    accentSoft: "rgba(44, 94, 138, 0.08)",
  },
  {
    id: "dietitian",
    title: "Dietitian",
    tagline: "Queue, patient panel, plan and report builders",
    href: "/d/dashboard",
    Icon: ClipboardList,
    accent: "var(--measured-green)",
    accentSoft: "rgba(45, 90, 61, 0.08)",
  },
  {
    id: "gp",
    title: "GP Sidebar",
    tagline: "30-second patient context in a 360 px column",
    href: "/gp/asha/context",
    Icon: PanelRightClose,
    accent: "#a07710",
    accentSoft: "rgba(212, 168, 75, 0.1)",
  },
  {
    id: "admin",
    title: "Admin",
    tagline: "KPI dashboard, audit log, organisations",
    href: "/admin/kpi",
    Icon: Shield,
    accent: "var(--measured-evaluate)",
    accentSoft: "rgba(140, 21, 21, 0.06)",
  },
] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.22 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function Landing() {
  return (
    <main className="min-h-dvh bg-[var(--measured-cream)] text-[var(--measured-dark)]">
      {/* ── Nav ── */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 pt-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--measured-green)] text-white shadow-[var(--shadow-card)]">
            <Stethoscope size={16} strokeWidth={2.2} aria-hidden="true" />
          </div>
          <div className="font-serif text-[19px] tracking-tight">Measured</div>
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--measured-subtext)]">
          Demo
        </span>
      </header>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-14 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mb-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--measured-subtext)]"
        >
          Platform demo
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.06 }}
          className="font-serif text-[44px] leading-[1.06] tracking-tight md:text-[60px] md:leading-[1.02]"
        >
          Three interfaces,
          <br />
          <span className="font-light italic opacity-60">
            one clinical brain.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
          className="mx-auto mt-7 max-w-[400px] text-[16px] leading-relaxed text-[var(--measured-subtext)]"
        >
          Patient PWA, dietitian web, GP sidebar, and admin console — each built
          for how that role actually works.
        </motion.p>
      </section>

      {/* ── Persona grid ── */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto grid max-w-5xl gap-4 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-4"
      >
        {PERSONAS.map((p) => (
          <motion.div key={p.id} variants={cardItem} className="h-full">
            <Link
              href={p.href}
              className="group flex h-full flex-col rounded-2xl border border-[var(--measured-border-soft)] bg-white p-6 shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-raised)]"
            >
              <div
                className="mb-5 flex h-10 w-10 items-center justify-center rounded-2xl"
                style={{ background: p.accentSoft, color: p.accent }}
              >
                <p.Icon size={20} strokeWidth={2} aria-hidden="true" />
              </div>

              <div className="font-serif text-[20px] leading-tight tracking-tight text-[var(--measured-dark)]">
                {p.title}
              </div>

              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-[var(--measured-subtext)]">
                {p.tagline}
              </p>

              <div
                className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold"
                style={{ color: p.accent }}
              >
                Enter
                <ArrowRight
                  size={13}
                  strokeWidth={2.4}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--measured-border-soft)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 text-[12px] text-[var(--measured-subtext)]">
          <span>Measured Metabolics · Demo</span>
          <Link
            href="/"
            className="transition-colors hover:text-[var(--measured-dark)]"
          >
            Patient landing ↗
          </Link>
        </div>
      </footer>
    </main>
  );
}
