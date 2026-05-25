"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Stethoscope,
  Smartphone,
  ClipboardList,
  PanelRightClose,
  ArrowRight,
  Shield,
} from "lucide-react";
import { HERO } from "@/lib/images";

/**
 * Landing — role chooser for the Measured Metabolics demo.
 *
 * Stage 1 surface: lets demo viewers self-select into the patient / dietitian
 * / GP shells. Stage 5 replaces this with role-aware redirect after Supabase
 * Auth signs the user in.
 */
export function Landing() {
  const personas: Persona[] = [
    {
      id: "patient",
      title: "Patient PWA",
      tagline: "Capture meals, log symptoms, see your plan",
      href: "/p/home",
      Icon: Smartphone,
      footnote:
        "Phone-first surface with a single primary action: snap your next meal.",
      iconBg: "bg-[var(--measured-clinical-blue)]/10",
      iconColor: "text-[var(--measured-clinical-blue)]",
    },
    {
      id: "dietitian",
      title: "Dietitian Web",
      tagline: "Today's queue, patient panel, plan + report builders",
      href: "/d/dashboard",
      Icon: ClipboardList,
      footnote:
        "Keyboard-driven workflows. Approve, edit, flag — five meals reviewed in under five minutes.",
      iconBg: "bg-[var(--measured-green)]/10",
      iconColor: "text-[var(--measured-dark-green)]",
    },
    {
      id: "gp",
      title: "GP Sidebar",
      tagline: "30-second patient context inside Best Practice / MD",
      href: "/gp/asha/context",
      Icon: PanelRightClose,
      footnote:
        "360px column. Patient context, transcript paste, billing, care plan, dietitian referral, dietitian report.",
      iconBg: "bg-[var(--measured-gold)]/15",
      iconColor: "text-[#a07710]",
    },
    {
      id: "admin",
      title: "Admin Console",
      tagline: "KPI dashboard, audit log, organizations, users",
      href: "/admin/kpi",
      Icon: Shield,
      footnote:
        "North-star metrics, append-only audit trail, GP practice network, and env flags for stage roll-out.",
      iconBg: "bg-[var(--measured-evaluate)]/8",
      iconColor: "text-[var(--measured-evaluate)]",
    },
  ];

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[var(--measured-cream)] text-[var(--measured-dark)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <Image
          src={HERO.gradient}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.18]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--measured-cream)]/30 via-[var(--measured-cream)]/70 to-[var(--measured-cream)]" />
      </div>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--measured-green)] text-white shadow-[var(--shadow-card)]">
            <Stethoscope size={18} strokeWidth={2.2} aria-hidden="true" />
          </div>
          <div className="font-serif text-[20px] tracking-tight">Measured</div>
        </div>
        <span className="text-[12px] uppercase tracking-wider text-[var(--measured-subtext)]">
          Demo build · Stage&nbsp;1
        </span>
      </header>

      <section className="mx-auto max-w-3xl px-6 pt-20 pb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="font-serif text-[44px] leading-[1.05] tracking-tight md:text-[56px]"
        >
          Metabolic chronic care
          <br />
          made easier to deliver,
          <br />
          easier to follow, and
          <br />
          easier to coordinate.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
          className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-[var(--measured-subtext)]"
        >
          Three minimal interfaces sharing one clinical brain. Pick a persona to
          step inside the demo.
        </motion.p>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-4">
        {personas.map((p, idx) => (
          <PersonaCard key={p.id} persona={p} delay={idx * 0.06} />
        ))}
      </section>

      <footer className="mx-auto flex max-w-6xl items-center justify-between border-t border-[var(--measured-border-soft)] px-6 py-6 text-[12px] text-[var(--measured-subtext)]">
        <span>© Measured Metabolics · {new Date().getFullYear()}</span>
        <span>Beta · Pilot program</span>
      </footer>
    </main>
  );
}

interface Persona {
  id: "patient" | "dietitian" | "gp" | "admin";
  title: string;
  tagline: string;
  href: string;
  Icon: typeof Stethoscope;
  footnote: string;
  iconBg: string;
  iconColor: string;
}

function PersonaCard({ persona, delay }: { persona: Persona; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
      className="h-full"
    >
      <Link
        href={persona.href}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--measured-border-soft)] bg-white p-6 shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-raised)]"
      >
        <div className="mb-4">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${persona.iconBg} ${persona.iconColor}`}
          >
            <persona.Icon size={22} strokeWidth={2} aria-hidden="true" />
          </div>
        </div>
        <div className="font-serif text-[19px] leading-tight tracking-tight text-[var(--measured-dark)]">
          {persona.title}
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-[var(--measured-dark)]">
          {persona.tagline}
        </p>
        <p className="mt-2 flex-1 text-[11px] leading-relaxed text-[var(--measured-subtext)]">
          {persona.footnote}
        </p>
        <div className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--measured-dark-green)]">
          Enter
          <ArrowRight
            size={14}
            strokeWidth={2.4}
            className="transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </div>
      </Link>
    </motion.div>
  );
}
