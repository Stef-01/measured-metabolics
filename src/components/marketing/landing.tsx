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
    },
    {
      id: "dietitian",
      title: "Dietitian Web",
      tagline: "Today's queue, patient panel, plan + report builders",
      href: "/d/dashboard",
      Icon: ClipboardList,
      footnote:
        "Keyboard-driven workflows. Approve, edit, flag — five meals reviewed in under five minutes.",
    },
    {
      id: "gp",
      title: "GP Sidebar",
      tagline: "30-second patient context inside Best Practice / MD",
      href: "/gp/asha/context",
      Icon: PanelRightClose,
      footnote:
        "360px column. Patient context, transcript paste, billing, care plan, dietitian referral, dietitian report.",
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

      <section className="mx-auto grid max-w-5xl gap-4 px-6 pb-24 md:grid-cols-3">
        {personas.map((p, idx) => (
          <PersonaCard key={p.id} persona={p} delay={idx * 0.06} />
        ))}
      </section>

      <footer className="mx-auto flex max-w-6xl items-center justify-between border-t border-[var(--measured-border-soft)] px-6 py-6 text-[12px] text-[var(--measured-subtext)]">
        <span>© Measured Metabolics · {new Date().getFullYear()}</span>
        <span>Stage 1 vibe build · mock data only</span>
      </footer>
    </main>
  );
}

interface Persona {
  id: "patient" | "dietitian" | "gp";
  title: string;
  tagline: string;
  href: string;
  Icon: typeof Stethoscope;
  footnote: string;
}

function PersonaCard({ persona, delay }: { persona: Persona; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
    >
      <Link
        href={persona.href}
        className="group relative block h-full overflow-hidden rounded-2xl border border-[var(--measured-border-soft)] bg-white p-6 shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-raised)]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]">
            <persona.Icon size={20} strokeWidth={2} aria-hidden="true" />
          </div>
          <div className="font-serif text-[20px] tracking-tight">
            {persona.title}
          </div>
        </div>
        <p className="mt-3 text-[14px] text-[var(--measured-dark)]">
          {persona.tagline}
        </p>
        <p className="mt-2 text-[12px] leading-relaxed text-[var(--measured-subtext)]">
          {persona.footnote}
        </p>
        <div className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--measured-dark-green)]">
          Enter
          <ArrowRight
            size={14}
            strokeWidth={2.2}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </div>
      </Link>
    </motion.div>
  );
}
