"use client";

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */

import { useState } from "react";
import { Reveal, Eyebrow, Btn, openFunnel } from "./shared";
import { Tilt, CountUp, Magnetic, Spotlight } from "./motion-fx";

/* Inline icon path map + renderer, shared by the included list and check marks. */
const II: Record<string, string> = {
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
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4",
  check: "M20 6 9 17l-5-5",
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

/* ---------------- The Difference ---------------- */
export function Difference() {
  const steps: [string, string, string][] = [
    [
      "01",
      "Understand",
      "Your specialist doctor starts with an in-depth consult to understand what's really driving your weight, then arranges the right investigations, including a DEXA scan and CGM where appropriate.",
    ],
    [
      "02",
      "Treat",
      "You begin effective, evidence-based treatment, supported by a complete food diary and an exercise plan tailored to your goals. Monthly reviews keep you progressing.",
    ],
    [
      "03",
      "Sustain",
      "Once your results are stable, we guide you through a clear plan to step down treatment. For as long as you're a member, your team is here whenever you need us.",
    ],
  ];
  return (
    <section className="sec-pad-xl bg-paper relative overflow-hidden">
      <div className="max-w-[1180px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] grid lg:grid-cols-[0.95fr_1.05fr] gap-[clamp(2.5rem,6vw,6rem)] lg:items-start">
        <Reveal>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2.1rem,4.4vw,3.5rem)] leading-[1.04]">
            Most programs stop at a prescription.{" "}
            <span className="font-serif italic font-medium">
              We start where they stop.
            </span>
          </h2>
          <p className="mt-7 text-[clamp(1.05rem,1.25vw,1.25rem)] leading-[1.6] text-ink2 max-w-[34ch]">
            You get a script, you're out the door, and that's rarely enough.
            CLOVE was built to do the opposite: a complete method that makes
            results actually last.
          </p>
        </Reveal>
        <div className="lg:pt-3">
          {steps.map(([num, title, body], i) => (
            <Reveal
              key={num}
              delay={i * 110}
              className={
                "grid grid-cols-[auto_1fr] gap-x-5 gap-y-1 py-7 " +
                (i > 0 ? "border-t border-line" : "")
              }
            >
              <span className="font-disp text-[0.9rem] font-bold tabular-nums text-lav pt-1.5">
                {num}
              </span>
              <div>
                <h3 className="font-disp text-[1.35rem] font-bold tracking-tight">
                  {title}
                </h3>
                <p className="mt-2 text-[1.02rem] leading-[1.6] text-ink2">
                  {body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Proof / stats band ---------------- */
export function ProofStats() {
  const stats: [number, string, string, string][] = [
    [3, "", "", "Data streams read together: bloods, CGM and body composition"],
    [24, "h", "", "Typical time to your first specialist review"],
    [1, "", "", "Specialist doctor who owns your plan, end to end"],
  ];
  return (
    <section className="sec-pad grad-blue relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          background:
            "radial-gradient(620px circle at 18% 30%, #fff, transparent)",
        }}
      ></div>
      {/* Faint node constellation: the body's systems as a calm, static map. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.15]"
        viewBox="0 0 1200 420"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g stroke="#fff" strokeWidth="0.5">
          <path
            d="M90 96 L300 150 L505 84 L745 168 L965 104 L1130 158"
            opacity="0.32"
          />
          <path
            d="M170 330 L420 268 L660 342 L885 272 L1085 336"
            opacity="0.26"
          />
          <path
            d="M300 150 L420 268 M745 168 L660 342 M965 104 L885 272"
            opacity="0.2"
          />
        </g>
        <g fill="#fff">
          <circle cx="90" cy="96" r="2.4" />
          <circle cx="300" cy="150" r="3.2" />
          <circle cx="505" cy="84" r="2" />
          <circle cx="745" cy="168" r="3.6" />
          <circle cx="965" cy="104" r="2.4" />
          <circle cx="1130" cy="158" r="1.8" />
          <circle cx="170" cy="330" r="2" />
          <circle cx="420" cy="268" r="3" />
          <circle cx="660" cy="342" r="2.4" />
          <circle cx="885" cy="272" r="3.4" />
          <circle cx="1085" cy="336" r="1.8" />
        </g>
      </svg>
      <div className="relative z-[1] max-w-[1100px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
        <Reveal className="text-center max-w-[640px] mx-auto">
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-white text-[clamp(1.7rem,3.4vw,2.6rem)] leading-[1.08]">
            Precision you can measure from day one.
          </h2>
        </Reveal>
        <div className="mt-[clamp(2.5rem,5vw,3.5rem)] grid grid-cols-1 sm:grid-cols-3">
          {stats.map(([to, suffix, prefix, label], i) => (
            <Reveal
              key={label}
              delay={i * 100}
              className={
                "flex flex-col items-center text-center px-[clamp(1rem,3vw,2.5rem)] py-6 sm:py-0 " +
                (i > 0
                  ? "border-t sm:border-t-0 sm:border-l border-white/15"
                  : "")
              }
            >
              <span className="font-disp font-extrabold tracking-[-.03em] text-white text-[clamp(2.6rem,6vw,4.2rem)] leading-none tabular-nums">
                <CountUp to={to} prefix={prefix} suffix={suffix} />
              </span>
              <span className="mt-4 max-w-[15rem] text-[0.9rem] leading-snug text-white/70">
                {label}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Progress, Tracked ---------------- */
export function ProgressTracked() {
  const rows: [string, string, string, string][] = [
    ["Starting weight", "98.4 kg", "Baseline", "monitor"],
    ["Current weight", "91.1 kg", "−7.3 kg", "optimal"],
    ["Body weight lost", "7.4%", "On track", "optimal"],
    ["Current dose", "0.5 mg / week", "Week 8", "optimal"],
    ["Appetite control", "Strong", "Improved", "optimal"],
    ["Waist", "−6 cm", "Since start", "optimal"],
    ["Energy", "Steady", "Monitor", "monitor"],
    ["Next check-in", "12 Jun", "Scheduled", "action"],
  ];
  const color: Record<string, string> = {
    optimal: "text-[#5e7a64] bg-[#e9efe7]",
    monitor: "text-[#8a7048] bg-[#f1ebdc]",
    action: "text-ink2 bg-lavsoft",
  };
  return (
    <section className="sec-pad grad-blue relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          background:
            "radial-gradient(600px circle at 80% 20%, #fff, transparent)",
        }}
      ></div>
      <div className="relative z-[1] max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] grid lg:grid-cols-2 gap-[clamp(2rem,5vw,4.5rem)] items-center">
        <Reveal>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.04] text-white">
            Every week tells{" "}
            <span className="text-white/70 italic">part of your story</span>.
          </h2>
          <p className="mt-5 text-[1.08rem] leading-[1.6] text-white/80 max-w-[34rem]">
            Weigh-ins, dose, appetite and measurements flow into one place, so
            you and your clinician can see exactly what's working, and adjust
            before anything stalls.
          </p>
          <div className="mt-8">
            <Btn lg variant="white" onClick={openFunnel}>
              Take the assessment <span>→</span>
            </Btn>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="bg-white/[0.07] backdrop-blur-md border border-white/15 rounded-xl2 p-5 shadow-card">
            <div className="flex items-center justify-between text-white/85 text-[0.82rem] font-semibold pb-3 border-b border-white/15">
              <span>Your Plan, Active</span>
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
                      color[tone]
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

/* ---------------- Pricing ---------------- */
export function Pricing() {
  const notes = [
    "Medication, if prescribed, is dispensed and delivered by a partner pharmacy.",
    "No lock-in contracts. Pause or cancel your plan anytime.",
    "Prices in AUD. GST included where applicable.",
    "Discovery call is obligation-free and covered by CLOVE.",
  ];
  return (
    <section id="pricing" className="sec-pad-xl bg-paper border-t border-line">
      <div className="max-w-[980px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
        <Reveal className="text-center max-w-[680px] mx-auto mb-[clamp(2.5rem,5vw,3.5rem)]">
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02]">
            One program. <span className="text-lav">One simple price.</span>
          </h2>
          <p className="mt-5 text-[clamp(1.05rem,1.25vw,1.3rem)] text-ink2 leading-[1.55]">
            No tiers, no add-ons to decode. And the care itself is never rushed.
            Need more time in your consult? Want extra support along the way?
            That's part of your care, not an added cost.
          </p>
        </Reveal>
        <Reveal
          delay={120}
          className="grid md:grid-cols-[1.4fr_1fr] rounded-xl2 overflow-hidden border border-line shadow-card bg-white"
        >
          <div className="p-[clamp(1.8rem,3vw,2.6rem)]">
            <div className="font-disp text-[1.4rem] font-bold">
              Calibrate by CLOVE
            </div>
            <div className="text-muted mt-1 text-[0.95rem]">
              Clinician-led · medication included · cancel anytime
            </div>
            <div className="mt-6 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted">
              Everything included
            </div>
            <ul className="mt-4 grid gap-x-6 gap-y-3.5 sm:grid-cols-2">
              {[
                "Prescription medication, if appropriate",
                "Clinician assessment & ongoing reviews",
                "Bloods, CGM & DEXA baseline testing",
                "Personalised dose plan, adjusted over time",
                "1:1 care coaching & nutrition support",
                "Food diary & tailored exercise plan",
                "Home delivery & refills, Australia-wide",
                "Specialist team, a message away",
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-2.5 text-[0.95rem] leading-snug"
                >
                  <span className="mt-0.5 shrink-0 text-lav">
                    <Ico d={II.check} />
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-[clamp(1.8rem,3vw,2.6rem)] grad-lav text-white flex flex-col justify-center">
            <div className="text-center">
              <div className="font-disp font-extrabold leading-none flex items-start justify-center gap-1">
                <span className="mt-2 text-2xl">$</span>
                <span className="text-[4rem] tracking-tight tabular-nums">
                  299
                </span>
              </div>
              <div className="font-semibold mt-1">per month</div>
              <div className="text-[0.8rem] text-white/80 mt-1">
                one all-in price · no separate pharmacy bills
              </div>
            </div>
            <button
              type="button"
              onClick={openFunnel}
              className="group grow press mt-7 w-full justify-center inline-flex items-center gap-2 bg-white text-ink font-bold text-base rounded-full py-[1.05rem]"
            >
              Take the assessment <span className="cta-arrow">→</span>
            </button>
            <button
              type="button"
              onClick={openFunnel}
              className="press mt-2.5 w-full justify-center inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white font-semibold text-base rounded-full py-[1.05rem] hover:bg-white/25"
            >
              See if you qualify
            </button>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[0.74rem] font-medium text-white/80">
              <span>✓ No lock-in</span>
              <span>✓ Cancel anytime</span>
              <span>✓ No hidden fees</span>
            </div>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 mt-8 max-w-[920px]">
          {notes.map((n) => (
            <p key={n} className="text-[0.8rem] text-muted leading-relaxed">
              <span className="text-muted">✦</span> {n}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Everything Included ---------------- */
export function EverythingIncluded() {
  const items: [string, string, string, string, string][] = [
    [
      "chart",
      "DEXA body composition",
      "Lean mass vs fat mass · repeatable scan",
      "A clinical-grade scan separates fat from lean mass, so progress is measured by what matters: losing fat while keeping muscle.",
      "/landing/dexa.jpg",
    ],
    [
      "cross",
      "Blood & biomarker panels",
      "Metabolic · hormonal · nutritional",
      "Comprehensive bloods reveal what's really driving your weight and energy, so treatment starts from evidence, not assumptions.",
      "/landing/calm-woman.jpg",
    ],
    [
      "refresh",
      "Continuous glucose (CGM)",
      "Real-time · 24-hour · response to food",
      "An ultra-thin sensor reads your metabolism in real time, revealing exactly how your body responds to food, sleep and stress.",
      "/landing/cgm.jpg",
    ],
    [
      "pill",
      "Prescriptions provided (if necessary)",
      "Prescribed only when appropriate · clinician-managed",
      "If medication is the right fit, your specialist prescribes and manages it end to end, shipped discreetly to your door. It is one tool in the plan, never the whole plan.",
      "/landing/meal-planning.jpg",
    ],
    [
      "leaf",
      "Personalised nutrition & exercise",
      "Protein-first · muscle preservation · your cuisine",
      "A complete food diary and a tailored exercise plan, built around your treatment and how you actually live, so progress comes from habits, not just medication.",
      "/landing/salad-bowl.jpg",
    ],
    [
      "truck",
      "Convenient home delivery.",
      "Plain packaging · Australia-wide · refills",
      "Your medication arrives in discreet, plain packaging, shipped Australia-wide, with refills coordinated so you never miss a dose.",
      "/landing/lake-calm.jpg",
    ],
  ];
  return (
    <section
      id="included"
      className="sec-pad bg-bgsoft border-t border-line2/70"
    >
      <div className="max-w-[1180px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
        <Reveal className="max-w-[720px] mb-[clamp(2.5rem,5vw,4rem)]">
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02]">
            Every step covered.
          </h2>
          <p className="mt-4 text-[clamp(1.05rem,1.25vw,1.3rem)] text-ink2 leading-[1.55]">
            Calibrate by CLOVE combines in-depth diagnostics, medication where
            appropriate, nutrition, training and clinical oversight, so you're
            guided from your first scan to your goal, and beyond.
          </p>
        </Reveal>
        <div className="border-t border-line2/70">
          {items.map(([icon, title, tags, desc, img], i) => (
            <Reveal
              key={title}
              delay={(i % 3) * 80}
              className="group relative grid grid-cols-[56px_1fr] md:grid-cols-[72px_minmax(0,0.95fr)_minmax(0,1.25fr)] gap-x-5 md:gap-x-10 items-center py-[1.6rem] md:py-7 border-b border-line2/70"
            >
              <span className="pointer-events-none absolute inset-y-0 -inset-x-5 md:-inset-x-8 rounded-[20px] bg-lavtint opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-[1] w-14 h-14 rounded-2xl border border-line2 bg-white grid place-items-center text-lav transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-rotate-6 group-hover:scale-[1.06] group-hover:border-lav/35 group-hover:shadow-[0_0_26px_-8px_var(--lav)]">
                <Ico d={II[icon]} />
              </span>
              <div className="relative z-[1] min-w-0">
                <h3 className="font-disp text-[1.1rem] md:text-[1.28rem] font-bold tracking-tight transition-colors duration-300 group-hover:text-lav">
                  {title}
                </h3>
                <div className="text-[0.7rem] text-muted font-semibold mt-1.5 uppercase tracking-[0.07em]">
                  {tags}
                </div>
                <p className="md:hidden text-[0.9rem] text-ink2 leading-relaxed mt-2.5">
                  {desc}
                </p>
              </div>
              <div className="relative z-[1] hidden md:flex items-center gap-6">
                <p className="flex-1 text-[0.94rem] text-ink2 leading-relaxed opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-[600ms] ease-[cubic-bezier(.16,1,.3,1)]">
                  {desc}
                </p>
                <span className="shrink-0 w-[88px] h-[88px] rounded-2xl overflow-hidden opacity-0 scale-90 translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-[600ms] ease-[cubic-bezier(.16,1,.3,1)] shadow-[0_18px_36px_-18px_rgba(42,34,18,.5)]">
                  <img
                    src={img}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Video Band ---------------- */
export function VideoBand() {
  return (
    <section className="grain relative overflow-hidden bg-[#0a0e0c]">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: "url('/landing/mtn-fog.jpg')" }}
        ></div>
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/landing/mtn-fog.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/landing/hero-bg.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg,rgba(8,12,10,.78),rgba(8,12,10,.58) 45%,rgba(8,12,10,.82))",
          }}
        ></div>
      </div>
      <div className="relative z-[2] max-w-[960px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] py-[clamp(6rem,13vw,11rem)] text-center text-white">
        <Reveal>
          <span className="inline-flex items-center gap-2.5 text-[0.72rem] font-semibold tracking-[0.2em] uppercase text-white/65">
            <span className="w-2 h-2 rounded-full grad-dot"></span>Why CLOVE
            exists
          </span>
        </Reveal>
        <Reveal
          delay={90}
          as="p"
          className="font-serif font-medium tracking-[-.01em] leading-[1.14] text-[clamp(2.1rem,4.6vw,3.6rem)] mt-7 text-balance"
        >
          Most weight loss programs focus on the number on the scale.{" "}
          <span className="italic">CLOVE looks deeper</span>, your health,
          habits, medication options and long-term progress, so your plan is
          built around you, not just your weight.
        </Reveal>
        <Reveal
          delay={170}
          as="p"
          className="mt-7 mx-auto max-w-[40rem] text-[clamp(1rem,1.15vw,1.18rem)] leading-[1.6] text-white/70"
        >
          No fads. No crash diets. Just doctor-led weight loss care designed for
          real life.
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Quotes ---------------- */
// Placeholder greyscale wordmarks. Replace each with an official, approved logo
// asset before launch, and only display institutions CLOVE is genuinely aligned with.
const AFFILIATIONS: [string, string][] = [
  ["/landing/logos/monash.svg", "Monash University"],
  ["/landing/logos/sydney.svg", "The University of Sydney"],
  ["/landing/logos/racgp.svg", "RACGP"],
  ["/landing/logos/melbourne.svg", "University of Melbourne"],
  ["/landing/logos/ahpra.svg", "AHPRA"],
];

/** Patient avatar: shows a photo when available, falls back to initials.
 *  Drop photos at /landing/patients/<slug>.jpg to upgrade automatically. */
function PatientAvatar({ slug, initials }: { slug: string; initials: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full grad-dot text-[0.76rem] font-bold text-white">
        {initials}
      </span>
    );
  }
  return (
    <img
      src={`/landing/patients/${slug}.jpg`}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-line"
    />
  );
}

export function Quotes() {
  // [quote, initials, name, role, slug]
  const qs: [string, string, string, string, string][] = [
    [
      "For the first time, my labs and how I actually feel were finally connected. I understand my own body now, and exactly what to do with it.",
      "SM",
      "Sarah M.",
      "Brisbane",
      "sarah",
    ],
    [
      "Genuinely personable, and measured in every sense. The most practical way I've ever worked with a doctor.",
      "DT",
      "Daniel T.",
      "Melbourne · Patient since 2024",
      "daniel",
    ],
    [
      "From the very first visit, they already knew my history. Knowledgeable, calm, and always reachable over telehealth.",
      "AW",
      "Aisha W.",
      "Perth · Protocol patient",
      "aisha",
    ],
    [
      "The food diary and exercise plan made the medication actually stick. Down 11kg and it finally feels sustainable.",
      "JR",
      "James R.",
      "Sydney",
      "james",
    ],
    [
      "Everything was clear from day one, no surprises on cost, just steady, measurable progress every month.",
      "PN",
      "Priya N.",
      "Adelaide",
      "priya",
    ],
    [
      "Having a specialist a message away made the whole thing feel safe. I never felt rushed or like just another number.",
      "TH",
      "Tom H.",
      "Gold Coast",
      "tom",
    ],
  ];
  return (
    <section className="sec-pad relative z-[2] -mt-8 rounded-t-[2.5rem] bg-paper">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
        <Reveal className="text-center max-w-[640px] mx-auto mb-[clamp(2.5rem,5vw,3.4rem)]">
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02]">
            Care people <span className="text-lav">actually feel</span>.
          </h2>
        </Reveal>
        <div className="edge-fade flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {qs.map(([quote, ini, name, role, slug], i) => (
            <Tilt
              key={i}
              max={6}
              className="min-w-[300px] max-w-[340px] shrink-0 snap-start"
            >
              <Reveal
                delay={(i % 3) * 90}
                className="h-full bg-white rounded-[20px] p-8 flex flex-col shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex items-center gap-1.5 text-[0.64rem] font-semibold tracking-[0.16em] uppercase text-lav mb-5">
                  <span className="w-1.5 h-1.5 rounded-full grad-dot"></span>
                  Verified patient
                </div>
                <blockquote className="text-[1.08rem] leading-relaxed text-ink font-medium flex-1 tracking-[-.01em]">
                  {quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <PatientAvatar slug={slug} initials={ini} />
                  <span>
                    <b className="block text-[0.88rem] font-bold">{name}</b>
                    <span className="text-[0.8rem] text-muted">{role}</span>
                  </span>
                </figcaption>
              </Reveal>
            </Tilt>
          ))}
        </div>

        {/* Affiliations logo marquee */}
        <Reveal className="mt-[clamp(3rem,6vw,4.5rem)]">
          <div className="marquee-mask overflow-hidden">
            <div className="mq-row items-center">
              {[...AFFILIATIONS, ...AFFILIATIONS].map(([src, name], i) => (
                <img
                  key={i}
                  src={src}
                  alt={i < AFFILIATIONS.length ? name : ""}
                  aria-hidden={i >= AFFILIATIONS.length}
                  loading="lazy"
                  className="mx-9 h-7 w-auto shrink-0 opacity-55 grayscale transition-opacity duration-300 hover:opacity-90"
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
export function FAQ() {
  const items: [string, string][] = [
    [
      "Do I need a referral to start?",
      "No referral is needed. You can begin with an online assessment, and our specialist doctors take it from there.",
    ],
    [
      "Do I have to come into the office?",
      "No. Everything can be done digitally, from your assessment to your consults and ongoing reviews, with close monitoring and regular follow-up. In-person options are available if you prefer.",
    ],
    [
      "Is CLOVE covered by health insurance?",
      "Some elements, such as certain consults or investigations, may be eligible for Medicare or private health rebates depending on your circumstances and provider. Your clinician can talk you through what may apply to you.",
    ],
    [
      "Is medical weight loss safe?",
      "Medical weight loss can be safe when it is properly assessed, prescribed and monitored by qualified clinicians. The treatments and clinical approaches used in the CLOVE program have established safety profiles and are commonly used in weight management care. However, all treatments carry potential risks and side effects, which is why medical supervision is important. Your CLOVE practitioner will review your health history, assess whether treatment is appropriate for you, discuss the benefits and risks, and provide ongoing monitoring throughout your program.",
    ],
    [
      "What medications does CLOVE prescribe?",
      "All treatments offered through the CLOVE program are approved for use in Australia and are commonly used by Australian healthcare professionals to support weight management. Australian regulations limit the information we can provide about prescription treatment options before a consultation. Your practitioner will talk you through the available options, answer your questions, and ensure you have the information you need before making any decisions about medical treatment.",
    ],
  ];
  return (
    <section id="faq" className="sec-pad bg-bgsoft">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] grid lg:grid-cols-[0.7fr_1.3fr] gap-[clamp(2rem,5vw,4rem)] items-start">
        <Reveal>
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4">
            Questions, answered.
          </h2>
          <p className="mt-4 text-[clamp(1.05rem,1.25vw,1.3rem)] text-ink2 leading-[1.55]">
            Still unsure if CLOVE is right for you? The assessment is the
            easiest way to find out.
          </p>
          <div className="mt-7">
            <Btn lg onClick={openFunnel}>
              Take the assessment <span>→</span>
            </Btn>
          </div>
        </Reveal>
        <Reveal delay={120} className="border-t border-line2">
          {items.map(([q, a], i) => (
            <details key={i} className="border-b border-line2 group">
              <summary className="flex items-center justify-between gap-6 py-6 font-disp text-[clamp(1.1rem,1.5vw,1.35rem)] font-bold tracking-tight hover:text-lav transition-colors">
                {q}
                <span className="shrink-0 w-7 h-7 rounded-full border border-line2 grid place-items-center text-lav group-open:bg-lav group-open:text-white group-open:border-lav group-open:rotate-[135deg] transition-all duration-300 text-lg leading-none">
                  +
                </span>
              </summary>
              <div className="faq-body">
                <div>
                  <p className="text-ink2 text-base leading-relaxed pb-6 max-w-[60ch]">
                    {a}
                  </p>
                </div>
              </div>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- CTA ---------------- */
export function CTA() {
  return (
    <section
      id="start"
      className="relative overflow-hidden grad-lav text-center"
    >
      <div className="absolute -top-[30%] -right-[5%] w-[380px] h-[380px] rounded-full bg-white/10"></div>
      <div className="absolute -bottom-[40%] -left-[5%] w-[420px] h-[420px] rounded-full bg-white/10"></div>
      <Spotlight size={520} color="rgba(255,255,255,0.16)" />
      <div className="relative z-[1] max-w-[820px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] py-[clamp(6.5rem,12vw,11rem)]">
        <Reveal>
          <Eyebrow center>Limited availability</Eyebrow>
        </Reveal>
        <Reveal
          delay={80}
          as="h2"
          className="font-disp font-extrabold tracking-[-.03em] text-white text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] mt-4"
        >
          The wait is over. The best way to lose weight is here.
        </Reveal>
        <Reveal
          delay={140}
          as="p"
          className="text-white/90 mt-6 mx-auto max-w-[34rem] text-[clamp(1.05rem,1.25vw,1.3rem)] leading-[1.55]"
        >
          We take a limited number of patients into Calibrate by CLOVE each
          intake, so every one gets the attention it deserves. Start with a
          short online assessment, no commitment required.
        </Reveal>
        <Reveal
          delay={200}
          className="mt-9 flex gap-3.5 justify-center flex-wrap"
        >
          <Magnetic strength={0.45}>
            <button
              type="button"
              onClick={openFunnel}
              className="group grow press inline-flex items-center gap-2 bg-white text-ink font-semibold rounded-full text-base px-7 py-[1.05rem]"
            >
              Take the assessment <span className="cta-arrow">→</span>
            </button>
          </Magnetic>
          <Btn lg variant="dark" href="#included">
            See what's included
          </Btn>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
export function Footer() {
  const cols: [string, [string, string][]][] = [
    [
      "Practice",
      [
        ["What's included", "#included"],
        ["Pricing", "#pricing"],
        ["FAQ", "#faq"],
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
    <footer className="bg-[#0e130f] text-white/60 py-[clamp(3.5rem,6vw,5rem)]">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
        {/* Ghost wordmark: the brand as a quiet monument above the columns. */}
        <div
          aria-hidden="true"
          className="font-disp select-none text-[clamp(4rem,14vw,11rem)] font-extrabold leading-[0.82] tracking-[-0.045em] text-white/[0.06] mb-[clamp(1.5rem,3vw,2.5rem)]"
        >
          CLOVE
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1.1fr] gap-8 pb-10 border-b border-white/10">
          <div>
            <span className="font-disp text-[1.35rem] font-extrabold text-white">
              CLOVE
            </span>
            <p className="mt-4 text-[0.92rem] leading-relaxed max-w-[32ch]">
              Precision metabolic medicine. Advanced biomarker testing,
              CGM-guided therapy, and a doctor who personalises every step.
            </p>
          </div>
          {cols.map(([h, links]) => (
            <div key={h}>
              <h4 className="text-[0.66rem] tracking-[0.16em] uppercase text-white/45 font-semibold mb-4">
                {h}
              </h4>
              {links.map(([l, href]) => (
                <a
                  key={l}
                  href={href}
                  className="block text-[0.9rem] text-white/60 hover:text-white mb-2.5 transition-colors"
                >
                  {l}
                </a>
              ))}
            </div>
          ))}
          <div>
            <h4 className="text-[0.66rem] tracking-[0.16em] uppercase text-white/45 font-semibold mb-4">
              Visit
            </h4>
            <p className="text-[0.9rem] text-white/60 mb-2.5">
              Consulting Australia-wide
              <br />
              via telehealth
            </p>
            <p className="text-[0.9rem] text-white/60">
              In-person by appointment
            </p>
            <a
              href="mailto:care@clove.au"
              className="mt-2.5 block text-[0.9rem] text-white/60 transition-colors hover:text-white"
            >
              care@clove.au
            </a>
          </div>
        </div>
        <div className="space-y-4 pt-7">
          {/* TODO: replace ABN, registered address and legal entity name with CLOVE's real details before launch. */}
          <p className="max-w-[88ch] text-[0.72rem] leading-relaxed text-white/40">
            CLOVE is an Australian telehealth service. Consultations are
            provided by AHPRA-registered practitioners, and any treatment,
            including prescription medicine, is provided only where clinically
            appropriate and is not suitable for everyone. Weight-loss results
            vary and depend on your starting point, treatment and lifestyle
            changes. This site is general information, not medical advice.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4 text-[0.8rem] text-white/45">
            <span>© 2026 CLOVE · ABN 00 000 000 000</span>
            <div className="flex gap-5">
              <a href="/privacy" className="hover:text-white">
                Privacy
              </a>
              <a href="/terms" className="hover:text-white">
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
