"use client";

/* eslint-disable react/no-unescaped-entities */

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import type { DiscoveryTimeBlock } from "@/types/db";
import { isDiscoveryEligible } from "@/lib/eligibility";

const FUNNEL_STEPS = [
  "Your name",
  "Contact",
  "About you",
  "Activity",
  "Priorities",
  "Book your call",
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

// Discovery calls run as four 3-hour windows; the team confirms an exact start
// time by email. `id` is the canonical value stored in Supabase.
const TIME_BLOCKS: { id: DiscoveryTimeBlock; period: string; range: string }[] =
  [
    { id: "9-12", period: "Morning", range: "9:00 AM – 12:00 PM" },
    { id: "12-3", period: "Midday", range: "12:00 PM – 3:00 PM" },
    { id: "3-6", period: "Afternoon", range: "3:00 PM – 6:00 PM" },
    { id: "6-9", period: "Evening", range: "6:00 PM – 9:00 PM" },
  ];

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
  date: Date | null;
  block: DiscoveryTimeBlock | null;
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

const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
const phoneOk = (p: string) => p.replace(/\D/g, "").length >= 8;
const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

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
      className="text-[0.9rem] font-semibold text-muted hover:text-ink transition-colors"
    >
      ← Back
    </button>
  );
}

export function Funnel() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [declined, setDeclined] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
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
    date: null,
    block: null,
  });
  const dates = useMemo(() => bookingDates(), []);

  useEffect(() => {
    const h = () => {
      setStep(0);
      setDeclined(false);
      setConfirmed(false);
      setSubmitError(false);
      setOpen(true);
    };
    window.addEventListener("open-funnel", h);
    return () => window.removeEventListener("open-funnel", h);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
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
  const fmtDate = (dt: Date | null) =>
    dt
      ? dt.toLocaleDateString("en-AU", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
      : "";

  // Silent eligibility routing. Runs when leaving the priorities step so the
  // outcome reads as a holistic assessment rather than a reaction to any one
  // answer.
  const reviewAndContinue = () => {
    if (isDiscoveryEligible(data.heightCm, data.weightKg)) setStep(5);
    else setDeclined(true);
  };

  const blockLabel = TIME_BLOCKS.find((b) => b.id === data.block)?.range ?? "";

  async function submit() {
    if (!data.date || !data.block) return;
    setSubmitting(true);
    setSubmitError(false);
    try {
      const res = await fetch("/api/discovery-booking", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          first_name: data.first.trim(),
          last_name: data.last.trim(),
          email: data.email.trim(),
          phone: data.mobile.trim(),
          preferred_date: toISODate(data.date),
          time_block: data.block,
        }),
      });
      const json = (await res.json().catch(() => null)) as {
        ok?: boolean;
      } | null;
      if (!res.ok || !json?.ok) throw new Error("submit_failed");
      setConfirmed(true);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-stretch md:items-center justify-center p-0 md:p-6"
      style={{ background: "rgba(14,14,20,.55)", backdropFilter: "blur(6px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="bg-white w-full max-w-[940px] md:rounded-[24px] overflow-hidden grid md:grid-cols-[300px_1fr] max-h-screen md:max-h-[88vh]"
        initial={{ opacity: 0, scale: 0.965, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26, mass: 0.9 }}
      >
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
                  (i === step && !declined && !confirmed
                    ? "opacity-100"
                    : "opacity-55")
                }
              >
                <span
                  className={
                    "w-7 h-7 rounded-full grid place-items-center text-[0.78rem] font-bold " +
                    (i <= step ? "bg-white text-lav" : "bg-white/20 text-white")
                  }
                >
                  {i < step || confirmed ? "✓" : i + 1}
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
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-bgsoft hover:bg-line2 grid place-items-center text-ink text-lg z-10"
          >
            ✕
          </button>
          <div className="h-1 bg-line2">
            <div
              className="h-full grad-lav transition-all duration-500"
              style={{
                width: (confirmed ? 100 : (step / 5) * 100) + "%",
              }}
            ></div>
          </div>
          <div className="p-[clamp(1.75rem,4vw,2.75rem)] flex-1">
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
                  Based on what you've shared, our current programs aren't the
                  right fit for you just now. They're clinically designed for
                  specific metabolic profiles, and we'd rather be upfront than
                  point you toward something that won't serve you.
                </p>
                <p className="text-ink2 mt-3 text-[0.92rem] max-w-[44ch] mx-auto leading-relaxed">
                  If your circumstances change, we'd love to hear from you,
                  reach our team any time at{" "}
                  <a
                    href="mailto:hello@measured.au"
                    className="font-semibold text-lav hover:underline"
                  >
                    hello@measured.au
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-8 inline-flex items-center gap-2 bg-lav text-white font-semibold rounded-full px-7 py-3 hover:-translate-y-0.5 transition-transform"
                >
                  Back to Measured
                </button>
              </div>
            ) : confirmed ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full grad-lav text-white grid place-items-center text-2xl mx-auto">
                  ✦
                </div>
                <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-lav mt-5">
                  You're booked in
                </div>
                <h2 className="font-disp text-[2rem] font-extrabold tracking-tight mt-2 mb-3">
                  You're all set{data.first ? ", " + data.first : ""}.
                </h2>
                <p className="text-ink2">
                  Your discovery call is confirmed for
                  <br />
                  <b className="text-ink">
                    {fmtDate(data.date)} · {blockLabel} AEST
                  </b>
                  .
                </p>
                <p className="text-ink2 mt-2 text-[0.92rem]">
                  We'll email {data.email || "you"} to confirm an exact start
                  time within your window.
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-8 inline-flex items-center gap-2 bg-lav text-white font-semibold rounded-full px-7 py-3 hover:-translate-y-0.5 transition-transform"
                >
                  Back to Measured
                </button>
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
                      Your dedicated Measured clinician will use this to
                      personalise your plan.
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
                      <BackBtn onClick={back} />
                      <NextBtn
                        disabled={!emailOk(data.email) || !phoneOk(data.mobile)}
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
                      establish your metabolic baseline and tailor your plan.
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
                        {["Male", "Female", "Prefer not to say"].map((g) => (
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
                        ))}
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
                      This helps your clinician understand your baseline and set
                      realistic goals.
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
                      <NextBtn onClick={reviewAndContinue}>Continue →</NextBtn>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div>
                    <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-lav mb-3">
                      Step 6 of 6
                    </div>
                    <h2 className="font-disp text-[2rem] font-extrabold tracking-tight leading-tight mb-2">
                      Book your discovery call.
                    </h2>
                    <p className="text-ink2 mb-6">
                      15 minutes with a Measured clinician. No commitment
                      required. All times AEST.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-muted mb-2">
                          Select a date
                        </div>
                        <div className="flex flex-col gap-2">
                          {dates.map((dt, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => set("date", dt)}
                              className={
                                "press text-left rounded-xl border px-4 py-2.5 text-[0.9rem] transition-colors " +
                                (data.date &&
                                data.date.getTime() === dt.getTime()
                                  ? "border-lav bg-lavtint font-semibold"
                                  : "border-line2 text-ink2 hover:border-lav")
                              }
                            >
                              {fmtDate(dt)}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-muted mb-2">
                          Choose a time
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {TIME_BLOCKS.map((b) => (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => set("block", b.id)}
                              className={
                                "press text-left rounded-xl border px-3 py-3 transition-colors " +
                                (data.block === b.id
                                  ? "border-lav bg-lavtint"
                                  : "border-line2 hover:border-lav")
                              }
                            >
                              <div className="text-[0.9rem] font-semibold text-ink">
                                {b.period}
                              </div>
                              <div className="text-[0.76rem] text-muted">
                                {b.range}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-[0.78rem] text-muted mt-5 leading-relaxed">
                      ✦ Pick the window that suits you, we'll confirm an exact
                      start time by email. ✦ SMS reminder 24 hours before your
                      call.
                    </p>
                    {submitError && (
                      <p className="text-[0.82rem] text-red-600 mt-3">
                        Something went wrong saving your booking. Please try
                        again.
                      </p>
                    )}
                    <div className="flex justify-between items-center mt-5">
                      <BackBtn onClick={back} />
                      <NextBtn
                        disabled={!data.date || !data.block || submitting}
                        onClick={submit}
                      >
                        {submitting ? "Booking…" : "Confirm booking →"}
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
  );
}
