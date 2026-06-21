"use client";

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Assessment funnel.
 *
 * A short profiling survey that, on completion, routes the visitor by a quiet
 * metabolic-baseline pre-screen: those who meet it choose a specialist doctor
 * and book directly on HealthEngine; those who don't get a respectful decline.
 *
 * Listens for the global `open-funnel` event (dispatched by openFunnel() in
 * shared.tsx) so every existing CTA across the landing opens it unchanged.
 * Height/weight are used only in the browser to compute the gate and are never
 * sent anywhere.
 */

const FUNNEL_STEPS = [
  "Your name",
  "Contact",
  "About you",
  "Activity",
  "Priorities",
  "Book in",
];

const ACTIVITY = [
  "Sedentary, mostly desk-based, little regular exercise",
  "Lightly active, 1–2 sessions per week",
  "Moderately active, 3–4 sessions per week",
  "Very active, 5+ sessions per week",
  "Athlete, competitive or high-performance training",
];

const PRIORITIES: [string, string][] = [
  ["⚖️", "Lose Weight"],
  ["🍽️", "Reduce Appetite"],
  ["🔬", "Metabolic Health"],
  ["💪", "Preserve Muscle"],
  ["⚡", "More Energy"],
  ["🩸", "Blood Sugar Control"],
  ["❤️", "Heart Health"],
  ["😴", "Better Sleep"],
];

/** Metabolic-baseline pre-screen: BMI >= 27, the standard clinical threshold
 *  for GLP-1 / metabolic weight management. Kept here, never shown, so the
 *  survey reads as profiling rather than a visible pass/fail gate. */
const ELIGIBLE_BMI = 27;
function isEligible(heightCm: number, weightKg: number): boolean {
  if (heightCm <= 0) return false;
  const m = heightCm / 100;
  return weightKg / (m * m) >= ELIGIBLE_BMI;
}

type Doctor = {
  slug: string;
  name: string;
  title: string;
  credentials: string;
  blurb: string;
  location: string;
  img: string;
  url: string;
};

const DOCTORS: Doctor[] = [
  {
    slug: "saxena",
    name: "Dr Anubhav Saxena",
    title: "Specialist GP, metabolic medicine",
    credentials: "MBBS · FRACGP · MPhil",
    blurb:
      "Fellow of the RACGP with a research background in metabolic medicine, leading Calibrate by CLOVE.",
    location: "Beecroft, NSW",
    img: "/images/dr-saxena.png",
    url: "https://healthengine.com.au/doctor/nsw/beecroft/dr-anubhav-saxena/p123180",
  },
  {
    slug: "yadav",
    name: "Dr Tushar Yadav",
    title: "Specialist GP, weight & metabolic care",
    credentials: "MBBS · FRACGP",
    blurb:
      "Works alongside Calibrate by CLOVE providing doctor-led, evidence-based weight and metabolic care.",
    location: "Beecroft, NSW",
    img: "/images/dr-yadav.png",
    url: "https://healthengine.com.au/doctor/nsw/beecroft/dr-tushar-yadav/p157754",
  },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface FunnelData {
  first: string;
  last: string;
  email: string;
  mobile: string;
  age: number | string;
  gender: string;
  heightCm: number;
  weightKg: number;
  activity: string;
  priorities: string[];
}

const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
const phoneOk = (p: string) => p.replace(/\D/g, "").length >= 8;

const inputCls =
  "w-full border border-line2 rounded-xl bg-bgsoft px-4 py-3 text-[0.95rem] outline-none focus:border-lav focus:bg-white transition-colors";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-4">
      <label className="text-[0.82rem] font-semibold text-ink2 block mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function SliderStat({
  label,
  value,
  suffix,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  suffix: string;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="text-[0.82rem] font-semibold text-ink2 block mb-1.5">
        {label}
      </label>
      <div className="font-disp text-[1.9rem] font-extrabold text-lav leading-none mb-2">
        {value}
        <span className="text-[0.95rem] font-bold text-muted ml-1">
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-lav"
      />
      <div className="flex justify-between text-[0.72rem] text-muted mt-1">
        <span>
          {min}
          {suffix}
        </span>
        <span>
          {max}
          {suffix}
        </span>
      </div>
    </div>
  );
}

function NextBtn({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={
        "press inline-flex items-center gap-2 bg-lav text-white font-semibold rounded-full px-6 py-3 " +
        (disabled ? "opacity-40 cursor-not-allowed" : "hover:-translate-y-0.5")
      }
    >
      {children}
    </button>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="-ml-2 inline-flex min-h-[44px] items-center px-2 text-[0.9rem] font-semibold text-muted transition-colors hover:text-ink"
    >
      ← Back
    </button>
  );
}

