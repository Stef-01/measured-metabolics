"use client";

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */

import { useState, type ReactNode } from "react";
import { Reveal, Eyebrow, Btn, openFunnel } from "./shared";

/* ---------------- The Difference ---------------- */
export function Difference() {
  return (
    <section className="sec-pad-xl bg-paper relative overflow-hidden">
      <div className="max-w-[820px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] text-center">
        <Reveal>
          <Eyebrow center>The Measured difference</Eyebrow>
        </Reveal>
        <Reveal
          delay={80}
          as="h2"
          className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4"
        >
          Weight and metabolism are <span className="text-lav">biology</span> —
          not willpower.
        </Reveal>
        <Reveal
          delay={140}
          className="mt-7 space-y-5 text-[1.05rem] leading-[1.7] text-ink2"
        >
          <p>
            For most people, appetite, energy and weight are driven by biology —
            and for years the only options were generic diet advice or long
            waits to see someone who could actually help.
          </p>
          <p>
            Measured was built to change that. We pair pathology-validated
            testing and continuous glucose data with a registered clinician who
            prescribes evidence-based therapy where appropriate — and a plan
            that adapts as your body responds.
          </p>
          <p className="text-ink font-semibold">
            Not a fad. Not a crash diet. A genuine medical approach, built
            around real life.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- What We Test ---------------- */
export function WhatWeTest() {
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
  const Chip = ({ g, label }: { g: string; label: string }) => (
    <span className="inline-flex items-center gap-2.5 bg-white border border-line rounded-full pl-2 pr-5 py-2 shadow-soft whitespace-nowrap">
      <span className={"w-8 h-8 rounded-full shrink-0 " + g}></span>
      <b className="font-semibold text-[0.98rem]">{label}</b>
    </span>
  );
  return (
    <section
      id="test"
      className="sec-pad bg-paper overflow-hidden border-t border-line"
    >
      <div className="max-w-[900px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] text-center mb-[clamp(2.5rem,5vw,3.8rem)]">
        <Reveal>
          <Eyebrow center>What we test</Eyebrow>
        </Reveal>
        <Reveal
          delay={80}
          as="h2"
          className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4"
        >
          Pathology-validated testing across{" "}
          <span className="text-lav">every key system</span>.
        </Reveal>
        <Reveal
          delay={140}
          as="p"
          className="mt-5 text-[clamp(1.05rem,1.25vw,1.3rem)] text-ink2"
        >
          Not a one-off snapshot — a personalised baseline, tracked over time.
        </Reveal>
      </div>
      <div className="marquee-mask flex flex-col gap-4">
        {rows.map((row, i) => (
          <div key={i} className={"mq-row r" + (i + 1)}>
            {row.concat(row).map(([g, label], j) => (
              <Chip key={j} g={g} label={label} />
            ))}
          </div>
        ))}
      </div>
      <p className="text-center mt-[clamp(2.2rem,4vw,3rem)] text-[0.85rem] text-muted max-w-[680px] mx-auto px-6">
        <span className="text-muted">✦</span> Testing depth varies by program
        tier. Metabolic precision and genetic &amp; tolerance markers are
        reviewed by AHPRA-registered practitioners.
      </p>
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
          <span className="inline-flex items-center gap-2 text-[0.74rem] font-semibold tracking-[0.14em] uppercase text-white/85">
            <span className="w-2 h-2 rounded-full bg-white"></span>Your
            progress, tracked
          </span>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.04] mt-4 text-white">
            Every week tells{" "}
            <span className="text-white/70 italic">part of your story</span>.
          </h2>
          <p className="mt-5 text-[1.08rem] leading-[1.6] text-white/80 max-w-[34rem]">
            Weigh-ins, dose, appetite and measurements flow into one place — so
            you and your clinician can see exactly what's working, and adjust
            before anything stalls.
          </p>
          <div className="mt-8">
            <Btn lg variant="white" onClick={openFunnel}>
              Start tracking <span>→</span>
            </Btn>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="bg-white/[0.07] backdrop-blur-md border border-white/15 rounded-xl2 p-5 shadow-card">
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

/* ---------------- Journey ---------------- */
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
  title,
  sub,
  tall,
  children,
}: {
  src: string;
  title: string;
  sub: string;
  tall?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={
        "relative rounded-2xl overflow-hidden text-white min-h-[220px] flex flex-col justify-between " +
        (tall ? "row-span-2" : "")
      }
    >
      <img
        src={src}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg,rgba(10,10,20,.15),rgba(10,10,20,.72))",
        }}
      ></div>
      <div className="relative z-[2] p-[1.1rem]">
        <div className="font-bold text-base">{title}</div>
        <div className="text-[0.78rem] opacity-85 mt-0.5 leading-snug">
          {sub}
        </div>
      </div>
      {children}
    </div>
  );
}

