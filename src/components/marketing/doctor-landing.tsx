"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useRef,
  useState,
  useEffect,
  useMemo,
  createContext,
  useContext,
} from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ── Funnel context ────────────────────────────────────────────────────────────
const FunnelCtx = createContext<() => void>(() => {});
function useOpenFunnel() {
  return useContext(FunnelCtx);
}

// ── Scroll reveal ─────────────────────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-7% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: delay / 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Eyebrow ───────────────────────────────────────────────────────────────────
function Eyebrow({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <span
      className={
        "inline-flex items-center gap-2 text-[0.74rem] font-semibold tracking-[0.14em] uppercase text-lav " +
        (center ? "justify-center" : "")
      }
    >
      <span className="w-2 h-2 rounded-full grad-dot inline-block shrink-0" />
      {children}
    </span>
  );
}

// ── Button ────────────────────────────────────────────────────────────────────
function Btn({
  children,
  variant = "primary",
  lg,
  href,
  onClick,
  className = "",
  disabled,
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "white" | "dark";
  lg?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  const base =
    "inline-flex items-center gap-2 font-semibold rounded-full border transition-all duration-200 whitespace-nowrap cursor-pointer " +
    (lg ? "text-base px-7 py-[1.05rem] " : "text-[0.92rem] px-6 py-[0.85rem] ");
  const vs: Record<string, string> = {
    primary:
      "bg-lav text-white border-transparent shadow-[0_8px_22px_-8px_rgba(108,92,231,.6)] hover:-translate-y-0.5",
    ghost:
      "bg-transparent text-brand-ink border-brand-line2 hover:bg-brand-bgsoft",
    white:
      "bg-white text-brand-ink border-brand-line2 hover:border-brand-ink hover:-translate-y-0.5",
    dark: "bg-brand-ink text-white border-transparent hover:-translate-y-0.5",
  };
  const cls = base + (vs[variant] ?? "") + " " + className;
  if (href)
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cls + (disabled ? " opacity-40 cursor-not-allowed" : "")}
    >
      {children}
    </button>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Nav
// ══════════════════════════════════════════════════════════════════════════════
function LandingNav() {
  const openFunnel = useOpenFunnel();
  const links: [string, string][] = [
    ["About Us", "#doctor"],
    ["How It Works", "#journey"],
    ["What We Test", "#test"],
    ["Programs", "#program"],
    ["Pricing", "#pricing"],
    ["FAQ", "#faq"],
  ];
  return (
    <header className="fixed top-3.5 inset-x-0 z-[100] flex justify-center px-3.5">
      <div
        className="w-full max-w-[1320px] flex items-center justify-between gap-6 rounded-full px-2.5 py-2 pl-6 border backdrop-blur-xl"
        style={{
          background: "rgba(38,38,48,.5)",
          borderColor: "rgba(255,255,255,.14)",
          boxShadow: "0 10px 34px -14px rgba(20,18,40,.5)",
        }}
      >
        <a
          href="#top"
          className="font-disp text-[1.35rem] font-extrabold tracking-tight text-white leading-none"
        >
          Measured<span className="text-white/60 font-bold">Rx</span>
        </a>
        <nav className="hidden lg:flex items-center gap-7">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-[0.85rem] font-medium text-white/80 hover:text-white transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#"
            className="hidden sm:block text-white px-5 py-2.5 rounded-full text-[0.88rem] font-semibold transition-colors whitespace-nowrap"
            style={{ background: "rgba(15,15,22,.5)" }}
          >
            Login
          </a>
          <button
            onClick={openFunnel}
            className="bg-white text-brand-ink px-6 py-2.5 rounded-full text-[0.88rem] font-bold hover:-translate-y-0.5 transition-transform whitespace-nowrap"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Hero
// ══════════════════════════════════════════════════════════════════════════════
function Hero() {
  const openFunnel = useOpenFunnel();
  return (
    <section
      id="top"
      className="relative overflow-hidden text-center pt-[clamp(8rem,16vh,11rem)] pb-[clamp(3rem,6vw,5rem)]"
    >
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-[12%] w-[min(900px,90vw)] h-[560px] z-0"
        style={{
          background:
            "radial-gradient(closest-side,rgba(124,108,240,.16),rgba(124,108,240,0) 70%)",
        }}
      />
      <div className="absolute top-[8%] right-[14%] w-28 h-28 rounded-full grad-dot blur-[2px] opacity-50 z-0" />
      <div className="relative z-[1] max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
        <Reveal>
          <Eyebrow center>Precision metabolic medicine · Australia</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="font-disp font-extrabold tracking-[-.035em] leading-[.99] text-[clamp(2.7rem,6vw,5rem)] mt-6 mx-auto max-w-[15ch] text-brand-ink">
            The most precise way to{" "}
            <span className="text-lav">optimise</span> your metabolism.
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-7 mx-auto max-w-[42rem] text-[clamp(1.05rem,1.25vw,1.3rem)] leading-[1.55] text-brand-ink2">
            Pathology-validated testing, CGM-guided GLP-1 therapy, and a doctor
            who turns your data into a plan built around the life you actually
            live — medication delivered, Australia-wide.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-9 flex gap-3.5 justify-center flex-wrap">
            <Btn lg onClick={openFunnel}>
              Take the assessment <span>→</span>
            </Btn>
            <Btn lg variant="ghost" href="#journey">
              How it works
            </Btn>
          </div>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-9 flex gap-6 justify-center flex-wrap text-[0.82rem] text-brand-muted">
            {[
              "AHPRA-registered clinicians",
              "Reviewed in 24–48 hours",
              "Telehealth Australia-wide",
            ].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <span className="w-[7px] h-[7px] rounded-full grad-dot inline-block" />
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Difference
// ══════════════════════════════════════════════════════════════════════════════
function Difference() {
  return (
    <section className="sec-pad bg-white relative overflow-hidden">
      <div className="max-w-[820px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] text-center">
        <Reveal>
          <Eyebrow center>The Measured difference</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4 text-brand-ink">
            Weight and metabolism are{" "}
            <span className="text-lav">biology</span> — not willpower.
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <div className="mt-7 space-y-5 text-[1.05rem] leading-[1.7] text-brand-ink2">
            <p>
              For most people, appetite, energy and weight are driven by biology
              — and for years the only options were generic diet advice or long
              waits to see someone who could actually help.
            </p>
            <p>
              Measured was built to change that. We pair pathology-validated
              testing and continuous glucose data with a registered clinician who
              prescribes evidence-based therapy where appropriate — and a plan
              that adapts as your body responds.
            </p>
            <p className="text-brand-ink font-semibold">
              Not a fad. Not a crash diet. A genuine medical approach, built
              around real life.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// What We Test — marquee chips
// ══════════════════════════════════════════════════════════════════════════════
function WhatWeTest() {
  const rows: [string, string][][] = [
    [
      ["g4", "Hormonal Health"],
      ["g2", "Metabolic Health"],
      ["g3", "Cardiovascular Health"],
      ["g5", "Glucose & Insulin"],
      ["g8", "Body Composition"],
    ],
    [
      ["g3", "Blood & Immune Health"],
      ["g4", "Thyroid Function"],
      ["g7", "Nutrient Status"],
      ["g9", "Liver & Kidney"],
      ["g10", "Inflammation"],
    ],
    [
      ["g10", "Inflammation & Recovery"],
      ["g3", "Muscle Function"],
      ["g5", "Genetic & Tolerance"],
      ["g6", "Gut & Microbiome"],
      ["g1", "Sleep & Stress"],
    ],
  ];
  return (
    <section id="test" className="sec-pad bg-white overflow-hidden">
      <div className="max-w-[900px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] text-center mb-[clamp(2.5rem,5vw,3.8rem)]">
        <Reveal>
          <Eyebrow center>What we test</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4 text-brand-ink">
            Pathology-validated testing across{" "}
            <span className="text-lav">every key system</span>.
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-5 text-[clamp(1.05rem,1.25vw,1.3rem)] text-brand-ink2">
            Not a one-off snapshot — a personalised baseline, tracked over time.
          </p>
        </Reveal>
      </div>
      <div className="flex flex-col gap-4 marquee-mask">
        {rows.map((row, i) => (
          <div key={i} className={"mq-row r" + (i + 1)}>
            {row.concat(row).map(([g, label], j) => (
              <span
                key={j}
                className="inline-flex items-center gap-2.5 bg-white border border-brand-line rounded-full pl-2 pr-5 py-2 shadow-lav-soft whitespace-nowrap"
              >
                <span className={"w-8 h-8 rounded-full shrink-0 " + g} />
                <b className="font-semibold text-[0.98rem] text-brand-ink">
                  {label}
                </b>
              </span>
            ))}
          </div>
        ))}
      </div>
      <p className="text-center mt-[clamp(2.2rem,4vw,3rem)] text-[0.85rem] text-brand-muted max-w-[680px] mx-auto px-6">
        <span className="text-lav">✦</span> Testing depth varies by program
        tier. Metabolic precision and genetic &amp; tolerance markers are
        reviewed by AHPRA-registered practitioners.
      </p>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Progress Tracked
// ══════════════════════════════════════════════════════════════════════════════
function ProgressTracked() {
  const openFunnel = useOpenFunnel();
  const rows: [string, string, string, "optimal" | "monitor" | "action"][] = [
    ["Starting weight", "98.4 kg", "Baseline", "monitor"],
    ["Current weight", "91.1 kg", "−7.3 kg", "optimal"],
    ["Body weight lost", "7.4%", "On track", "optimal"],
    ["Current dose", "0.5 mg / week", "Week 8", "optimal"],
    ["Appetite control", "Strong", "Improved", "optimal"],
    ["Waist", "−6 cm", "Since start", "optimal"],
    ["Energy", "Steady", "Monitor", "monitor"],
    ["Next check-in", "12 Jun", "Scheduled", "action"],
  ];
  const toneClass = {
    optimal: "text-emerald-600 bg-emerald-50",
    monitor: "text-amber-600 bg-amber-50",
    action: "text-lav bg-lavsoft",
  };
  return (
    <section className="sec-pad grad-blue relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          background: "radial-gradient(600px circle at 80% 20%, #fff, transparent)",
        }}
      />
      <div className="relative z-[1] max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] grid lg:grid-cols-2 gap-[clamp(2rem,5vw,4.5rem)] items-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 text-[0.74rem] font-semibold tracking-[0.14em] uppercase text-white/85">
            <span className="w-2 h-2 rounded-full bg-white inline-block" />
            Your progress, tracked
          </span>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.04] mt-4 text-white">
            Every week tells{" "}
            <span className="text-white/70 italic">part of your story</span>.
          </h2>
          <p className="mt-5 text-[1.08rem] leading-[1.6] text-white/80 max-w-[34rem]">
            Weigh-ins, dose, appetite and measurements flow into one place — so
            you and your clinician can see exactly what&apos;s working, and adjust
            before anything stalls.
          </p>
          <div className="mt-8">
            <Btn lg variant="white" onClick={openFunnel}>
              Start tracking <span>→</span>
            </Btn>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div
            className="rounded-[22px] p-5"
            style={{
              background: "rgba(255,255,255,.07)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,.15)",
              boxShadow: "var(--shadow-lav-card)",
            }}
          >
            <div className="flex items-center justify-between text-white/85 text-[0.82rem] font-semibold pb-3 border-b border-white/15">
              <span>Your Plan — Active</span>
              <span className="text-white/55 font-normal">
                Updated today · 08:42 AEST
              </span>
            </div>
            <div className="divide-y divide-white/10">
              {rows.map(([label, val, status, tone]) => (
                <div
                  key={label}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-3 py-2.5"
                >
                  <span className="text-white/70 text-[0.88rem]">{label}</span>
                  <span className="text-white font-semibold text-[0.92rem] tabular-nums">
                    {val}
                  </span>
                  <span
                    className={
                      "text-[0.66rem] font-semibold px-2 py-1 rounded-full " +
                      toneClass[tone]
                    }
                  >
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Journey — interactive accordion + panel
// ══════════════════════════════════════════════════════════════════════════════
const JOURNEY_STEPS: [string, string][] = [
  [
    "Health Assessment",
    "A guided intake captures your history, goals, and baseline — so your clinician can assess safety, suitability, and where to focus.",
  ],
  [
    "Pathology Testing",
    "Pathology-validated bloods, CGM, and DEXA build a complete, objective picture of your metabolism — not a single snapshot.",
  ],
  [
    "Telehealth Consultation",
    "Your doctor walks you through every result and what it means — then designs your protocol with you, over telehealth or in person.",
  ],
  [
    "Personalised Care Plan",
    "Biomarker tracking, platform access, and enrolment in the Health Optimisation Protocol — with therapy and meals adapted to you.",
  ],
  [
    "Ongoing Review",
    "Repeat panels track your biomarkers over time, so your plan keeps adjusting as your body responds. Progress you can see.",
  ],
];

function PhotoCard({
  src,
  alt,
  title,
  sub,
  tall,
  children,
}: {
  src: string;
  alt: string;
  title: string;
  sub: string;
  tall?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={
        "relative rounded-2xl overflow-hidden text-white min-h-[220px] flex flex-col justify-between " +
        (tall ? "row-span-2" : "")
      }
    >
      <Image src={src} alt={alt} fill className="object-cover z-0" sizes="300px" />
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: "linear-gradient(180deg,rgba(10,10,20,.15),rgba(10,10,20,.72))",
        }}
      />
      <div className="relative z-[2] p-[1.1rem]">
        <div className="font-bold text-base">{title}</div>
        <div className="text-[0.78rem] opacity-85 mt-0.5 leading-snug">{sub}</div>
      </div>
      {children}
    </div>
  );
}

function PlainCard({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-brand-line bg-white p-[1.1rem]">
      <div className="font-bold text-base text-brand-ink">{title}</div>
      <div className="text-[0.78rem] text-brand-muted mt-0.5 leading-snug">{sub}</div>
    </div>
  );
}

function JourneyPanel({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <div>
        <div className="flex items-center gap-3 px-1.5 pb-4 pt-1">
          <span className="text-[0.72rem] text-brand-muted whitespace-nowrap">
            Section · 2/4
          </span>
          <span className="flex gap-1.5 flex-1">
            {[1, 1, 0, 0].map((on, i) => (
              <i
                key={i}
                className={
                  "h-[5px] flex-1 rounded-full not-italic " +
                  (on
                    ? "bg-gradient-to-r from-brand-blue to-[#7aa5ff]"
                    : "bg-brand-line2")
                }
              />
            ))}
          </span>
        </div>
        <div className="border border-brand-line rounded-2xl p-6">
          <h4 className="font-disp text-[1.1rem] font-bold tracking-tight text-brand-ink">
            Medical History
          </h4>
          <p className="text-[0.84rem] text-brand-muted mt-1">
            Share your medical history so your clinician can assess safety, risks,
            and suitability.
          </p>
          <div className="flex gap-2.5 items-start bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-3 mt-4">
            <span className="text-emerald-600 font-bold">✓</span>
            <div>
              <b className="text-emerald-700 text-[0.86rem] block">
                Healthy weight (BMI 18.5–24.9)
              </b>
              <p className="text-emerald-600 text-[0.78rem]">
                Your BMI of 23.5 falls within the healthy range.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 mt-4">
            {(
              [
                ["Height (cm)", "175 cm"],
                ["Weight (kg)", "72 kg"],
              ] as [string, string][]
            ).map(([l, v]) => (
              <div key={l}>
                <label className="text-[0.8rem] font-semibold block mb-1.5 text-brand-ink">
                  {l} <span className="text-lav">*</span>
                </label>
                <div className="border border-brand-line2 rounded-lg bg-brand-bgsoft px-3.5 py-2.5 text-[0.9rem] text-brand-ink2">
                  {v}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="text-[0.8rem] font-semibold block mb-1.5 text-brand-ink">
              Do you have any allergies? <span className="text-lav">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <span className="flex items-center gap-2 border border-brand-line2 rounded-lg px-3 py-2.5 text-[0.88rem] text-brand-ink2">
                <span className="w-4 h-4 rounded-full border-[1.5px] border-brand-line2 inline-block" />
                Yes
              </span>
              <span className="flex items-center gap-2 border border-lav bg-lavtint rounded-lg px-3 py-2.5 text-[0.88rem] text-brand-ink">
                <span
                  className="w-4 h-4 rounded-full border-[1.5px] border-lav inline-block"
                  style={{
                    background: "radial-gradient(circle,var(--lav) 40%,transparent 45%)",
                  }}
                />
                No
              </span>
            </div>
          </div>
        </div>
      </div>
    );

  if (idx === 1)
    return (
      <div className="grid grid-cols-2 gap-4">
        <PhotoCard
          tall
          src="/images/assets/run-outdoor.jpg"
          alt="Outdoor run"
          title="Biomarker Overview"
          sub="Latest results from your metabolic panel"
        >
          <div className="relative z-[2] mx-[1.2rem] mb-[1.1rem]">
            <div className="h-[7px] rounded-full bg-white/30 relative">
              <i className="absolute left-0 top-0 h-full w-[62%] rounded-full bg-white not-italic" />
            </div>
            <div className="flex justify-between text-[0.62rem] opacity-80 mt-1.5">
              <span>6 optimal</span>
              <span>42 in range</span>
              <span>3 out</span>
            </div>
            <div className="flex justify-between items-baseline mt-1.5 font-bold">
              <span>Total</span>
              <b className="text-[1.3rem]">97</b>
            </div>
          </div>
        </PhotoCard>
        <PhotoCard
          src="/images/assets/lake-calm.jpg"
          alt="Lake"
          title="Next panel"
          sub="Complete your CGM + DEXA to track changes over time."
        />
        <PlainCard
          title="DEXA & CGM"
          sub="Body composition and a 14-day glucose monitor, fitted at your first visit."
        />
      </div>
    );

  if (idx === 2)
    return (
      <div className="grid grid-cols-2 gap-4">
        <PhotoCard
          tall
          src="/images/assets/hiker-point.jpg"
          alt="Consultation"
          title="Telehealth Consultation"
          sub="Every result, explained — your protocol, designed with you."
        />
        <PlainCard title="Your clinician" sub="Dr Anubhav Saxena · MBBS, FRACGP, MPhil" />
        <PlainCard
          title="Booked"
          sub="45-minute review · telehealth or in person, your choice."
        />
      </div>
    );

  if (idx === 4)
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="grad-blue text-white rounded-2xl p-5 col-span-2 min-h-[150px] flex flex-col">
          <div className="font-bold">Biological age — trending down</div>
          <div className="text-[0.8rem] opacity-85">Tracked across repeat panels</div>
          <div className="font-disp font-extrabold text-[2.6rem] mt-auto leading-none">
            −2.5<span className="text-base font-semibold opacity-80"> yrs</span>
          </div>
        </div>
        <PlainCard title="Repeat panel" sub="Due in 6 weeks · keeps your protocol optimised." />
        <PlainCard title="Visceral fat" sub="↓ 14% since baseline DEXA" />
      </div>
    );

  // idx === 3 — dashboard
  return (
    <div className="grid grid-cols-2 gap-4">
      <PhotoCard
        tall
        src="/images/assets/mtn-light.jpg"
        alt="Mountain landscape"
        title="Biomarker Overview"
        sub="Latest results from your metabolic panel"
      >
        <div className="relative z-[2] mx-[1.2rem] mb-[1.1rem]">
          <div className="h-[7px] rounded-full bg-white/30 relative">
            <i className="absolute left-0 top-0 h-full w-[62%] rounded-full bg-white not-italic" />
          </div>
          <div className="flex justify-between items-baseline mt-2 font-bold">
            <span>Total</span>
            <b className="text-[1.3rem]">97</b>
          </div>
        </div>
      </PhotoCard>
      <div className="grad-blue text-white rounded-2xl p-5 flex flex-col gap-1 min-h-[200px]">
        <div className="font-bold">Biological age</div>
        <div className="text-[0.78rem] opacity-85">
          2.5 years younger than your calendar age
        </div>
        <div className="font-disp font-extrabold text-[3.2rem] mt-auto leading-none tracking-tight">
          27.5
        </div>
        <div className="h-[5px] rounded-full bg-white/30 relative mt-3">
          <span className="absolute left-[46%] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow inline-block" />
        </div>
        <div className="flex justify-between text-[0.62rem] opacity-80 mt-2">
          <span>−5</span>
          <span>Current</span>
          <span>+5</span>
        </div>
      </div>
      <div className="rounded-2xl border border-brand-line bg-white p-[1.1rem]">
        <div className="font-bold text-brand-ink">Action Plan</div>
        <div className="text-[0.78rem] text-brand-muted mb-1">Your current protocol</div>
        {(
          [
            ["Oral therapy", "Daily · review in 4 weeks"],
            ["GLP-1 (titrated)", "Weekly · CGM-monitored"],
            ["Nutrient support", "Daily · personalised"],
          ] as [string, string][]
        ).map(([n, p]) => (
          <div
            key={n}
            className="flex items-center gap-2.5 py-2 border-b border-brand-line last:border-0"
          >
            <span className="w-[30px] h-9 rounded-md shrink-0 bg-gradient-to-b from-[#eceaf6] to-[#d9d4ee]" />
            <div>
              <div className="text-[0.82rem] font-semibold text-brand-ink">{n}</div>
              <div className="text-[0.66rem] text-brand-muted">{p}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-brand-line bg-white p-[1.1rem] text-center">
        <div className="font-bold text-brand-ink text-left">Consultations</div>
        <div className="text-[0.78rem] text-brand-muted text-left">
          Remaining this period
        </div>
        <div className="w-[120px] h-[120px] rounded-full mx-auto my-2 grid place-items-center ring-prog relative">
          <div className="absolute inset-3 rounded-full bg-white" />
          <span className="relative font-disp font-extrabold text-[1.5rem] text-brand-ink">
            1/4
          </span>
        </div>
        <div className="text-[0.6rem] text-brand-muted font-semibold">used</div>
      </div>
    </div>
  );
}

function Journey() {
  const [active, setActive] = useState(0);
  return (
    <section id="journey" className="sec-pad bg-brand-bgsoft">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
        <Reveal className="max-w-[760px] mb-[clamp(2.5rem,4vw,3.5rem)]">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4 text-brand-ink">
            Your journey with <span className="text-lav">Measured</span>.
          </h2>
        </Reveal>
        <div className="grid lg:grid-cols-[0.82fr_1.18fr] gap-[clamp(2rem,4vw,3.5rem)] items-start">
          <Reveal className="flex flex-col">
            {JOURNEY_STEPS.map(([title, body], i) => (
              <div
                key={i}
                onClick={() => setActive(i)}
                className="py-6 border-t border-brand-line2 first:border-t-0 cursor-pointer grid grid-cols-[auto_1fr] gap-x-[1.1rem] items-baseline"
              >
                <span
                  className={
                    "text-[0.8rem] font-bold tracking-wide " +
                    (active === i ? "text-lav" : "text-brand-muted")
                  }
                >
                  {String(i + 1).padStart(2, "0")}/
                </span>
                <span
                  className={
                    "font-disp font-extrabold tracking-[-.03em] text-[clamp(1.5rem,2.4vw,2.1rem)] transition-colors " +
                    (active === i ? "text-brand-ink" : "text-brand-muted")
                  }
                >
                  {title}
                </span>
                <div
                  className={
                    "col-start-2 overflow-hidden transition-all duration-300 " +
                    (active === i ? "max-h-[220px] opacity-100 mt-3" : "max-h-0 opacity-0")
                  }
                >
                  <p className="text-brand-ink2 text-base leading-relaxed">{body}</p>
                  {active === i && (
                    <div className="h-0.5 mt-5 rounded-full overflow-hidden bg-brand-line2">
                      <div className="h-full w-full bg-gradient-to-r from-lav to-brand-blue jbar-fill" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Reveal>
          <Reveal delay={120} className="lg:sticky lg:top-24">
            <div className="bg-white border border-brand-line rounded-[22px] shadow-lav-card p-5 min-h-[520px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <JourneyPanel idx={active} />
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Everything Included
// ══════════════════════════════════════════════════════════════════════════════
const ICONS: Record<string, string> = {
  pill: "M10.5 20.5 3.5 13.5a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7zM8 8l8 8",
  cross:
    "M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h5v5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2z",
  leaf: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10zM2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",
  chat: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z",
  heart:
    "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.84-8.84a5.5 5.5 0 0 0 0-7.78z",
  chart: "M3 3v18h18M7 14l4-4 3 3 5-6",
  truck:
    "M1 3h15v13H1zM16 8h4l3 3v5h-7M5.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  tag: "M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.58a2 2 0 0 1 0 2.83zM7 7h.01",
  refresh:
    "M23 4v6h-6M1 20v-6h6M3.5 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.5 15",
  shield:
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4",
};

function Ico({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
    >
      <path d={d} />
    </svg>
  );
}

function EverythingIncluded() {
  const items: [string, string, string, string][] = [
    [
      "pill",
      "Prescription GLP-1 therapy",
      "Semaglutide · Tirzepatide · clinician-titrated",
      "Where clinically appropriate, your doctor prescribes an evidence-based GLP-1 medication and adjusts your dose over time — shipped discreetly to your door.",
    ],
    [
      "cross",
      "Clinician oversight",
      "Eligibility · dose management · monitoring",
      "An AHPRA-registered doctor oversees your care from start to finish — confirming eligibility, managing your dose, and monitoring how you respond.",
    ],
    [
      "leaf",
      "Personalised nutrition",
      "Protein-first · muscle preservation · your cuisine",
      "Nutrition built for GLP-1 treatment and your CGM response — losing fat while preserving muscle, with recipes around foods you actually enjoy.",
    ],
    [
      "chart",
      "Progress tracking",
      "Weekly weigh-ins · CGM trends · DEXA",
      "Log weight, glucose and measurements in your portal and watch the trend over time — so you and your doctor can see what&apos;s working.",
    ],
    [
      "chat",
      "24/7 messaging support",
      "Ask anytime · real people · discreet",
      "Message your care team whenever you need — a question about your medication, a side effect, or your plan. Real support, whenever it matters.",
    ],
    [
      "heart",
      "Metabolic health benefits",
      "Blood sugar · blood pressure · cholesterol",
      "Beyond the scales, treatment can support healthier blood sugar, blood pressure and cholesterol — your doctor keeps an eye on the whole picture.",
    ],
    [
      "truck",
      "Discreet home delivery",
      "Plain packaging · Australia-wide · refills",
      "Your medication arrives in discreet, plain packaging, shipped Australia-wide — with refills coordinated so you never miss a dose.",
    ],
    [
      "refresh",
      "Long-term maintenance",
      "Maintenance dosing · habits · reviews",
      "Reaching your goal is the start, not the finish. Your doctor helps you transition to a maintenance plan designed to keep results for good.",
    ],
    [
      "tag",
      "Transparent pricing",
      "One monthly price · medication included",
      "One simple monthly price covers your consultations, clinical support and medication. No surprise fees — pause or cancel anytime.",
    ],
  ];
  return (
    <section id="included" className="sec-pad bg-brand-bgsoft">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
        <Reveal className="max-w-[700px] mb-[clamp(2.5rem,4vw,3.4rem)]">
          <Eyebrow>Everything included</Eyebrow>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4 text-brand-ink">
            More than a prescription.
          </h2>
          <p className="mt-4 text-[clamp(1.05rem,1.25vw,1.3rem)] text-brand-ink2 leading-[1.55]">
            Every plan combines medication, clinical oversight and real human
            support — so you&apos;re guided from your first dose to your goal, and
            beyond.
          </p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(([icon, title, tags, desc], i) => (
            <Reveal
              key={title}
              delay={(i % 3) * 70}
              className="bg-white border border-brand-line rounded-2xl p-6 shadow-lav-soft hover:shadow-lav-card hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-lavsoft text-lav grid place-items-center">
                <Ico d={ICONS[icon]} />
              </div>
              <h3 className="font-disp text-[1.15rem] font-bold tracking-tight mt-4 text-brand-ink">
                {title}
              </h3>
              <div className="text-[0.74rem] text-lav font-semibold mt-1.5 uppercase tracking-wide">
                {tags}
              </div>
              <p className="text-[0.94rem] text-brand-ink2 leading-relaxed mt-3">
                {desc}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Program
// ══════════════════════════════════════════════════════════════════════════════
function Program() {
  const rows: [string, string, string, string, string][] = [
    [
      "6",
      "Months",
      "CGM-monitored GLP-1 therapy",
      "Six months of clinically guided GLP-1 receptor agonist therapy, titrated to your response with continuous glucose monitoring at every step.",
      "/images/protocol/cgm.jpg",
    ],
    [
      "∞",
      "Throughout",
      "Personalised meal planning",
      "Your doctor builds a plan around your cuisine, preferences, and metabolic targets — with recipes adapted specifically for you.",
      "/images/meals/poha-grain-bowl.jpg",
    ],
    [
      "2",
      "Scans",
      "DEXA body composition",
      "Baseline and completion DEXA scans measure fat mass, lean mass, and visceral fat — giving you objective before-and-after data.",
      "/images/protocol/dexa.jpg",
    ],
  ];
  return (
    <section id="program" className="sec-pad bg-white">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
        <Reveal className="max-w-[680px] mb-[clamp(2.5rem,4vw,3.4rem)]">
          <Eyebrow>The Health Optimisation Protocol</Eyebrow>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4 text-brand-ink">
            Your six months,{" "}
            <span className="text-lav">step by step</span>.
          </h2>
          <p className="mt-4 text-[clamp(1.05rem,1.25vw,1.3rem)] text-brand-ink2 leading-[1.55]">
            A structured, physician-led program built on continuous data — not
            guesswork. From baseline to before-and-after.
          </p>
        </Reveal>
        <div className="grid gap-4">
          {rows.map(([num, lab, h, p, img], i) => (
            <Reveal
              key={h}
              delay={i * 80}
              className="grid grid-cols-[90px_1.1fr] md:grid-cols-[90px_1.1fr_1fr] bg-white border border-brand-line rounded-[18px] overflow-hidden shadow-lav-soft hover:shadow-lav-card hover:-translate-y-1 transition-all duration-300"
            >
              <div className="bg-lavtint text-lav flex flex-col items-center justify-center text-center gap-0.5 p-4">
                <span className="font-disp text-[2rem] font-extrabold">{num}</span>
                <span className="text-[0.58rem] tracking-widest uppercase text-lav2">
                  {lab}
                </span>
              </div>
              <div className="px-7 py-6 flex flex-col justify-center">
                <h3 className="font-disp text-[clamp(1.25rem,1.8vw,1.6rem)] font-bold tracking-tight text-brand-ink">
                  {h}
                </h3>
                <p className="mt-2 text-brand-ink2 text-[0.98rem] leading-relaxed">{p}</p>
              </div>
              <div className="hidden md:block overflow-hidden min-h-[170px] relative">
                <Image
                  src={img}
                  alt={h}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="400px"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Pricing
// ══════════════════════════════════════════════════════════════════════════════
function Pricing() {
  const openFunnel = useOpenFunnel();
  const includes = [
    "Prescription GLP-1 medication included",
    "Online clinician assessment & ongoing reviews",
    "Pathology, CGM & DEXA baseline testing",
    "Personalised dose plan, adjusted over time",
    "1:1 care coaching & nutrition support",
    "24/7 messaging with your care team",
    "Discreet home delivery & refills, Australia-wide",
  ];
  const notes = [
    "Prescription medication is only issued after an online consultation with a registered clinician.",
    "GLP-1 treatment is not suitable for everyone — eligibility is determined by your clinician.",
    "Not covered by Medicare or private health insurance — a fully private telehealth service.",
    "Results vary and depend on your starting point, treatment plan and lifestyle changes.",
  ];
  return (
    <section id="pricing" className="sec-pad bg-white">
      <div className="max-w-[1100px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
        <Reveal className="max-w-[680px] mb-[clamp(2.5rem,4vw,3.4rem)]">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4 text-brand-ink">
            One simple plan.{" "}
            <span className="text-lav">Medication included</span>.
          </h2>
          <p className="mt-4 text-[clamp(1.05rem,1.25vw,1.3rem)] text-brand-ink2 leading-[1.55]">
            No tiers to decode, no surprise add-ons. One monthly price covers
            your clinician, your support team and your GLP-1 medication —
            shipped to your door.
          </p>
        </Reveal>
        <Reveal className="grid lg:grid-cols-[1.4fr_1fr] rounded-[22px] overflow-hidden border border-brand-line shadow-lav-card">
          <div className="p-[clamp(1.8rem,3vw,2.6rem)] bg-white">
            <div className="font-disp text-[1.5rem] font-extrabold tracking-tight text-brand-ink">
              Measured Weight Care Plan
            </div>
            <div className="text-[0.92rem] text-brand-muted mt-1">
              Clinician-led · medication included · 100% online · cancel anytime
            </div>
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-lav mt-7 mb-3">
              What&apos;s included
            </div>
            <ul className="space-y-2.5">
              {includes.map((t) => (
                <li key={t} className="grid grid-cols-[auto_1fr] gap-2.5 text-[0.96rem] text-brand-ink">
                  <span className="text-lav font-bold">✦</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-[clamp(1.8rem,3vw,2.6rem)] grad-lav text-white flex flex-col justify-center">
            <div className="text-center">
              <div className="font-disp font-extrabold leading-none flex items-start justify-center gap-1">
                <span className="text-2xl mt-2">$</span>
                <span className="text-[4rem] tracking-tight">299</span>
              </div>
              <div className="font-semibold mt-1">per month</div>
              <div className="text-[0.8rem] text-white/80 mt-1">
                medication included · cancel anytime
              </div>
            </div>
            <button
              onClick={openFunnel}
              className="mt-7 w-full justify-center inline-flex items-center gap-2 bg-white text-brand-ink font-bold rounded-full py-3.5 hover:-translate-y-0.5 transition-transform"
            >
              Take the assessment →
            </button>
            <button
              onClick={openFunnel}
              className="mt-2.5 w-full justify-center inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white font-semibold rounded-full py-3.5 hover:bg-white/25 transition-colors"
            >
              See if you qualify
            </button>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 mt-8 max-w-[920px]">
          {notes.map((n) => (
            <p key={n} className="text-[0.8rem] text-brand-muted leading-relaxed">
              <span className="text-lav">✦</span> {n}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Doctor
// ══════════════════════════════════════════════════════════════════════════════
function Doctor() {
  const openFunnel = useOpenFunnel();
  return (
    <section id="doctor" className="sec-pad bg-brand-bgsoft">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] grid lg:grid-cols-[0.82fr_1.18fr] gap-[clamp(2rem,5vw,4.5rem)] items-center">
        <Reveal className="relative">
          <div className="rounded-[22px] overflow-hidden aspect-[0.84] shadow-lav-card">
            <Image
              src="/images/dr-saxena.jpeg"
              alt="Dr Anubhav Saxena"
              fill
              className="object-cover"
              style={{ objectPosition: "50% 15%" }}
              sizes="(min-width: 820px) 35vw, 420px"
            />
          </div>
          <div
            className="absolute -left-4 bottom-7 bg-white border border-brand-line rounded-2xl px-[1.15rem] py-[0.85rem] shadow-lav-card"
          >
            <b className="font-disp text-[1.1rem] font-extrabold block leading-tight tracking-tight text-brand-ink">
              Dr Anubhav Saxena
            </b>
            <span className="text-[0.66rem] tracking-widest uppercase text-brand-muted">
              Your doctor
            </span>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <Eyebrow>About us · Your doctor</Eyebrow>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4 text-brand-ink">
            Medicine that actually <span className="text-lav">knows you</span>.
          </h2>
          <div className="flex gap-2 flex-wrap mt-5">
            {["MBBS", "FRACGP", "MPhil"].map((c) => (
              <span
                key={c}
                className="text-[0.68rem] font-semibold tracking-wide uppercase text-lav bg-lavsoft rounded-full px-3.5 py-1.5"
              >
                {c}
              </span>
            ))}
          </div>
          <p className="mt-5 text-[clamp(1.05rem,1.25vw,1.3rem)] text-brand-ink2 leading-[1.55]">
            Fellow of the Royal Australian College of General Practitioners with
            a research background in metabolic medicine. Dr Saxena designed the
            Health Optimisation Protocol to give patients a structured,
            evidence-based path to lasting weight and metabolic improvement.
          </p>
          <div className="mt-8">
            <Btn onClick={openFunnel}>
              Book with Dr Saxena <span>→</span>
            </Btn>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Quotes
// ══════════════════════════════════════════════════════════════════════════════
function Quotes() {
  const qs: [string, string, string, string][] = [
    [
      "For the first time, my labs and how I actually feel were finally connected. I understand my own body now.",
      "SF",
      "S. F.",
      "Metabolic program",
    ],
    [
      "Measured advice and a genuinely personable approach. The most practical way I've ever worked with a doctor.",
      "DE",
      "D. E.",
      "Patient since 2024",
    ],
    [
      "From the first visit they knew my history. Knowledgeable, personable, and always reachable over telehealth.",
      "AW",
      "A. W-S.",
      "Protocol patient",
    ],
  ];
  return (
    <section className="sec-pad bg-white">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
        <Reveal className="text-center max-w-[640px] mx-auto mb-[clamp(2.5rem,5vw,3.4rem)]">
          <Eyebrow center>Patient stories</Eyebrow>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4 text-brand-ink">
            Care people <span className="text-lav">actually feel</span>.
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {qs.map(([quote, ini, name, role], i) => (
            <Reveal
              key={ini}
              delay={i * 90}
              className="bg-brand-bgsoft border border-brand-line rounded-[18px] p-8 flex flex-col"
            >
              <div className="text-lav tracking-[0.16em] text-[0.82rem] mb-4">
                ★★★★★
              </div>
              <blockquote className="text-[1.08rem] leading-relaxed text-brand-ink font-medium flex-1 tracking-[-.01em]">
                &ldquo;{quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="w-9 h-9 rounded-full grad-dot text-white font-bold text-[0.76rem] grid place-items-center shrink-0">
                  {ini}
                </span>
                <span>
                  <b className="block text-[0.88rem] font-bold text-brand-ink">
                    {name}
                  </b>
                  <span className="text-[0.8rem] text-brand-muted">{role}</span>
                </span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// FAQ
// ══════════════════════════════════════════════════════════════════════════════
function FAQ() {
  const openFunnel = useOpenFunnel();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const items: [string, string][] = [
    [
      "How is Measured different from standard care?",
      "Every plan is built around the individual — your CGM response, your labs, and the foods you actually enjoy. Your doctor knows your history before you arrive, builds and adjusts every plan personally, and there are no rushed, ten-minute visits or rotating providers.",
    ],
    [
      "Do I need a referral to start?",
      "No referral needed. You start by completing a short online assessment, and a registered clinician reviews it to decide whether treatment is appropriate. If anything needs further input, your clinician will guide you on next steps.",
    ],
    [
      "What medications does Measured prescribe?",
      "Where clinically appropriate, our clinicians prescribe evidence-based GLP-1 medications such as semaglutide and tirzepatide. The right option, dose and titration are decided by your doctor based on your assessment, history and how you respond.",
    ],
    [
      "What does the program involve?",
      "The Health Optimisation Protocol is a six-month, physician-led program: CGM-monitored GLP-1 therapy titrated to your response, personalised meal planning built by your doctor, and baseline and completion DEXA scans for objective before-and-after data.",
    ],
    [
      "Do I have to come into the office?",
      "Your first visit is in person, so we can run your labs, fit your CGM, and complete your baseline DEXA. After that, regular check-ins happen over telehealth — or in person whenever you'd prefer.",
    ],
    [
      "How closely will my doctor follow my progress?",
      "Closely. You stay in regular contact with your doctor throughout the six months, and as your CGM and labs change, your therapy and meals are adjusted — not left until the next quarterly visit.",
    ],
  ];
  return (
    <section id="faq" className="sec-pad bg-brand-bgsoft">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] grid lg:grid-cols-[0.7fr_1.3fr] gap-[clamp(2rem,5vw,4rem)] items-start">
        <Reveal>
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4 text-brand-ink">
            Questions, answered.
          </h2>
          <p className="mt-4 text-[clamp(1.05rem,1.25vw,1.3rem)] text-brand-ink2 leading-[1.55]">
            Still unsure if Measured is right for you? The assessment is the
            easiest way to find out.
          </p>
          <div className="mt-7">
            <Btn onClick={openFunnel}>
              Take the assessment <span>→</span>
            </Btn>
          </div>
        </Reveal>
        <Reveal delay={120} className="border-t border-brand-line2">
          {items.map(([q, a], i) => (
            <div key={i} className="border-b border-brand-line2">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-6 font-disp text-[clamp(1.1rem,1.5vw,1.35rem)] font-bold tracking-tight text-left text-brand-ink hover:text-lav transition-colors"
              >
                {q}
                <span
                  className={
                    "shrink-0 w-7 h-7 rounded-full border grid place-items-center text-lg leading-none transition-all " +
                    (openIdx === i
                      ? "bg-lav border-lav text-white"
                      : "border-brand-line2 text-brand-ink")
                  }
                >
                  {openIdx === i ? "−" : "+"}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {openIdx === i && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { duration: 0.34, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.22 },
                    }}
                    className="overflow-hidden"
                  >
                    <p className="text-brand-ink2 text-base leading-relaxed pb-6 max-w-[60ch]">
                      {a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CTA
// ══════════════════════════════════════════════════════════════════════════════
function CTA() {
  const openFunnel = useOpenFunnel();
  return (
    <section id="start" className="relative overflow-hidden grad-lav text-center">
      <div className="absolute -top-[30%] -right-[5%] w-[380px] h-[380px] rounded-full bg-white/10" />
      <div className="absolute -bottom-[40%] -left-[5%] w-[420px] h-[420px] rounded-full bg-white/10" />
      <div className="relative z-[1] max-w-[820px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] py-[clamp(5rem,9vw,8rem)]">
        <Reveal>
          <Eyebrow center>Limited availability</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-white text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] mt-4">
            Begin your strongest decade.
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="text-white/90 mt-6 mx-auto max-w-[34rem] text-[clamp(1.05rem,1.25vw,1.3rem)] leading-[1.55]">
            We take on a limited number of patients so every plan gets the
            attention it deserves. Start with a short online assessment — no
            commitment required.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div className="mt-9 flex gap-3.5 justify-center flex-wrap">
            <button
              onClick={openFunnel}
              className="inline-flex items-center gap-2 bg-white text-brand-ink font-semibold rounded-full text-base px-7 py-[1.05rem] hover:-translate-y-0.5 transition-transform"
            >
              Take the assessment <span>→</span>
            </button>
            <Btn lg variant="dark" href="#journey">
              See how it works
            </Btn>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Footer
// ══════════════════════════════════════════════════════════════════════════════
function LandingFooter() {
  const cols: [string, [string, string][]][] = [
    [
      "Practice",
      [
        ["What we test", "#test"],
        ["How it works", "#journey"],
        ["Programs", "#program"],
        ["About us", "#doctor"],
      ],
    ],
    [
      "Get started",
      [
        ["Pricing", "#pricing"],
        ["FAQ", "#faq"],
        ["Contact", "#start"],
      ],
    ],
  ];
  return (
    <footer
      className="py-[clamp(3.5rem,6vw,5rem)]"
      style={{ background: "#0e0e14", color: "rgba(255,255,255,.6)" }}
    >
      <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1.1fr] gap-8 pb-10"
          style={{ borderBottom: "1px solid rgba(255,255,255,.1)" }}
        >
          <div>
            <span className="font-disp text-[1.35rem] font-extrabold text-white">
              Measured<span className="text-lav2">Rx</span>
            </span>
            <p
              className="mt-4 text-[0.92rem] leading-relaxed"
              style={{ maxWidth: "32ch" }}
            >
              Precision metabolic medicine. Pathology-validated testing,
              CGM-guided therapy, and a doctor who personalises every step.
            </p>
          </div>
          {cols.map(([h, links]) => (
            <div key={h}>
              <h4
                className="text-[0.66rem] tracking-[0.16em] uppercase font-semibold mb-4"
                style={{ color: "rgba(255,255,255,.45)" }}
              >
                {h}
              </h4>
              {links.map(([l, href]) => (
                <a
                  key={l}
                  href={href}
                  className="block text-[0.9rem] mb-2.5 hover:text-white transition-colors"
                  style={{ color: "rgba(255,255,255,.62)" }}
                >
                  {l}
                </a>
              ))}
            </div>
          ))}
          <div>
            <h4
              className="text-[0.66rem] tracking-[0.16em] uppercase font-semibold mb-4"
              style={{ color: "rgba(255,255,255,.45)" }}
            >
              Visit
            </h4>
            <p
              className="text-[0.9rem] mb-2.5"
              style={{ color: "rgba(255,255,255,.62)" }}
            >
              Consulting Australia-wide
              <br />
              via telehealth
            </p>
            <p className="text-[0.9rem]" style={{ color: "rgba(255,255,255,.62)" }}>
              In-person by appointment
            </p>
          </div>
        </div>
        <div
          className="flex items-center justify-between gap-4 flex-wrap pt-7 text-[0.8rem]"
          style={{ color: "rgba(255,255,255,.45)" }}
        >
          <span>© 2026 Measured · Precision Metabolic Medicine</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <Link href="/demo" className="hover:text-white transition-colors">
              App demo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Funnel modal — 6-step assessment
// ══════════════════════════════════════════════════════════════════════════════
const FUNNEL_STEPS = [
  "Your name",
  "Contact",
  "About you",
  "Activity",
  "Priorities",
  "Book your call",
];
const ACTIVITY_OPTIONS = [
  "Sedentary — mostly desk-based, little regular exercise",
  "Lightly active — 1–2 sessions per week",
  "Moderately active — 3–4 sessions per week",
  "Very active — 5+ sessions per week",
  "Athlete — competitive or high-performance training",
];
const PRIORITIES = [
  ["⚖️", "Lose Weight"],
  ["🍽️", "Reduce Appetite"],
  ["🔬", "Metabolic Health"],
  ["💪", "Preserve Muscle"],
  ["⚡", "More Energy"],
  ["🩸", "Blood Sugar Control"],
  ["❤️", "Heart Health"],
  ["😴", "Better Sleep"],
];
const SLOTS = [
  "9:00 AM",
  "10:30 AM",
  "12:00 PM",
  "2:00 PM",
  "3:30 PM",
  "5:00 PM",
];

interface FunnelData {
  first: string;
  last: string;
  email: string;
  mobile: string;
  age: number;
  gender: string;
  activity: string;
  priorities: string[];
  date: Date | null;
  slot: string | null;
}

function bookingDates(): Date[] {
  const out: Date[] = [];
  const d = new Date();
  let added = 0;
  while (out.length < 5) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) out.push(new Date(d));
    if (++added > 14) break;
  }
  return out;
}

function Funnel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FunnelData>({
    first: "",
    last: "",
    email: "",
    mobile: "",
    age: 38,
    gender: "",
    activity: "",
    priorities: [],
    date: null,
    slot: null,
  });
  const dates = useMemo(bookingDates, []);

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const set = <K extends keyof FunnelData>(k: K, v: FunnelData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const togglePri = (label: string) =>
    setData((d) => ({
      ...d,
      priorities: d.priorities.includes(label)
        ? d.priorities.filter((p) => p !== label)
        : [...d.priorities, label],
    }));

  const next = () => setStep((s) => Math.min(s + 1, 6));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const fmtDate = (dt: Date | null) =>
    dt
      ? dt.toLocaleDateString("en-AU", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
      : "";

  const inputCls =
    "w-full border border-brand-line2 rounded-xl bg-brand-bgsoft px-4 py-3 text-[0.95rem] outline-none focus:border-lav focus:bg-white transition-colors";

  const Field = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <div className="mb-4">
      <label className="text-[0.82rem] font-semibold text-brand-ink2 block mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-stretch md:items-center justify-center p-0 md:p-6"
      style={{ background: "rgba(14,14,20,.55)", backdropFilter: "blur(6px)" }}
    >
      <div className="bg-white w-full max-w-[940px] md:rounded-[24px] overflow-hidden grid md:grid-cols-[300px_1fr] max-h-screen md:max-h-[88vh]">
        {/* Left rail */}
        <div className="hidden md:flex flex-col grad-lav text-white p-8">
          <span className="font-disp text-[1.3rem] font-extrabold">
            Measured<span className="text-white/60">Rx</span>
          </span>
          <div className="mt-10 flex flex-col gap-1">
            {FUNNEL_STEPS.map((s, i) => (
              <div
                key={s}
                className={
                  "flex items-center gap-3 py-2.5 transition-opacity " +
                  (i === step ? "opacity-100" : "opacity-55")
                }
              >
                <span
                  className={
                    "w-7 h-7 rounded-full grid place-items-center text-[0.78rem] font-bold " +
                    (i < step
                      ? "bg-white text-lav"
                      : i === step
                      ? "bg-white text-lav"
                      : "bg-white/20 text-white")
                  }
                >
                  {i < step ? "✓" : i + 1}
                </span>
                <span className="text-[0.9rem] font-medium">{s}</span>
              </div>
            ))}
          </div>
          <p className="mt-auto text-[0.78rem] text-white/70 leading-relaxed">
            15 minutes with a Measured clinician. No commitment required. All
            times AEST.
          </p>
        </div>

        {/* Right content */}
        <div className="relative flex flex-col overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-brand-bgsoft hover:bg-brand-line2 grid place-items-center text-brand-ink text-lg z-10"
          >
            ✕
          </button>
          {/* Progress bar */}
          <div className="h-1 bg-brand-line2">
            <div
              className="h-full grad-lav transition-all duration-500"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
          <div className="p-[clamp(1.75rem,4vw,2.75rem)] flex-1">
            {step === 0 && (
              <div>
                <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-lav mb-3">
                  Step 1 of 6
                </div>
                <h2 className="font-disp text-[2rem] font-extrabold tracking-tight leading-tight mb-2 text-brand-ink">
                  Let&apos;s start with your name.
                </h2>
                <p className="text-brand-ink2 mb-7">
                  Your dedicated Measured clinician will use this to personalise
                  your plan.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First name">
                    <input
                      className={inputCls}
                      value={data.first}
                      onChange={(e) => set("first", e.target.value)}
                      placeholder="James"
                    />
                  </Field>
                  <Field label="Last name">
                    <input
                      className={inputCls}
                      value={data.last}
                      onChange={(e) => set("last", e.target.value)}
                      placeholder="Wilson"
                    />
                  </Field>
                </div>
                <div className="flex justify-end mt-4">
                  <Btn onClick={next}>Continue →</Btn>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-lav mb-3">
                  Step 2 of 6
                </div>
                <h2 className="font-disp text-[2rem] font-extrabold tracking-tight leading-tight mb-2 text-brand-ink">
                  How do we reach you?
                </h2>
                <p className="text-brand-ink2 mb-7">
                  Your email receives the calendar invite. Your mobile for
                  appointment reminders.
                </p>
                <Field label="Email address">
                  <input
                    type="email"
                    className={inputCls}
                    value={data.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="james@example.com"
                  />
                </Field>
                <Field label="Mobile number">
                  <input
                    type="tel"
                    className={inputCls}
                    value={data.mobile}
                    onChange={(e) => set("mobile", e.target.value)}
                    placeholder="04XX XXX XXX"
                  />
                </Field>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={back}
                    className="text-[0.9rem] font-semibold text-brand-muted hover:text-brand-ink transition-colors"
                  >
                    ← Back
                  </button>
                  <Btn onClick={next}>Continue →</Btn>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-lav mb-3">
                  Step 3 of 6
                </div>
                <h2 className="font-disp text-[2rem] font-extrabold tracking-tight leading-tight mb-2 text-brand-ink">
                  A little about you.
                </h2>
                <p className="text-brand-ink2 mb-7">
                  Age and biological sex help your clinician assess eligibility
                  and tailor your plan.
                </p>
                <Field label="Your age">
                  <div className="font-disp text-[2.6rem] font-extrabold text-lav leading-none mb-2">
                    {data.age}
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="85"
                    value={data.age}
                    onChange={(e) => set("age", Number(e.target.value))}
                    className="w-full accent-lav"
                  />
                  <div className="flex justify-between text-[0.72rem] text-brand-muted mt-1">
                    <span>18</span>
                    <span>85</span>
                  </div>
                </Field>
                <Field label="Biological sex">
                  <div className="grid grid-cols-3 gap-2.5">
                    {["Male", "Female", "Prefer not to say"].map((g) => (
                      <button
                        key={g}
                        onClick={() => set("gender", g)}
                        className={
                          "rounded-xl border px-3 py-2.5 text-[0.88rem] transition-colors " +
                          (data.gender === g
                            ? "border-lav bg-lavtint text-brand-ink font-semibold"
                            : "border-brand-line2 text-brand-ink2 hover:border-lav")
                        }
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </Field>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={back}
                    className="text-[0.9rem] font-semibold text-brand-muted hover:text-brand-ink transition-colors"
                  >
                    ← Back
                  </button>
                  <Btn onClick={next}>Continue →</Btn>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-lav mb-3">
                  Step 4 of 6
                </div>
                <h2 className="font-disp text-[2rem] font-extrabold tracking-tight leading-tight mb-2 text-brand-ink">
                  How active are you currently?
                </h2>
                <p className="text-brand-ink2 mb-7">
                  This helps your clinician understand your baseline and set
                  realistic goals.
                </p>
                <div className="flex flex-col gap-2.5">
                  {ACTIVITY_OPTIONS.map((a) => (
                    <button
                      key={a}
                      onClick={() => set("activity", a)}
                      className={
                        "text-left rounded-xl border px-4 py-3.5 text-[0.92rem] transition-colors " +
                        (data.activity === a
                          ? "border-lav bg-lavtint font-semibold text-brand-ink"
                          : "border-brand-line2 text-brand-ink2 hover:border-lav")
                      }
                    >
                      {a}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-5">
                  <button
                    onClick={back}
                    className="text-[0.9rem] font-semibold text-brand-muted hover:text-brand-ink transition-colors"
                  >
                    ← Back
                  </button>
                  <Btn onClick={next}>Continue →</Btn>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-lav mb-3">
                  Step 5 of 6
                </div>
                <h2 className="font-disp text-[2rem] font-extrabold tracking-tight leading-tight mb-2 text-brand-ink">
                  What matters most to you?
                </h2>
                <p className="text-brand-ink2 mb-7">
                  Select all that apply. Your clinician will focus here first.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PRIORITIES.map(([icon, label]) => {
                    const on = data.priorities.includes(label);
                    return (
                      <button
                        key={label}
                        onClick={() => togglePri(label)}
                        className={
                          "flex flex-col items-center gap-2 rounded-xl border px-2 py-4 text-[0.82rem] font-medium transition-colors " +
                          (on
                            ? "border-lav bg-lavtint text-brand-ink"
                            : "border-brand-line2 text-brand-ink2 hover:border-lav")
                        }
                      >
                        <span className="text-xl">{icon}</span>
                        {label}
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-between items-center mt-5">
                  <button
                    onClick={back}
                    className="text-[0.9rem] font-semibold text-brand-muted hover:text-brand-ink transition-colors"
                  >
                    ← Back
                  </button>
                  <Btn onClick={next}>Continue →</Btn>
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-lav mb-3">
                  Step 6 of 6
                </div>
                <h2 className="font-disp text-[2rem] font-extrabold tracking-tight leading-tight mb-2 text-brand-ink">
                  Book your discovery call.
                </h2>
                <p className="text-brand-ink2 mb-6">
                  15 minutes with a Measured clinician. No commitment required.
                  All times AEST.
                </p>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-brand-muted mb-2">
                      Select a date
                    </div>
                    <div className="flex flex-col gap-2">
                      {dates.map((dt, i) => (
                        <button
                          key={i}
                          onClick={() => set("date", dt)}
                          className={
                            "text-left rounded-xl border px-4 py-2.5 text-[0.9rem] transition-colors " +
                            (data.date?.getTime() === dt.getTime()
                              ? "border-lav bg-lavtint font-semibold text-brand-ink"
                              : "border-brand-line2 text-brand-ink2 hover:border-lav")
                          }
                        >
                          {fmtDate(dt)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-brand-muted mb-2">
                      Available times
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {SLOTS.map((s) => (
                        <button
                          key={s}
                          onClick={() => set("slot", s)}
                          className={
                            "rounded-xl border px-2 py-2.5 text-[0.86rem] transition-colors " +
                            (data.slot === s
                              ? "border-lav bg-lavtint font-semibold text-brand-ink"
                              : "border-brand-line2 text-brand-ink2 hover:border-lav")
                          }
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-[0.78rem] text-brand-muted mt-5 leading-relaxed">
                  ✦ A calendar invite will be sent to your email on confirmation.
                  ✦ SMS reminder 24 hours before your call.
                </p>
                <div className="flex justify-between items-center mt-5">
                  <button
                    onClick={back}
                    className="text-[0.9rem] font-semibold text-brand-muted hover:text-brand-ink transition-colors"
                  >
                    ← Back
                  </button>
                  <Btn
                    disabled={!data.date || !data.slot}
                    onClick={next}
                  >
                    Confirm booking →
                  </Btn>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full grad-lav text-white grid place-items-center text-2xl mx-auto">
                  ✦
                </div>
                <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-lav mt-5">
                  You&apos;re booked in
                </div>
                <h2 className="font-disp text-[2rem] font-extrabold tracking-tight mt-2 mb-3 text-brand-ink">
                  You&apos;re all set{data.first ? `, ${data.first}` : ""}.
                </h2>
                <p className="text-brand-ink2">
                  Your discovery call is confirmed for
                  <br />
                  <b className="text-brand-ink">
                    {fmtDate(data.date)} · {data.slot} AEST
                  </b>
                  .
                </p>
                <p className="text-brand-ink2 mt-2 text-[0.92rem]">
                  A calendar invite is on its way to{" "}
                  {data.email || "your email"}.
                </p>
                <button
                  onClick={onClose}
                  className="mt-8 inline-flex items-center gap-2 bg-lav text-white font-semibold rounded-full px-7 py-3 hover:-translate-y-0.5 transition-transform"
                >
                  Back to Measured
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Main export
// ══════════════════════════════════════════════════════════════════════════════
export function DoctorLanding() {
  const [funnelOpen, setFunnelOpen] = useState(false);

  return (
    <FunnelCtx.Provider value={() => setFunnelOpen(true)}>
      <div
        className="min-h-dvh overflow-x-hidden"
        style={{ background: "#ffffff", color: "#0e0e14" }}
      >
        <LandingNav />
        <main>
          <Hero />
          <Difference />
          <WhatWeTest />
          <ProgressTracked />
          <Journey />
          <EverythingIncluded />
          <Program />
          <Pricing />
          <Doctor />
          <Quotes />
          <FAQ />
          <CTA />
        </main>
        <LandingFooter />
        <Funnel open={funnelOpen} onClose={() => setFunnelOpen(false)} />
      </div>
    </FunnelCtx.Provider>
  );
}
