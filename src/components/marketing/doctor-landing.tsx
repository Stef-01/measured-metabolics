import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

const BOOKING_URL =
  "https://healthengine.com.au/doctor/nsw/beecroft/dr-anubhav-saxena/p123180";

// ── Protocol step illustrations ───────────────────────────────────────────────

function GlpVisual() {
  return (
    <svg
      viewBox="0 0 60 44"
      fill="none"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Horizontal reference grid */}
      <line
        x1="3"
        y1="12"
        x2="57"
        y2="12"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.18"
      />
      <line
        x1="3"
        y1="24"
        x2="57"
        y2="24"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.18"
      />
      <line
        x1="3"
        y1="36"
        x2="57"
        y2="36"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.18"
      />
      {/* Area under curve */}
      <path
        d="M 5 42 C 14 42 20 30 28 21 C 36 12 45 9 55 8 L 55 42 Z"
        fill="currentColor"
        opacity="0.07"
      />
      {/* Treatment response curve — gentle S rising over 6 months */}
      <path
        d="M 5 42 C 14 42 20 30 28 21 C 36 12 45 9 55 8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Baseline dot */}
      <circle cx="5" cy="42" r="2.5" fill="currentColor" opacity="0.3" />
      {/* Goal achieved — dot with halo */}
      <circle
        cx="55"
        cy="8"
        r="5.5"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.2"
      />
      <circle cx="55" cy="8" r="3" fill="currentColor" />
    </svg>
  );
}

function DexaVisual() {
  return (
    <svg
      viewBox="0 0 60 44"
      fill="none"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Scan reference line */}
      <line
        x1="4"
        y1="9"
        x2="56"
        y2="9"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.18"
        strokeDasharray="2 3"
      />
      {/* BEFORE — more fat (light top), less lean (medium bottom) */}
      <rect
        x="5"
        y="10"
        width="17"
        height="14"
        rx="2.5"
        fill="currentColor"
        opacity="0.13"
      />
      <rect
        x="5"
        y="26"
        width="17"
        height="14"
        rx="2.5"
        fill="currentColor"
        opacity="0.48"
      />
      {/* Arrow */}
      <path
        d="M 27 22 L 32 22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M 30 19.5 L 33 22 L 30 24.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* AFTER — less fat (light top), more lean (darker, taller bottom) */}
      <rect
        x="38"
        y="10"
        width="17"
        height="6"
        rx="2.5"
        fill="currentColor"
        opacity="0.13"
      />
      <rect
        x="38"
        y="18"
        width="17"
        height="22"
        rx="2.5"
        fill="currentColor"
        opacity="0.78"
      />
    </svg>
  );
}

function MealVisual() {
  // Plate: center (30,30), radius 20
  // Three equal 120° sectors starting from top (−90°)
  // a = top   = (30, 10)
  // b = lower-right = (30 + 20·cos 30°, 30 + 20·sin 30°) ≈ (47.3, 40)
  // c = lower-left  = (30 + 20·cos 150°, 30 + 20·sin 150°) ≈ (12.7, 40)
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Outer plate rim */}
      <circle
        cx="30"
        cy="30"
        r="26"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.12"
      />
      {/* Sector 1 — protein (top, darkest) */}
      <path
        d="M 30 30 L 30 10 A 20 20 0 0 1 47.3 40 Z"
        fill="currentColor"
        opacity="0.65"
      />
      {/* Sector 2 — vegetables (lower-right, medium) */}
      <path
        d="M 30 30 L 47.3 40 A 20 20 0 0 1 12.7 40 Z"
        fill="currentColor"
        opacity="0.28"
      />
      {/* Sector 3 — carbs / grains (lower-left, lightest) */}
      <path
        d="M 30 30 L 12.7 40 A 20 20 0 0 1 30 10 Z"
        fill="currentColor"
        opacity="0.12"
      />
      {/* White dividers */}
      <line
        x1="30"
        y1="30"
        x2="30"
        y2="10"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="30"
        y1="30"
        x2="47.3"
        y2="40"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="30"
        y1="30"
        x2="12.7"
        y2="40"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Centre circle */}
      <circle cx="30" cy="30" r="7" fill="white" opacity="0.95" />
    </svg>
  );
}

// ── Protocol data ─────────────────────────────────────────────────────────────

interface ProtocolStep {
  n: string;
  title: string;
  body: string;
  visual: ReactNode;
}