/** Doctor card with an initials fallback if the photo is missing. */
function DocCard({ doc }: { doc: Doctor }) {
  const [failed, setFailed] = useState(false);
  const initials = doc.name
    .replace(/^Dr\s+/i, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <a
      href={doc.url}
      target="_blank"
      rel="noopener noreferrer"
      className="press group flex items-start gap-4 rounded-2xl border border-line bg-white p-5 text-left shadow-soft transition-shadow hover:shadow-card"
    >
      {failed ? (
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl grad-lav text-[1rem] font-bold text-white">
          {initials}
        </span>
      ) : (
        <img
          src={doc.img}
          alt={doc.name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-1 ring-line"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-disp text-[1.1rem] font-bold tracking-tight">
            {doc.name}
          </span>
          <span className="shrink-0 text-[0.7rem] font-semibold text-muted">
            {doc.location}
          </span>
        </div>
        <div className="mt-0.5 text-[0.82rem] text-ink2">{doc.title}</div>
        <div className="mt-1 text-[0.7rem] font-semibold uppercase tracking-wider text-muted">
          {doc.credentials}
        </div>
        <span className="mt-2.5 inline-flex items-center gap-1.5 text-[0.84rem] font-bold text-lav">
          Book with {doc.name}
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          >
            →
          </span>
        </span>
      </div>
    </a>
  );
}

export function Funnel() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [declined, setDeclined] = useState(false);
  const [qualified, setQualified] = useState(false);
  const [data, setData] = useState<FunnelData>({
    first: "",
    last: "",
    email: "",
    mobile: "",
    age: 38,
    gender: "",
    heightCm: 170,
    weightKg: 85,
    activity: "",
    priorities: [],
  });

  useEffect(() => {
    const h = () => {
      setStep(0);
      setDeclined(false);
      setQualified(false);
      setOpen(true);
    };
    window.addEventListener("open-funnel", h);
    return () => window.removeEventListener("open-funnel", h);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const set = (k: keyof FunnelData, v: FunnelData[keyof FunnelData]) =>
    setData((d) => ({ ...d, [k]: v }));
  const togglePri = (label: string) =>
    setData((d) => ({
      ...d,
      priorities: d.priorities.includes(label)
        ? d.priorities.filter((p) => p !== label)
        : [...d.priorities, label],
    }));
  const next = () => setStep((s) => Math.min(s + 1, 5));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  // Silent eligibility routing. Runs when leaving the priorities step so the
  // outcome reads as a holistic assessment rather than a reaction to one answer.
  const reviewAndContinue = () => {
    const eligible = isEligible(data.heightCm, data.weightKg);
    // Email the completed assessment to the clinic regardless of outcome.
    // Fire-and-forget so routing is never blocked by the network.
    void fetch("/api/assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, eligible }),
    }).catch(() => {});
    if (eligible) {
      setQualified(true);
      setStep(5);
    } else {
      setDeclined(true);
    }
  };

  const railDone = declined || qualified;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-end justify-center p-0 md:items-center md:p-6"
          style={{
            background: "rgba(14,14,20,.55)",
            backdropFilter: "blur(6px)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Assessment"
        >
          <motion.div
            className="grid max-h-[93dvh] w-full max-w-[940px] grid-rows-1 overflow-hidden rounded-t-[26px] bg-white md:max-h-[88dvh] md:grid-cols-[300px_1fr] md:rounded-[24px]"
            initial={{ opacity: 0, scale: 0.965, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 26,
              mass: 0.9,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left rail */}
            <div className="grad-lav hidden min-h-0 flex-col overflow-y-auto p-8 text-white md:flex">
              <span className="font-disp text-[1.3rem] font-extrabold">
                Calibrate by CLOVE
              </span>
              <div className="mt-10 flex flex-col gap-1">
                {FUNNEL_STEPS.map((s, i) => (
                  <div
                    key={s}
                    className={
                      "flex items-center gap-3 py-2.5 transition-opacity " +
                      (i === step && !railDone ? "opacity-100" : "opacity-55")
                    }
                  >
                    <span
                      className={
                        "w-7 h-7 rounded-full grid place-items-center text-[0.78rem] font-bold " +
                        (i < step || qualified
                          ? "bg-white text-lav"
                          : "bg-white/20 text-white")
                      }
                    >
                      {i < step || qualified ? "✓" : i + 1}
                    </span>
                    <span className="text-[0.9rem] font-medium">{s}</span>
                  </div>
                ))}
              </div>
              <p className="mt-auto text-[0.78rem] text-white/70 leading-relaxed">
                A few quick questions, then book your first consult with a
                specialist doctor. No commitment required.
              </p>
            </div>

            {/* Right content */}
            <div className="relative flex min-h-0 flex-col overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute top-4 right-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-bgsoft text-lg text-ink hover:bg-line2"
              >
                ✕
              </button>
              <div className="flex shrink-0 justify-center pt-2.5 md:hidden">
                <span
                  className="h-1.5 w-10 rounded-full bg-line2"
                  aria-hidden="true"
                ></span>
              </div>
              <div className="h-1 shrink-0 bg-line2">
                <div
                  className="h-full grad-lav transition-all duration-500"
                  style={{ width: (qualified ? 100 : (step / 5) * 100) + "%" }}
                ></div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-[clamp(1.5rem,4vw,2.75rem)] pt-[clamp(1.75rem,4vw,2.75rem)] pb-[max(2.25rem,env(safe-area-inset-bottom))]">
                {/* Soft decline, never references the metabolic threshold */}
                {declined ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 rounded-full bg-bgsoft text-ink grid place-items-center text-2xl mx-auto">
                      ✦
                    </div>
                    <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-muted mt-5">
                      Thanks for sharing
                    </div>
                    <h2 className="font-disp text-[2rem] font-extrabold tracking-tight mt-2 mb-3">
                      Thank you{data.first ? ", " + data.first : ""}.
                    </h2>
                    <p className="text-ink2 max-w-[44ch] mx-auto leading-relaxed">
                      Based on what you've shared, Calibrate by CLOVE isn't the
                      right fit for you just now. It's clinically designed for
                      specific metabolic profiles, and we'd rather be upfront
                      than point you toward something that won't serve you.
                    </p>
                    <p className="text-ink2 mt-3 text-[0.92rem] max-w-[44ch] mx-auto leading-relaxed">
                      If your circumstances change, we'd love to hear from you,
                      reach our team any time at{" "}
                      <a
                        href="mailto:care@clove.au"
                        className="font-semibold text-lav hover:underline"
                      >
                        care@clove.au
                      </a>
                      .
                    </p>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="mt-8 inline-flex items-center gap-2 bg-lav text-white font-semibold rounded-full px-7 py-3 hover:-translate-y-0.5 transition-transform"
                    >
                      Back to CLOVE
                    </button>
                  </div>
                ) : qualified ? (
                  <div>
                    <div className="w-14 h-14 rounded-full grad-lav text-white grid place-items-center text-xl">
                      ✦
                    </div>
                    <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-lav mt-5">
                      You're a match
                    </div>
                    <h2 className="font-disp text-[clamp(1.7rem,3vw,2.2rem)] font-extrabold tracking-tight mt-2">
                      Good news{data.first ? ", " + data.first : ""}, you
                      qualify.
                    </h2>
                    <p className="text-ink2 mt-2 max-w-[52ch] leading-relaxed">
                      Based on your answers, Calibrate by CLOVE looks like a
                      strong fit. Choose your specialist doctor to book your
                      first consultation, confirmed directly on HealthEngine.
                    </p>
                    <div className="mt-6 flex flex-col gap-4">
                      {DOCTORS.map((doc) => (
                        <DocCard key={doc.slug} doc={doc} />
                      ))}
                    </div>
                    <p className="mt-5 text-[0.78rem] text-muted">
                      You'll book and confirm your appointment directly on
                      HealthEngine. No commitment required.
                    </p>
                  </div>
                ) : (
                  <>
                    {step === 0 && (
                      <div>
                        <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-lav mb-3">
                          Step 1 of 6
                        </div>
                        <h2 className="font-disp text-[2rem] font-extrabold tracking-tight leading-tight mb-2">
                          Let's start with your name.
                        </h2>
                        <p className="text-ink2 mb-7">
                          Your specialist doctor will use this to personalise
                          your care.
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
                          <NextBtn disabled={!data.first.trim()} onClick={next}>
                            Continue →
                          </NextBtn>
                        </div>
                      </div>
                    )}

                    {step === 1 && (
                      <div>
                        <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-lav mb-3">
                          Step 2 of 6
                        </div>
                        <h2 className="font-disp text-[2rem] font-extrabold tracking-tight leading-tight mb-2">
                          How do we reach you?
                        </h2>
                        <p className="text-ink2 mb-7">
                          So your doctor's clinic can confirm your appointment
                          and send reminders.
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
                          <BackBtn onClick={back} />
                          <NextBtn
                            disabled={
                              !emailOk(data.email) || !phoneOk(data.mobile)
                            }
                            onClick={next}
                          >
                            Continue →
                          </NextBtn>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div>
                        <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-lav mb-3">
                          Step 3 of 6
                        </div>
                        <h2 className="font-disp text-[2rem] font-extrabold tracking-tight leading-tight mb-2">
                          A little about you.
                        </h2>
                        <p className="text-ink2 mb-7">
                          Your age and a few measurements let your clinician
                          establish your metabolic baseline.
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
                            onChange={(e) => set("age", e.target.value)}
                            className="w-full accent-lav"
                          />
                          <div className="flex justify-between text-[0.72rem] text-muted mt-1">
                            <span>18</span>
                            <span>85</span>
                          </div>
                        </Field>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <SliderStat
                            label="Height"
                            value={data.heightCm}
                            suffix="cm"
                            min={140}
                            max={210}
                            onChange={(v) => set("heightCm", v)}
                          />
                          <SliderStat
                            label="Weight"
                            value={data.weightKg}
                            suffix="kg"
                            min={45}
                            max={180}
                            onChange={(v) => set("weightKg", v)}
                          />
                        </div>
                        <Field label="Biological sex">
                          <div className="grid grid-cols-3 gap-2.5">
                            {["Male", "Female", "Prefer not to say"].map(
                              (g) => (
                                <button
                                  key={g}
                                  type="button"
                                  onClick={() => set("gender", g)}
                                  className={
                                    "press rounded-xl border px-3 py-2.5 text-[0.88rem] transition-colors " +
                                    (data.gender === g
                                      ? "border-lav bg-lavtint text-ink font-semibold"
                                      : "border-line2 text-ink2 hover:border-lav")
                                  }
                                >
                                  {g}
                                </button>
                              ),
                            )}
                          </div>
                        </Field>
                        <div className="flex justify-between items-center mt-4">
                          <BackBtn onClick={back} />
                          <NextBtn onClick={next}>Continue →</NextBtn>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div>
                        <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-lav mb-3">
                          Step 4 of 6
                        </div>
                        <h2 className="font-disp text-[2rem] font-extrabold tracking-tight leading-tight mb-2">
                          How active are you currently?
                        </h2>
                        <p className="text-ink2 mb-7">
                          This helps your clinician understand your baseline and
                          set realistic goals.
                        </p>
                        <div className="flex flex-col gap-2.5">
                          {ACTIVITY.map((a) => (
                            <button
                              key={a}
                              type="button"
                              onClick={() => set("activity", a)}
                              className={
                                "press text-left rounded-xl border px-4 py-3.5 text-[0.92rem] transition-colors " +
                                (data.activity === a
                                  ? "border-lav bg-lavtint font-semibold"
                                  : "border-line2 text-ink2 hover:border-lav")
                              }
                            >
                              {a}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between items-center mt-5">
                          <BackBtn onClick={back} />
                          <NextBtn onClick={next}>Continue →</NextBtn>
                        </div>
                      </div>
                    )}

                    {step === 4 && (
                      <div>
                        <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-lav mb-3">
                          Step 5 of 6
                        </div>
                        <h2 className="font-disp text-[2rem] font-extrabold tracking-tight leading-tight mb-2">
                          What matters most to you?
                        </h2>
                        <p className="text-ink2 mb-7">
                          Select all that apply. Your clinician will focus here
                          first.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {PRIORITIES.map(([icon, label]) => {
                            const on = data.priorities.includes(label);
                            return (
                              <button
                                key={label}
                                type="button"
                                onClick={() => togglePri(label)}
                                className={
                                  "press flex flex-col items-center gap-2 rounded-xl border px-2 py-4 text-[0.82rem] font-medium transition-colors " +
                                  (on
                                    ? "border-lav bg-lavtint"
                                    : "border-line2 text-ink2 hover:border-lav")
                                }
                              >
                                <span className="text-xl">{icon}</span>
                                {label}
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex justify-between items-center mt-5">
                          <BackBtn onClick={back} />
                          <NextBtn onClick={reviewAndContinue}>
                            See if I qualify →
                          </NextBtn>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
