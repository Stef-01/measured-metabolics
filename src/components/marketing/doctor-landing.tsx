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
      <path
        d="M 5 42 C 14 42 20 30 28 21 C 36 12 45 9 55 8 L 55 42 Z"
        fill="currentColor"
        opacity="0.07"
      />
      <path
        d="M 5 42 C 14 42 20 30 28 21 C 36 12 45 9 55 8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="5" cy="42" r="2.5" fill="currentColor" opacity="0.3" />
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

function BodyScanVisual() {
  return (
    <svg
      viewBox="0 0 60 66"
      fill="none"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Head */}
      <circle cx="30" cy="11" r="8" stroke="currentColor" strokeWidth="1.2" />
      {/* Neck */}
      <path
        d="M 26 19 L 26 23 L 34 23 L 34 19"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.5"
      />
      {/* Torso */}
      <rect
        x="18"
        y="23"
        width="24"
        height="33"
        rx="8"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      {/* Horizontal scan lines crossing full width */}
      {[29, 35, 41, 47, 53].map((y) => (
        <line
          key={y}
          x1="4"
          y1={y}
          x2="56"
          y2={y}
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.35"
        />
      ))}
      {/* Active scan beam */}
      <rect
        x="4"
        y="39.5"
        width="52"
        height="3"
        rx="1.5"
        fill="currentColor"
        opacity="0.14"
      />
      <line
        x1="4"
        y1="41"
        x2="56"
        y2="41"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// ── Protocol data ─────────────────────────────────────────────────────────────

interface ProtocolStep {
  n: string;
  title: string;
  body: string;
  visual: ReactNode;
  visualOpacity: number;
}

const PROTOCOL: ProtocolStep[] = [
  {
    n: "01",
    title: "CGM monitored GLP1 therapy",
    body: "Six months of clinically guided GLP-1 receptor agonist therapy, titrated to your response with continuous glucose monitoring at every step.",
    visual: <GlpVisual />,
    visualOpacity: 0.09,
  },
  {
    n: "02",
    title: "DEXA body composition",
    body: "Baseline and completion DEXA scans measure fat mass, lean mass, and visceral fat — giving you objective before-and-after data.",
    visual: <BodyScanVisual />,
    visualOpacity: 0.09,
  },
  {
    n: "03",
    title: "Personalised meal planning",
    body: "Your dietitian builds a plan around your cuisine, preferences, and metabolic targets — with recipes adapted specifically for you.",
    visual: (
      <div className="relative h-full w-full overflow-hidden rounded-2xl">
        <Image
          src="/images/meals/mediterranean-bowl.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="112px"
        />
      </div>
    ),
    visualOpacity: 0.28,
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
                {/* Visual — ghosted behind content */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 top-0 h-[100px] w-[112px] text-[var(--measured-green)]"
                  style={{ opacity: step.visualOpacity }}
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