function PlainCard({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-[1.1rem]">
      <div className="font-bold text-base text-ink">{title}</div>
      <div className="text-[0.78rem] text-muted mt-0.5 leading-snug">{sub}</div>
    </div>
  );
}

function JourneyPanel({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <div>
        <div className="flex items-center gap-3 px-1.5 pb-4 pt-1">
          <span className="text-[0.72rem] text-muted whitespace-nowrap">
            Section · 2/4
          </span>
          <span className="flex gap-1.5 flex-1">
            {[1, 1, 0, 0].map((on, i) => (
              <i
                key={i}
                className={
                  "h-[5px] flex-1 rounded-full " +
                  (on ? "bg-gradient-to-r from-blue to-[#5aa97a]" : "bg-line2")
                }
              ></i>
            ))}
          </span>
        </div>
        <div className="border border-line rounded-2xl p-6">
          <h4 className="font-disp text-[1.1rem] font-bold tracking-tight">
            Medical History
          </h4>
          <p className="text-[0.84rem] text-muted mt-1">
            Share your medical history so your clinician can assess safety,
            risks, and suitability.
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
                <label className="text-[0.8rem] font-semibold block mb-1.5">
                  {l} <span className="text-lav">*</span>
                </label>
                <div className="border border-line2 rounded-lg bg-bgsoft px-3.5 py-2.5 text-[0.9rem] text-ink2">
                  {v}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="text-[0.8rem] font-semibold block mb-1.5">
              Do you have any allergies? <span className="text-lav">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <span className="flex items-center gap-2 border border-line2 rounded-lg px-3 py-2.5 text-[0.88rem]">
                <span className="w-4 h-4 rounded-full border-[1.5px] border-line2"></span>
                Yes
              </span>
              <span className="flex items-center gap-2 border border-lav bg-lavtint rounded-lg px-3 py-2.5 text-[0.88rem]">
                <span
                  className="w-4 h-4 rounded-full border-[1.5px] border-lav"
                  style={{
                    background:
                      "radial-gradient(circle,var(--lav) 40%,transparent 45%)",
                  }}
                ></span>
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
          src="/landing/run-outdoor.jpg"
          title="Biomarker Overview"
          sub="Latest results from your metabolic panel"
        >
          <div className="relative z-[2] mx-[1.2rem] mb-[1.1rem]">
            <div className="h-[7px] rounded-full bg-white/30 relative">
              <i className="absolute left-0 top-0 h-full w-[62%] rounded-full bg-white"></i>
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
          src="/landing/lake-calm.jpg"
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
          src="/landing/hiker-point.jpg"
          title="Telehealth Consultation"
          sub="Every result, explained — your protocol, designed with you."
        />
        <PlainCard
          title="Your clinician"
          sub="Dr Anubhav Saxena · MBBS, FRACGP, MPhil"
        />
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
          <div className="text-[0.8rem] opacity-85">
            Tracked across repeat panels
          </div>
          <div className="font-disp font-extrabold text-[2.6rem] mt-auto leading-none">
            −2.5<span className="text-base font-semibold opacity-80"> yrs</span>
          </div>
        </div>
        <PlainCard
          title="Repeat panel"
          sub="Due in 6 weeks · keeps your protocol optimised."
        />
        <PlainCard title="Visceral fat" sub="↓ 14% since baseline DEXA" />
      </div>
    );
  // idx === 3 dashboard
  return (
    <div className="grid grid-cols-2 gap-4">
      <PhotoCard
        tall
        src="/landing/mtn-light.jpg"
        title="Biomarker Overview"
        sub="Latest results from your metabolic panel"
      >
        <div className="relative z-[2] mx-[1.2rem] mb-[1.1rem]">
          <div className="h-[7px] rounded-full bg-white/30 relative">
            <i className="absolute left-0 top-0 h-full w-[62%] rounded-full bg-white"></i>
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
          <span className="absolute left-[46%] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow"></span>
        </div>
        <div className="flex justify-between text-[0.62rem] opacity-80 mt-2">
          <span>−5</span>
          <span>Current</span>
          <span>+5</span>
        </div>
      </div>
      <div className="rounded-2xl border border-line bg-white p-[1.1rem]">
        <div className="font-bold text-ink">Action Plan</div>
        <div className="text-[0.78rem] text-muted mb-1">
          Your current protocol
        </div>
        {(
          [
            ["Oral therapy", "Daily · review in 4 weeks"],
            ["GLP-1 (titrated)", "Weekly · CGM-monitored"],
            ["Nutrient support", "Daily · personalised"],
          ] as [string, string][]
        ).map(([n, p]) => (
          <div
            key={n}
            className="flex items-center gap-2.5 py-2 border-b border-line last:border-0"
          >
            <span className="w-[30px] h-9 rounded-md bg-gradient-to-b from-[#ece6d8] to-[#d8d0bf] shrink-0"></span>
            <div>
              <div className="text-[0.82rem] font-semibold">{n}</div>
              <div className="text-[0.66rem] text-muted">{p}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-line bg-white p-[1.1rem] text-center">
        <div className="font-bold text-ink text-left">Consultations</div>
        <div className="text-[0.78rem] text-muted text-left">
          Remaining this period
        </div>
        <div className="w-[120px] h-[120px] rounded-full mx-auto my-2 grid place-items-center ring-prog relative">
          <div className="absolute inset-3 rounded-full bg-white"></div>
          <span className="relative font-disp font-extrabold text-[1.5rem]">
            1/4
          </span>
        </div>
        <div className="text-[0.6rem] text-muted font-semibold">used</div>
      </div>
    </div>
  );
}

export function Journey() {
  const [active, setActive] = useState(0);
  return (
    <section id="journey" className="sec-pad bg-bgsoft">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
        <Reveal className="max-w-[760px] mb-[clamp(2.5rem,4vw,3.5rem)]">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4">
            Your journey with <span className="text-lav">Measured</span>.
          </h2>
        </Reveal>
        <div className="grid lg:grid-cols-[0.82fr_1.18fr] gap-[clamp(2rem,4vw,3.5rem)] items-start">
          <Reveal className="flex flex-col">
            {JOURNEY_STEPS.map(([title, body], i) => (
              <div
                key={i}
                onClick={() => setActive(i)}
                className="py-6 border-t border-line2 first:border-t-0 cursor-pointer grid grid-cols-[auto_1fr] gap-x-[1.1rem] items-baseline transition-opacity"
              >
                <span
                  className={
                    "text-[0.8rem] font-bold tracking-wide " +
                    (active === i ? "text-lav" : "text-muted")
                  }
                >
                  {String(i + 1).padStart(2, "0")}/
                </span>
                <span
                  className={
                    "font-disp font-extrabold tracking-[-.03em] text-[clamp(1.5rem,2.4vw,2.1rem)] transition-colors " +
                    (active === i ? "text-ink" : "text-muted")
                  }
                >
                  {title}
                </span>
                <div
                  className={
                    "col-start-2 overflow-hidden transition-all duration-300 " +
                    (active === i
                      ? "max-h-[200px] opacity-100 mt-3"
                      : "max-h-0 opacity-0")
                  }
                >
                  <p className="text-ink2 text-base leading-relaxed">{body}</p>
                  <div
                    className={
                      "h-0.5 mt-5 rounded-full overflow-hidden " +
                      (active === i ? "bg-line2" : "")
                    }
                  >
                    {active === i && (
                      <div className="h-full bg-gradient-to-r from-lav to-blue"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Reveal>
          <Reveal delay={120} className="lg:sticky lg:top-24">
            <div className="bg-white border border-line rounded-xl2 shadow-card p-5 min-h-[520px]">
              <JourneyPanel idx={active} key={active} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Program ---------------- */
export function Program() {
  const rows: [string, string, string, string, string][] = [
    [
      "6",
      "Months",
      "CGM-monitored GLP-1 therapy",
      "Six months of clinically guided GLP-1 receptor agonist therapy, titrated to your response with continuous glucose monitoring at every step.",
      "/landing/cgm.jpg",
    ],
    [
      "∞",
      "Throughout",
      "Personalised meal planning",
      "Your doctor builds a plan around your cuisine, preferences, and metabolic targets — with recipes adapted specifically for you.",
      "/landing/poha-grain-bowl.jpg",
    ],
    [
      "2",
      "Scans",
      "DEXA body composition",
      "Baseline and completion DEXA scans measure fat mass, lean mass, and visceral fat — giving you objective before-and-after data.",
      "/landing/dexa.jpg",
    ],
  ];
  return (
    <section id="program" className="sec-pad bg-paper">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
        <Reveal className="max-w-[680px] mb-[clamp(2.5rem,4vw,3.4rem)]">
          <Eyebrow>The Health Optimisation Protocol</Eyebrow>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4">
            Your six months, <span className="text-lav">step by step</span>.
          </h2>
          <p className="mt-4 text-[clamp(1.05rem,1.25vw,1.3rem)] text-ink2 leading-[1.55]">
            A structured, physician-led program built on continuous data — not
            guesswork. From baseline to before-and-after.
          </p>
        </Reveal>
        <div className="grid gap-4">
          {rows.map(([num, lab, h, p, img], i) => (
            <Reveal
              key={i}
              delay={i * 80}
              className="grid grid-cols-[90px_1.1fr] md:grid-cols-[90px_1.1fr_1fr] bg-white border border-line rounded-[18px] overflow-hidden shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300"
            >
              <div className="bg-lavtint text-lav flex flex-col items-center justify-center text-center gap-0.5 p-4">
                <span className="font-disp text-[2rem] font-extrabold">
                  {num}
                </span>
                <span className="text-[0.58rem] tracking-widest uppercase text-lav2">
                  {lab}
                </span>
              </div>
              <div className="px-7 py-6 flex flex-col justify-center">
                <h3 className="font-disp text-[clamp(1.25rem,1.8vw,1.6rem)] font-bold tracking-tight">
                  {h}
                </h3>
                <p className="mt-2 text-ink2 text-[0.98rem] leading-relaxed">
                  {p}
                </p>
              </div>
              <div className="hidden md:block overflow-hidden min-h-[170px]">
                <img
                  src={img}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Everything Included ---------------- */
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

export function EverythingIncluded() {
  const items: [string, string, string, string, string][] = [
    [
      "pill",
      "Prescription GLP-1 therapy",
      "Semaglutide · Tirzepatide · clinician-titrated",
      "Where clinically appropriate, your doctor prescribes an evidence-based GLP-1 medication and adjusts your dose over time — shipped discreetly to your door.",
      "/landing/cgm.jpg",
    ],
    [
      "cross",
      "Clinician oversight",
      "Eligibility · dose management · monitoring",
      "An AHPRA-registered doctor oversees your care from start to finish — confirming eligibility, managing your dose, and monitoring how you respond.",
      "/landing/calm-woman.jpg",
    ],
    [
      "leaf",
      "Personalised nutrition",
      "Protein-first · muscle preservation · your cuisine",
      "Nutrition built for GLP-1 treatment and your CGM response — losing fat while preserving muscle, with recipes around foods you actually enjoy.",
      "/landing/salad-bowl.jpg",
    ],
    [
      "chart",
      "Progress tracking",
      "Weekly weigh-ins · CGM trends · DEXA",
      "Log weight, glucose and measurements in your portal and watch the trend over time — so you and your doctor can see what's working.",
      "/landing/dexa.jpg",
    ],
    [
      "chat",
      "24/7 messaging support",
      "Ask anytime · real people · discreet",
      "Message your care team whenever you need — a question about your medication, a side effect, or your plan. Real support, whenever it matters.",
      "/landing/runner.jpg",
    ],
    [
      "heart",
      "Metabolic health benefits",
      "Blood sugar · blood pressure · cholesterol",
      "Beyond the scales, treatment can support healthier blood sugar, blood pressure and cholesterol — your doctor keeps an eye on the whole picture.",
      "/landing/green-smoothie.jpg",
    ],
    [
      "truck",
      "Discreet home delivery",
      "Plain packaging · Australia-wide · refills",
      "Your medication arrives in discreet, plain packaging, shipped Australia-wide — with refills coordinated so you never miss a dose.",
      "/landing/lake-calm.jpg",
    ],
    [
      "refresh",
      "Long-term maintenance",
      "Maintenance dosing · habits · reviews",
      "Reaching your goal is the start, not the finish. Your doctor helps you transition to a maintenance plan designed to keep results for good.",
      "/landing/hiker-trail.jpg",
    ],
    [
      "tag",
      "Transparent pricing",
      "One monthly price · medication included",
      "One simple monthly price covers your consultations, clinical support and medication. No surprise fees — pause or cancel anytime.",
      "/landing/mtn-light.jpg",
    ],
  ];
  return (
    <section
      id="included"
      className="sec-pad bg-bgsoft border-t border-line2/70"
    >
      <div className="max-w-[1180px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
        <Reveal className="max-w-[720px] mb-[clamp(2.5rem,5vw,4rem)]">
          <Eyebrow>Everything included</Eyebrow>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4">
            More than a prescription.
          </h2>
          <p className="mt-4 text-[clamp(1.05rem,1.25vw,1.3rem)] text-ink2 leading-[1.55]">
            Every plan combines medication, clinical oversight and real human
            support — so you're guided from your first dose to your goal, and
            beyond.
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

/* ---------------- Pricing ---------------- */
export function Pricing() {
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
    <section id="pricing" className="sec-pad-xl bg-paper border-t border-line">
      <div className="max-w-[1100px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
        <Reveal className="max-w-[680px] mb-[clamp(2.5rem,4vw,3.4rem)]">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4">
            One simple plan.{" "}
            <span className="text-lav">Medication included</span>.
          </h2>
          <p className="mt-4 text-[clamp(1.05rem,1.25vw,1.3rem)] text-ink2 leading-[1.55]">
            No tiers to decode, no surprise add-ons. One monthly price covers
            your clinician, your support team and your GLP-1 medication —
            shipped to your door.
          </p>
        </Reveal>
        <Reveal className="grid lg:grid-cols-[1.4fr_1fr] gap-0 rounded-xl2 overflow-hidden border border-line shadow-card">
          <div className="p-[clamp(1.8rem,3vw,2.6rem)] bg-white">
            <div className="font-disp text-[1.5rem] font-extrabold tracking-tight">
              Measured Weight Care Plan
            </div>
            <div className="text-[0.92rem] text-muted mt-1">
              Clinician-led · medication included · 100% online · cancel anytime
            </div>
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted mt-7 mb-3">
              What's included
            </div>
            <ul className="space-y-2.5">
              {includes.map((t) => (
                <li
                  key={t}
                  className="grid grid-cols-[auto_1fr] gap-2.5 text-[0.96rem]"
                >
                  <span className="text-muted font-bold">✦</span>
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
              type="button"
              onClick={openFunnel}
              className="mt-7 w-full justify-center inline-flex items-center gap-2 bg-white text-ink font-bold text-base rounded-full py-[1.05rem] hover:-translate-y-0.5 transition-transform"
            >
              Take the assessment →
            </button>
            <button
              type="button"
              onClick={openFunnel}
              className="mt-2.5 w-full justify-center inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white font-semibold text-base rounded-full py-[1.05rem] hover:bg-white/25 transition-colors"
            >
              See if you qualify
            </button>
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

/* ---------------- Doctor ---------------- */
export function Doctor() {
  return (
    <section id="doctor" className="sec-pad bg-bgsoft">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] grid lg:grid-cols-[0.82fr_1.18fr] gap-[clamp(2rem,5vw,4.5rem)] items-center">
        <Reveal className="relative">
          <div className="rounded-xl2 overflow-hidden aspect-[0.84] shadow-card">
            <img
              src="/images/dr-saxena.jpeg"
              alt="Dr Anubhav Saxena"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -left-4 bottom-7 bg-white border border-line rounded-2xl px-[1.15rem] py-[0.85rem] shadow-card">
            <b className="font-disp text-[1.1rem] font-extrabold block leading-tight tracking-tight">
              Dr Anubhav Saxena
            </b>
            <span className="text-[0.66rem] tracking-widest uppercase text-muted">
              Your doctor
            </span>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <Eyebrow>About us · Your doctor</Eyebrow>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4">
            Medicine that actually <span className="text-lav">knows you</span>.
          </h2>
          <div className="flex gap-2 flex-wrap mt-5">
            {["MBBS", "FRACGP", "MPhil"].map((c) => (
              <span
                key={c}
                className="text-[0.68rem] font-semibold tracking-wide uppercase text-ink2 bg-lavsoft rounded-full px-3.5 py-1.5"
              >
                {c}
              </span>
            ))}
          </div>
          <p className="mt-5 text-[clamp(1.05rem,1.25vw,1.3rem)] text-ink2 leading-[1.55]">
            Fellow of the Royal Australian College of General Practitioners with
            a research background in metabolic medicine. Dr Saxena designed the
            Health Optimisation Protocol to give patients a structured,
            evidence-based path to lasting weight and metabolic improvement.
          </p>
          <div className="mt-8">
            <Btn lg onClick={openFunnel}>
              Book with Dr Saxena <span>→</span>
            </Btn>
          </div>
        </Reveal>
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
            <span className="w-2 h-2 rounded-full grad-dot"></span>Why Measured
            exists
          </span>
        </Reveal>
        <Reveal
          delay={90}
          as="p"
          className="font-disp font-extrabold tracking-[-.03em] leading-[1.08] text-[clamp(1.9rem,4vw,3.2rem)] mt-7 text-balance"
        >
          Weight is biology, not willpower. We pair the data with a doctor who
          actually reads it — and a plan that{" "}
          <span className="text-white">adapts as you do</span>.
        </Reveal>
        <Reveal
          delay={170}
          as="p"
          className="mt-7 mx-auto max-w-[40rem] text-[clamp(1rem,1.15vw,1.18rem)] leading-[1.6] text-white/70"
        >
          No fads. No crash diets. A genuine medical approach to metabolic
          health, built around the life you actually live.
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Quotes ---------------- */
export function Quotes() {
  const qs: [string, string, string, string][] = [
    [
      "For the first time, my labs and how I actually feel were finally connected. I understand my own body now — and exactly what to do with it.",
      "SM",
      "Sarah M.",
      "Brisbane · 6-month program",
    ],
    [
      "Genuinely personable, and measured in every sense. The most practical way I've ever worked with a doctor.",
      "DT",
      "Daniel T.",
      "Melbourne · Patient since 2024",
    ],
    [
      "From the very first visit, they already knew my history. Knowledgeable, calm, and always reachable over telehealth.",
      "AW",
      "Aisha W.",
      "Perth · Protocol patient",
    ],
  ];
  return (
    <section className="sec-pad bg-paper">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
        <Reveal className="text-center max-w-[640px] mx-auto mb-[clamp(2.5rem,5vw,3.4rem)]">
          <Eyebrow center>Patient stories</Eyebrow>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4">
            Care people <span className="text-lav">actually feel</span>.
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {qs.map(([quote, ini, name, role], i) => (
            <Reveal
              key={i}
              delay={i * 90}
              className="bg-white rounded-[20px] p-8 flex flex-col shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300"
            >
              <div className="inline-flex items-center gap-1.5 text-[0.64rem] font-semibold tracking-[0.16em] uppercase text-lav mb-5">
                <span className="w-1.5 h-1.5 rounded-full grad-dot"></span>
                Verified patient
              </div>
              <blockquote className="text-[1.08rem] leading-relaxed text-ink font-medium flex-1 tracking-[-.01em]">
                {quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="w-9 h-9 rounded-full grad-dot text-white font-bold text-[0.76rem] grid place-items-center">
                  {ini}
                </span>
                <span>
                  <b className="block text-[0.88rem] font-bold">{name}</b>
                  <span className="text-[0.8rem] text-muted">{role}</span>
                </span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
export function FAQ() {
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
    <section id="faq" className="sec-pad bg-bgsoft">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] grid lg:grid-cols-[0.7fr_1.3fr] gap-[clamp(2rem,5vw,4rem)] items-start">
        <Reveal>
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4">
            Questions, answered.
          </h2>
          <p className="mt-4 text-[clamp(1.05rem,1.25vw,1.3rem)] text-ink2 leading-[1.55]">
            Still unsure if Measured is right for you? The assessment is the
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
                <span className="shrink-0 w-7 h-7 rounded-full border border-line2 grid place-items-center text-lav group-open:bg-lav group-open:text-white group-open:border-lav transition-colors text-lg leading-none">
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
      <div className="relative z-[1] max-w-[820px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] py-[clamp(6.5rem,12vw,11rem)]">
        <Reveal>
          <Eyebrow center>Limited availability</Eyebrow>
        </Reveal>
        <Reveal
          delay={80}
          as="h2"
          className="font-disp font-extrabold tracking-[-.03em] text-white text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] mt-4"
        >
          Begin your strongest decade.
        </Reveal>
        <Reveal
          delay={140}
          as="p"
          className="text-white/90 mt-6 mx-auto max-w-[34rem] text-[clamp(1.05rem,1.25vw,1.3rem)] leading-[1.55]"
        >
          We take on a limited number of patients so every plan gets the
          attention it deserves. Start with a short online assessment — no
          commitment required.
        </Reveal>
        <Reveal
          delay={200}
          className="mt-9 flex gap-3.5 justify-center flex-wrap"
        >
          <button
            type="button"
            onClick={openFunnel}
            className="inline-flex items-center gap-2 bg-white text-ink font-semibold rounded-full text-base px-7 py-[1.05rem] hover:-translate-y-0.5 transition-transform"
          >
            Take the assessment <span>→</span>
          </button>
          <Btn lg variant="dark" href="#journey">
            See how it works
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
    <footer className="bg-[#0e130f] text-white/60 py-[clamp(3.5rem,6vw,5rem)]">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1.1fr] gap-8 pb-10 border-b border-white/10">
          <div>
            <span className="font-disp text-[1.35rem] font-extrabold text-white">
              Measured
            </span>
            <p className="mt-4 text-[0.92rem] leading-relaxed max-w-[32ch]">
              Precision metabolic medicine. Pathology-validated testing,
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
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 flex-wrap pt-7 text-[0.8rem] text-white/45">
          <span>© 2026 Measured · Precision Metabolic Medicine</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