const PROTOCOL: ProtocolStep[] = [
  {
    n: "01",
    title: "GLP-1 therapy",
    body: "Six months of clinically guided GLP-1 receptor agonist therapy, titrated to your response and reviewed at every appointment.",
    visual: <GlpVisual />,
  },
  {
    n: "02",
    title: "DEXA body composition",
    body: "Baseline and completion DEXA scans measure fat mass, lean mass, and visceral fat — giving you objective before-and-after data.",
    visual: <DexaVisual />,
  },
  {
    n: "03",
    title: "Personalised meal planning",
    body: "Your dietitian builds a plan around your cuisine, preferences, and metabolic targets — with recipes adapted specifically for you.",
    visual: <MealVisual />,
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export function DoctorLanding() {
  return (
    <main className="min-h-dvh bg-white text-[var(--measured-dark)]">
      {/* ── Nav ──────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[var(--measured-border-soft)] bg-white/96 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="font-serif text-[20px] tracking-tight text-[var(--measured-dark)]">
            Measured
          </div>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--measured-green)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Book now
            <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" />
          </a>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-20 md:pt-32 md:pb-28">
        <p className="mb-6 inline-block rounded-full border border-[var(--measured-border)] px-3.5 py-1 text-[12px] font-medium text-[var(--measured-subtext)]">
          Health Optimisation Protocol · Beecroft NSW
        </p>
        <h1 className="font-serif text-[52px] leading-[1.02] tracking-tight text-[var(--measured-dark)] md:text-[72px]">
          A structured path
          <br />
          to metabolic health.
        </h1>
        <p className="mt-7 max-w-[520px] text-[17px] leading-relaxed text-[var(--measured-subtext)]">
          Dr Anubhav Saxena runs a medically supervised six-month program
          combining GLP-1 therapy, DEXA body composition scanning, and
          personalised dietitian-led meal planning.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-shadow inline-flex items-center gap-2 rounded-2xl bg-[var(--measured-green)] px-7 py-4 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Book a consultation
            <ArrowRight size={15} strokeWidth={2.4} aria-hidden="true" />
          </a>
          <span className="text-[13px] text-[var(--measured-subtext)]">
            via HealthEngine
          </span>
        </div>
      </section>

      <div className="border-t border-[var(--measured-border-soft)]" />

      {/* ── Protocol ─────────────────────────────────── */}
      <section className="bg-[var(--measured-cream)]">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
          <div className="mb-14">
            <h2 className="font-serif text-[38px] leading-tight tracking-tight text-[var(--measured-dark)]">
              The protocol
            </h2>
            <p className="mt-2 text-[15px] text-[var(--measured-subtext)]">
              Three integrated components. Six months.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            {PROTOCOL.map((step) => (
              <div key={step.n} className="relative">
                {/* Illustration — large, ghosted behind content */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 top-0 h-[100px] w-[112px] text-[var(--measured-green)] opacity-[0.09]"
                >
                  {step.visual}
                </div>

                <div
                  aria-hidden="true"
                  className="font-serif text-[52px] leading-none text-[var(--measured-green)]/20"
                >
                  {step.n}
                </div>
                <h3 className="mt-5 font-serif text-[22px] leading-tight text-[var(--measured-dark)]">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-[var(--measured-subtext)]">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-[var(--measured-border-soft)]" />

      {/* ── Doctor ───────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-20 md:py-24">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:gap-16">
          {/* Portrait */}
          <div className="shrink-0">
            <div className="relative h-[320px] w-[260px] overflow-hidden rounded-3xl bg-[var(--measured-cream)] shadow-[0_4px_32px_-4px_rgba(0,0,0,0.12)]">
              <Image
                src="/images/dr-saxena.jpeg"
                alt="Dr Anubhav Saxena"
                fill
                className="object-cover object-top"
                sizes="260px"
                priority
              />
            </div>
          </div>

          {/* Bio */}
          <div className="flex flex-col justify-center">
            <p className="text-[11px] font-medium text-[var(--measured-subtext)]">
              Your doctor
            </p>
            <h2 className="mt-4 font-serif text-[38px] leading-tight tracking-tight text-[var(--measured-dark)]">
              Dr Anubhav Saxena
            </h2>
            <p className="mt-1 text-[13px] text-[var(--measured-subtext)]">
              MBBS FRACGP MPhil BSc(Adv) DCH
            </p>
            <p className="mt-6 max-w-[460px] text-[16px] leading-relaxed text-[var(--measured-subtext)]">
              Dr Saxena is a Fellow of the Royal Australian College of General
              Practitioners with a research background in metabolic medicine. He
              designed the Health Optimisation Protocol to give patients a
              structured, evidence-based path to lasting weight and metabolic
              improvement — coordinated from his Beecroft practice.
            </p>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--measured-dark-green)] transition-opacity hover:opacity-70"
            >
              Book with Dr Saxena
              <ArrowRight size={14} strokeWidth={2.4} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA band ─────────────────────────────────── */}
      <section className="bg-[var(--measured-green)]">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center md:py-20">
          <h2 className="font-serif text-[40px] leading-tight tracking-tight text-white md:text-[48px]">
            Ready to start?
          </h2>
          <p className="mt-3 text-[15px] text-white/65">
            Book your initial consultation. Availability via HealthEngine.
          </p>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-[15px] font-semibold text-[var(--measured-dark-green)] shadow-[0_2px_16px_-2px_rgba(0,0,0,0.2)] transition-colors hover:bg-[var(--measured-cream)]"
          >
            Book on HealthEngine
            <ArrowRight size={15} strokeWidth={2.4} aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="border-t border-[var(--measured-border-soft)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 text-[12px] text-[var(--measured-subtext)]">
          <span>
            Dr Anubhav Saxena · Beecroft NSW · {new Date().getFullYear()}
          </span>
          <Link
            href="/demo"
            className="transition-colors hover:text-[var(--measured-dark)]"
          >
            Platform demo →
          </Link>
        </div>
      </footer>
    </main>
  );
}
