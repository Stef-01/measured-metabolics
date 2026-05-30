"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  useInView,
  useScroll,
  useSpring,
  AnimatePresence,
} from "framer-motion";

const BOOKING_URL =
  "https://healthengine.com.au/doctor/nsw/beecroft/dr-anubhav-saxena/p123180";
const CONTACT_EMAIL = "anubhav.saxena@qs2000.com.au";
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

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
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Eyebrow label ─────────────────────────────────────────────────────────────
function Eyebrow({
  children,
  center = false,
  noRule = false,
  bright = false,
}: {
  children: React.ReactNode;
  center?: boolean;
  noRule?: boolean;
  bright?: boolean;
}) {
  const color = bright
    ? "var(--measured-gold-bright)"
    : "var(--measured-gold-dark)";
  return (
    <span
      className="inline-flex items-center gap-3 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.2em]"
      style={{ color, justifyContent: center ? "center" : undefined }}
    >
      {!noRule && (
        <span
          className="block h-px w-[26px] opacity-80"
          style={{ background: "var(--measured-gold-bright)" }}
        />
      )}
      {children}
    </span>
  );
}

// ── Primary button ────────────────────────────────────────────────────────────
function BtnPrimary({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const props = external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};
  return (
    <a
      href={href}
      {...props}
      className="inline-flex items-center gap-2 rounded-full px-[1.6rem] py-[0.95rem] text-[0.92rem] font-semibold tracking-[0.01em] text-[var(--measured-cream)] transition-all hover:-translate-y-0.5"
      style={{
        background: "var(--measured-green)",
        boxShadow:
          "0 1px 2px rgba(16,38,25,.18), 0 8px 24px -10px rgba(16,38,25,.5)",
      }}
    >
      {children}
    </a>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function LandingNav() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <>
      <motion.div
        className="fixed left-0 right-0 top-0 z-[200] h-[2px] origin-left"
        style={{ scaleX, background: "var(--measured-green)" }}
      />
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background:
            "color-mix(in srgb, var(--measured-cream) 86%, transparent)",
          backdropFilter: "blur(14px) saturate(1.1)",
          WebkitBackdropFilter: "blur(14px) saturate(1.1)",
          borderColor: "var(--measured-line-soft)",
        }}
      >
        <div
          className="mx-auto flex max-w-[1180px] items-center justify-between gap-8 px-[clamp(1.25rem,4vw,3rem)]"
          style={{ height: "74px" }}
        >
          {/* Brand */}
          <a
            href="#top"
            className="flex items-center gap-3"
            aria-label="Measured Metabolics home"
          >
            <div
              className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full font-serif text-[1.15rem] font-semibold"
              style={{
                background: "var(--measured-green)",
                color: "var(--measured-cream)",
              }}
            >
              M
            </div>
            <span className="font-serif text-[1.4rem] font-semibold leading-none tracking-tight">
              Measured
              <span style={{ color: "var(--measured-gold-dark)" }}>.</span>
            </span>
          </a>

          {/* Nav links */}
          <nav
            className="hidden items-center gap-[2.1rem] lg:flex"
            aria-label="Primary"
          >
            {[
              { href: "#focus", label: "What we treat" },
              { href: "#program", label: "The Program" },
              { href: "#how", label: "How it works" },
              { href: "#doctor", label: "Your doctor" },
              { href: "#faq", label: "FAQ" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-[0.84rem] font-medium tracking-[0.02em] opacity-[0.78] transition-opacity hover:opacity-100"
                style={{ color: "var(--measured-ink)" }}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-[1.4rem] py-[0.85rem] text-[0.88rem] font-semibold tracking-[0.01em] text-[var(--measured-cream)] transition-all hover:-translate-y-0.5"
            style={{
              background: "var(--measured-green)",
              boxShadow:
                "0 1px 2px rgba(16,38,25,.18), 0 8px 24px -10px rgba(16,38,25,.5)",
            }}
          >
            Book intro call <span>→</span>
          </a>
        </div>
      </header>
    </>
  );
}

// ── FAQ accordion entry ────────────────────────────────────────────────────────
function FaqEntry({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: "var(--measured-line)" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left"
        aria-expanded={open}
      >
        <span
          className="font-serif text-[clamp(1.15rem,1.6vw,1.4rem)] font-semibold"
          style={{ color: "var(--measured-ink)" }}
        >
          {q}
        </span>
        <span
          className="relative grid h-[28px] w-[28px] shrink-0 place-items-center rounded-full border transition-all"
          style={{
            borderColor: open
              ? "var(--measured-green)"
              : "var(--measured-line)",
            background: open ? "var(--measured-green)" : "transparent",
          }}
        >
          <span
            className="absolute h-[1.5px] w-[11px]"
            style={{
              background: open
                ? "var(--measured-cream)"
                : "var(--measured-ink)",
            }}
          />
          <span
            className="absolute h-[11px] w-[1.5px] transition-all"
            style={{
              background: open
                ? "var(--measured-cream)"
                : "var(--measured-ink)",
              transform: open ? "rotate(90deg) scaleY(0)" : undefined,
              opacity: open ? 0 : 1,
            }}
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
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
            <p
              className="pb-6 text-[1rem] leading-[1.6]"
              style={{ color: "var(--measured-subtext)", maxWidth: "56ch" }}
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Contact form ──────────────────────────────────────────────────────────────
type FormStatus = "idle" | "submitting" | "success" | "error";

function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    setStatus("submitting");
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || undefined,
      message: formData.get("message") || undefined,
      _subject: "New enquiry — Measured Metabolics",
      _template: "table",
      _captcha: "false",
    };
    try {
      const res = await fetch(FORMSUBMIT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  }

  const inputCls =
    "w-full rounded-xl border bg-transparent px-4 py-3 text-[0.95rem] outline-none transition-colors placeholder:text-[var(--measured-subtext)]/50 focus:border-[var(--measured-green)]";
  const inputStyle = { borderColor: "var(--measured-line)" };
  const labelCls =
    "block text-[0.72rem] font-semibold uppercase tracking-[0.14em]";
  const labelStyle = { color: "var(--measured-subtext)" };

  return (
    <section
      id="contact"
      className="mx-auto max-w-[1180px] px-[clamp(1.25rem,4vw,3rem)] py-[clamp(5rem,9vw,9rem)]"
    >
      <div className="grid grid-cols-1 items-start gap-[clamp(2rem,5vw,5rem)] md:grid-cols-[0.85fr_1.15fr]">
        {/* Left: intro */}
        <Reveal>
          <Eyebrow>Get in touch</Eyebrow>
          <h2
            className="mt-[1.2rem] font-serif font-medium leading-[1.04]"
            style={{
              fontSize: "clamp(2.1rem, 4.2vw, 3.5rem)",
              textWrap: "balance",
            }}
          >
            Have a question?{" "}
            <em style={{ fontStyle: "italic", color: "var(--measured-green)" }}>
              We&rsquo;d love to hear from you.
            </em>
          </h2>
          <p
            className="mt-[1.2rem] leading-[1.6]"
            style={{
              fontSize: "clamp(1.05rem, 1.3vw, 1.22rem)",
              color: "var(--measured-subtext)",
            }}
          >
            Send us a message and Dr Saxena&rsquo;s team will be in touch within
            one business day. Or skip straight to booking a free intro call.
          </p>
          <div className="mt-6">
            <BtnPrimary href={BOOKING_URL} external>
              Book a free call →
            </BtnPrimary>
          </div>
          <p
            className="mt-5 text-[0.82rem]"
            style={{ color: "var(--measured-subtext)" }}
          >
            Or email us directly at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-semibold transition-opacity hover:opacity-70"
              style={{ color: "var(--measured-green)" }}
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </Reveal>

        {/* Right: form */}
        <Reveal delay={0.08}>
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-start gap-4 rounded-2xl border p-8"
              style={{
                borderColor: "var(--measured-line-soft)",
                background: "var(--measured-sand)",
              }}
            >
              <span
                className="grid h-12 w-12 place-items-center rounded-full text-xl"
                style={{
                  background: "var(--measured-green)",
                  color: "var(--measured-cream)",
                }}
              >
                ✓
              </span>
              <h3
                className="font-serif text-[1.6rem] font-semibold"
                style={{ color: "var(--measured-green)" }}
              >
                Message sent!
              </h3>
              <p
                className="text-[0.98rem] leading-[1.6]"
                style={{ color: "var(--measured-subtext)" }}
              >
                Thank you — we&rsquo;ll be in touch within one business day.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-2 text-[0.88rem] font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
                style={{ color: "var(--measured-green)" }}
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-5">
              {/* Name + Email row */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className={labelCls} style={labelStyle}>
                    Full name{" "}
                    <span style={{ color: "var(--measured-green)" }}>*</span>
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Jane Smith"
                    className={inputCls}
                    style={inputStyle}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelCls} style={labelStyle}>
                    Email{" "}
                    <span style={{ color: "var(--measured-green)" }}>*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="jane@example.com"
                    className={inputCls}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2">
                <label className={labelCls} style={labelStyle}>
                  Phone{" "}
                  <span className="font-normal normal-case tracking-normal">
                    (optional)
                  </span>
                </label>
                <input
                  name="phone"
                  type="tel"
                  placeholder="+61 4xx xxx xxx"
                  className={inputCls}
                  style={inputStyle}
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label className={labelCls} style={labelStyle}>
                  Message{" "}
                  <span className="font-normal normal-case tracking-normal">
                    (optional)
                  </span>
                </label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Any questions about the program, eligibility, or pricing…"
                  className={`${inputCls} resize-none`}
                  style={inputStyle}
                />
              </div>

              {/* Error */}
              {status === "error" && (
                <p className="text-[0.88rem]" style={{ color: "#a85a37" }}>
                  Something went wrong — please try again or email us directly.
                </p>
              )}

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex items-center gap-2 rounded-full px-[1.6rem] py-[0.95rem] text-[0.92rem] font-semibold tracking-[0.01em] transition-all hover:-translate-y-0.5 disabled:opacity-60"
                  style={{
                    background: "var(--measured-green)",
                    color: "var(--measured-cream)",
                    boxShadow:
                      "0 1px 2px rgba(16,38,25,.18), 0 8px 24px -10px rgba(16,38,25,.5)",
                  }}
                >
                  {status === "submitting" ? "Sending…" : "Send enquiry →"}
                </button>
                <p
                  className="mt-3 text-[0.78rem]"
                  style={{ color: "var(--measured-subtext)" }}
                >
                  We reply within one business day.
                </p>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function DoctorLanding() {
  return (
    <div
      className="min-h-dvh overflow-x-hidden"
      style={{
        background: "var(--measured-cream)",
        color: "var(--measured-ink)",
      }}
    >
      {/* ── Announcement bar ─────────────────────────────────── */}
      <div
        className="px-4 py-[0.6rem] text-center text-[0.78rem] tracking-[0.04em]"
        style={{
          background: "var(--measured-green-deep)",
          color: "#e9ede6",
        }}
      >
        Now welcoming a limited number of new patients
        <span
          className="mx-[0.6rem]"
          style={{ color: "var(--measured-gold-bright)" }}
        >
          ·
        </span>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold"
          style={{
            color: "#fff",
            borderBottom: "1px solid rgba(255,255,255,.4)",
            paddingBottom: "1px",
          }}
        >
          Book a free intro call →
        </a>
      </div>

      {/* ── Nav ──────────────────────────────────────────────── */}
      <LandingNav />

      <main id="top">
        {/* ══════════════════════════════════════════════════════
            Hero
            ══════════════════════════════════════════════════════ */}
        <section className="mx-auto max-w-[1180px] px-[clamp(1.25rem,4vw,3rem)] py-[clamp(3rem,6vw,5.5rem)]">
          <div className="grid grid-cols-1 items-center gap-[clamp(2rem,5vw,5rem)] md:grid-cols-[1.05fr_0.95fr]">
            {/* Copy */}
            <div className="order-2 max-w-[600px] md:order-1">
              <Reveal>
                <Eyebrow>Concierge metabolic medicine</Eyebrow>
              </Reveal>
              <Reveal delay={0.08}>
                <h1
                  className="mt-6 font-serif font-medium leading-[1.07]"
                  style={{
                    fontSize: "clamp(2.6rem, 5.6vw, 4.9rem)",
                    letterSpacing: "-0.018em",
                    textWrap: "balance",
                  }}
                >
                  Metabolic care,{" "}
                  <em
                    style={{
                      fontStyle: "italic",
                      color: "var(--measured-green)",
                    }}
                  >
                    measured
                  </em>{" "}
                  around your biology.
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p
                  className="mt-8 max-w-[30em] leading-[1.6]"
                  style={{
                    fontSize: "clamp(1.05rem, 1.3vw, 1.22rem)",
                    color: "var(--measured-subtext)",
                  }}
                >
                  Physician-led, personalised care for people who want to
                  understand what&rsquo;s actually driving their weight, energy,
                  and long-term health — not another ten-minute visit with a
                  stranger.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <div className="mt-10 flex flex-wrap items-center gap-[0.9rem]">
                  <BtnPrimary href={BOOKING_URL} external>
                    Book your free intro call →
                  </BtnPrimary>
                  <a
                    href="#how"
                    className="inline-flex items-center gap-2 rounded-full border px-[1.6rem] py-[0.95rem] text-[0.92rem] font-semibold tracking-[0.01em] transition-all hover:-translate-y-0.5"
                    style={{
                      borderColor: "var(--measured-line)",
                      color: "var(--measured-ink)",
                    }}
                  >
                    How it works
                  </a>
                </div>
              </Reveal>
              <Reveal delay={0.24}>
                <div
                  className="mt-[2.6rem] flex flex-wrap gap-[clamp(1.5rem,4vw,3rem)] pt-[1.6rem]"
                  style={{ borderTop: "1px solid var(--measured-line)" }}
                >
                  {[
                    { val: "1:1", label: "Direct access to your doctor" },
                    { val: "CGM", label: "Continuous glucose-guided plans" },
                    { val: "72hr", label: "Lab results, fully explained" },
                  ].map(({ val, label }) => (
                    <div key={val} className="flex flex-col gap-0.5">
                      <b
                        className="font-serif text-[1.9rem] font-semibold leading-none"
                        style={{ color: "var(--measured-green)" }}
                      >
                        {val}
                      </b>
                      <span
                        className="text-[0.78rem] tracking-[0.02em]"
                        style={{ color: "var(--measured-subtext)" }}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Portrait */}
            <Reveal delay={0.16} className="order-1 md:order-2">
              <div className="relative mx-auto max-w-[440px] md:max-w-none">
                <div
                  className="relative w-full overflow-hidden"
                  style={{
                    aspectRatio: "0.84",
                    borderRadius: "220px 220px 18px 18px",
                    boxShadow: "0 30px 70px -30px rgba(16,38,25,.45)",
                  }}
                >
                  <Image
                    src="/images/hero/lifestyle.jpg"
                    alt="Personalised metabolic care"
                    fill
                    className="object-cover"
                    style={{ objectPosition: "50% 20%" }}
                    sizes="(min-width: 860px) 45vw, 440px"
                    priority
                  />
                </div>

                {/* Badge */}
                <div
                  className="absolute bottom-[34px] left-[-22px] flex max-w-[230px] items-center gap-3 rounded-[16px] border px-[1.1rem] py-[0.9rem]"
                  style={{
                    background: "var(--measured-cream)",
                    borderColor: "var(--measured-line)",
                    boxShadow: "0 18px 40px -18px rgba(16,38,25,.4)",
                  }}
                >
                  {/* Donut ring */}
                  <div
                    className="relative grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full"
                    style={{
                      background:
                        "conic-gradient(var(--measured-green) 0 72%, var(--measured-sand-deep) 0)",
                    }}
                  >
                    <div
                      className="absolute h-[28px] w-[28px] rounded-full"
                      style={{ background: "var(--measured-cream)" }}
                    />
                    <b
                      className="absolute z-10 text-[0.62rem] font-bold"
                      style={{ color: "var(--measured-green)" }}
                    >
                      72%
                    </b>
                  </div>
                  <p
                    className="text-[0.74rem] leading-[1.35]"
                    style={{ color: "var(--measured-subtext)" }}
                  >
                    <b
                      className="block text-[0.8rem]"
                      style={{ color: "var(--measured-ink)" }}
                    >
                      Members reach their goal
                    </b>
                    within the first program cycle.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            Credentials strip
            ══════════════════════════════════════════════════════ */}
        <div
          style={{
            background: "var(--measured-sand)",
            borderBlock: "1px solid var(--measured-line-soft)",
          }}
        >
          <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-center gap-[clamp(1.2rem,3vw,3rem)] px-[clamp(1.25rem,4vw,3rem)] py-[1.4rem]">
            {[
              "Board-certified physicians",
              "CGM-guided nutrition",
              "Bespoke recipes",
              "Telehealth check-ins",
            ].flatMap((cred, i, arr) => [
              <span
                key={cred}
                className="text-[0.78rem] font-medium uppercase tracking-[0.12em]"
                style={{ color: "var(--measured-subtext)" }}
              >
                {cred}
              </span>,
              ...(i < arr.length - 1
                ? [
                    <span
                      key={`sep-${i}`}
                      style={{ color: "var(--measured-gold-bright)" }}
                    >
                      ·
                    </span>,
                  ]
                : []),
            ])}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            Problem section
            ══════════════════════════════════════════════════════ */}
        <section
          className="py-[clamp(5rem,9vw,9rem)]"
          style={{ background: "var(--measured-sand)" }}
        >
          <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-start gap-[clamp(2rem,5vw,4.5rem)] px-[clamp(1.25rem,4vw,3rem)] md:grid-cols-[0.85fr_1.15fr]">
            <Reveal>
              <Eyebrow>Sound familiar?</Eyebrow>
              <h2
                className="mt-[1.4rem] font-serif font-medium leading-[1.04]"
                style={{
                  fontSize: "clamp(2.1rem, 4.2vw, 3.5rem)",
                  textWrap: "balance",
                }}
              >
                Why most metabolic care{" "}
                <em
                  style={{
                    fontStyle: "italic",
                    color: "var(--measured-green)",
                  }}
                >
                  falls short
                </em>
                .
              </h2>
              <p
                className="mt-[1.3rem] leading-[1.6]"
                style={{
                  fontSize: "clamp(1.05rem, 1.3vw, 1.22rem)",
                  color: "var(--measured-subtext)",
                }}
              >
                If you&rsquo;ve tried diets, workouts, and even medications
                without lasting results — it isn&rsquo;t a willpower problem.
                Most approaches treat the symptom and never ask what&rsquo;s
                driving it.
              </p>
              <p
                className="mt-[1.6rem] font-serif text-[1.3rem] italic leading-[1.4]"
                style={{ color: "var(--measured-green)" }}
              >
                We start with your biology, not a template.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-2 grid">
                {[
                  "Waiting weeks for an appointment, only to get ten rushed minutes with a doctor who's never met you.",
                  'Labs that come back "normal" while you still feel exhausted, foggy, and not quite like yourself.',
                  "Weight that won't move no matter how disciplined you are with food and training.",
                  "A care plan built on a protocol — not on your CGM data, your hormones, or how you actually live.",
                ].map((text, i, arr) => (
                  <div
                    key={i}
                    className="grid items-start gap-4 py-[1.25rem]"
                    style={{
                      gridTemplateColumns: "auto 1fr",
                      borderTop: "1px solid var(--measured-line)",
                      ...(i === arr.length - 1
                        ? { borderBottom: "1px solid var(--measured-line)" }
                        : {}),
                    }}
                  >
                    <span
                      className="mt-0.5 grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full border text-[0.9rem]"
                      style={{
                        borderColor: "var(--measured-line)",
                        color: "var(--measured-subtext)",
                      }}
                    >
                      ✕
                    </span>
                    <p
                      className="text-[1.02rem] leading-[1.5]"
                      style={{ color: "var(--measured-ink)" }}
                    >
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            Approach section
            ══════════════════════════════════════════════════════ */}
        <section
          id="approach"
          className="mx-auto max-w-[1180px] px-[clamp(1.25rem,4vw,3rem)] py-[clamp(5rem,9vw,9rem)]"
        >
          <div className="grid grid-cols-1 items-center gap-[clamp(2rem,5vw,5rem)] md:grid-cols-2">
            <Reveal>
              <div
                className="relative w-full overflow-hidden rounded-[20px]"
                style={{
                  aspectRatio: "0.92",
                  boxShadow: "0 26px 60px -30px rgba(16,38,25,.4)",
                }}
              >
                <Image
                  src="/images/hero/dietitian-consult.jpg"
                  alt="Doctor consultation"
                  fill
                  className="object-cover"
                  sizes="(min-width: 820px) 45vw, 100vw"
                />
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <Eyebrow>A different kind of practice</Eyebrow>
              <h2
                className="mt-[1.4rem] font-serif font-medium leading-[1.04]"
                style={{
                  fontSize: "clamp(2.1rem, 4.2vw, 3.5rem)",
                  textWrap: "balance",
                }}
              >
                A doctor who{" "}
                <em
                  style={{
                    fontStyle: "italic",
                    color: "var(--measured-green)",
                  }}
                >
                  actually knows you
                </em>
                .
              </h2>
              <p
                className="mt-[1.3rem] leading-[1.6]"
                style={{
                  fontSize: "clamp(1.05rem, 1.3vw, 1.22rem)",
                  color: "var(--measured-subtext)",
                }}
              >
                Your doctor works from one complete picture of your health —
                your CGM response, your labs, and the foods you enjoy — and
                personalises your plan at every step.
              </p>
              <p
                className="mt-[1.1rem] text-[1.02rem] leading-[1.5]"
                style={{ color: "var(--measured-subtext)" }}
              >
                This isn&rsquo;t a walk-in clinic or a standard primary-care
                office. We keep the panel small on purpose, so every plan is
                built around your biology and your life — and so the person
                reviewing your data already knows your story.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-[0.9rem]">
                <BtnPrimary href="#focus">What we treat →</BtnPrimary>
                <a
                  href="#how"
                  className="border-b pb-0.5 text-[0.92rem] font-semibold transition-colors hover:opacity-70"
                  style={{
                    color: "var(--measured-green)",
                    borderColor: "var(--measured-green)",
                  }}
                >
                  See how it works →
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            Focus — 4 pillars
            ══════════════════════════════════════════════════════ */}
        <section
          id="focus"
          className="mx-auto max-w-[1180px] px-[clamp(1.25rem,4vw,3rem)] py-[clamp(5rem,9vw,9rem)]"
        >
          <Reveal className="mb-[clamp(2.5rem,5vw,4rem)] max-w-[640px]">
            <Eyebrow>What we focus on</Eyebrow>
            <h2
              className="mt-[1.3rem] font-serif font-medium leading-[1.04]"
              style={{
                fontSize: "clamp(2.1rem, 4.2vw, 3.5rem)",
                textWrap: "balance",
              }}
            >
              Four pillars of a{" "}
              <em
                style={{ fontStyle: "italic", color: "var(--measured-green)" }}
              >
                measured
              </em>{" "}
              metabolism.
            </h2>
          </Reveal>

          <div
            className="grid grid-cols-1 gap-px overflow-hidden rounded-[18px] border sm:grid-cols-2"
            style={{
              background: "var(--measured-line-soft)",
              borderColor: "var(--measured-line-soft)",
            }}
          >
            {[
              {
                n: "01",
                title: "Precision, from your CGM",
                body: "A continuous glucose monitor shows exactly how your body responds to each meal — so your plan is built on your real data, not population averages.",
              },
              {
                n: "02",
                title: "Meals tuned to your response",
                body: "Your doctor reads your glucose response and adjusts your meals and recipes around it — turning spikes and crashes into a clear, personalised plan.",
              },
              {
                n: "03",
                title: "Bespoke recipes you’ll enjoy",
                body: "Your doctor gets to know what you genuinely like to eat and builds bespoke recipes around it — food you look forward to, not food you endure.",
              },
              {
                n: "04",
                title: "Coordinated with your clinician",
                body: "Every adjustment happens in coordination with your physician, so your nutrition, labs, hormones, and overall care all stay in sync.",
              },
            ].map(({ n, title, body }, i) => (
              <Reveal key={n} delay={i % 2 === 1 ? 0.08 : 0}>
                <div
                  className="flex h-full flex-col gap-[0.7rem] p-[clamp(1.8rem,3vw,2.6rem)] transition-colors hover:brightness-[1.02]"
                  style={{ background: "var(--measured-cream)" }}
                >
                  <div
                    className="font-serif text-[2.4rem] font-medium leading-none"
                    style={{
                      color: "var(--measured-gold-dark)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {n}
                  </div>
                  <h3
                    className="font-serif font-semibold leading-[1.12]"
                    style={{ fontSize: "clamp(1.4rem, 2vw, 1.85rem)" }}
                  >
                    {title}
                  </h3>
                  <p
                    className="text-[0.98rem] leading-[1.55]"
                    style={{ color: "var(--measured-subtext)" }}
                  >
                    {body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            How it works — steps
            ══════════════════════════════════════════════════════ */}
        <section
          id="how"
          className="py-[clamp(5rem,9vw,9rem)]"
          style={{ background: "var(--measured-sand)" }}
        >
          <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-[clamp(2rem,5vw,5rem)] px-[clamp(1.25rem,4vw,3rem)] md:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <div
                className="relative w-full overflow-hidden rounded-[20px]"
                style={{
                  aspectRatio: "0.86",
                  boxShadow: "0 26px 60px -30px rgba(16,38,25,.4)",
                  maxWidth: "460px",
                }}
              >
                <Image
                  src="/images/hero/phone-in-hand.jpg"
                  alt="Patient using the app"
                  fill
                  className="object-cover"
                  sizes="(min-width: 820px) 40vw, 460px"
                />
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <Eyebrow>How it works</Eyebrow>
              <h2
                className="mb-[2.4rem] mt-[1.3rem] font-serif font-medium leading-[1.04]"
                style={{
                  fontSize: "clamp(2.1rem, 4.2vw, 3.5rem)",
                  textWrap: "balance",
                }}
              >
                From first call to{" "}
                <em
                  style={{
                    fontStyle: "italic",
                    color: "var(--measured-green)",
                  }}
                >
                  lasting change
                </em>
                .
              </h2>

              <div className="grid">
                {[
                  {
                    n: "1",
                    title: "Free intro call",
                    body: "A 15-minute conversation to understand your goals and see if Measured is the right fit. No obligation.",
                  },
                  {
                    n: "2",
                    title: "Your first visit, in person",
                    body: "We start in person — advanced labs, body composition, and a continuous glucose monitor fitted — to build your full metabolic picture from day one.",
                  },
                  {
                    n: "3",
                    title: "Your personalised plan",
                    body: "Your doctor builds a plan around your CGM response, your labs, and the foods you actually enjoy. Not a template. Not a protocol.",
                  },
                  {
                    n: "4",
                    title: "Regular check-ins, your way",
                    body: "After your first visit, you’ll have regular check-ins with your doctor over telehealth — or in person whenever you prefer.",
                  },
                ].map(({ n, title, body }, i) => (
                  <div
                    key={n}
                    className="grid items-start gap-[1.4rem] py-[1.6rem]"
                    style={{
                      gridTemplateColumns: "auto 1fr",
                      borderTop:
                        i === 0 ? "none" : "1px solid var(--measured-line)",
                      paddingTop: i === 0 ? 0 : undefined,
                    }}
                  >
                    <span
                      className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full font-serif text-[1.05rem] font-semibold"
                      style={{
                        background: "var(--measured-green)",
                        color: "var(--measured-cream)",
                      }}
                    >
                      {n}
                    </span>
                    <div>
                      <h3 className="mb-[0.35rem] text-[1.2rem] font-semibold">
                        {title}
                      </h3>
                      <p
                        className="text-[0.98rem] leading-[1.55]"
                        style={{ color: "var(--measured-subtext)" }}
                      >
                        {body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            Program timeline
            ══════════════════════════════════════════════════════ */}
        <section
          id="program"
          className="py-[clamp(5rem,9vw,9rem)]"
          style={{ background: "var(--measured-sand)" }}
        >
          <div className="mx-auto max-w-[1180px] px-[clamp(1.25rem,4vw,3rem)]">
            <Reveal className="mb-[clamp(2.5rem,5vw,3.6rem)] max-w-[640px]">
              <Eyebrow>The Health Optimisation Protocol</Eyebrow>
              <h2
                className="mt-[1.3rem] font-serif font-medium leading-[1.04]"
                style={{
                  fontSize: "clamp(2.1rem, 4.2vw, 3.5rem)",
                  textWrap: "balance",
                }}
              >
                Your six months,{" "}
                <em
                  style={{
                    fontStyle: "italic",
                    color: "var(--measured-green)",
                  }}
                >
                  step by step
                </em>
                .
              </h2>
              <p
                className="mt-[1.3rem] leading-[1.6]"
                style={{
                  fontSize: "clamp(1.05rem, 1.3vw, 1.22rem)",
                  color: "var(--measured-subtext)",
                }}
              >
                A structured, physician-led program built on continuous data —
                not guesswork. Here&rsquo;s exactly what you experience, from
                baseline to before-and-after.
              </p>
            </Reveal>

            {/* Timeline */}
            <div className="relative max-w-[770px]">
              {/* Vertical line */}
              <div
                className="absolute bottom-[18px] left-[23px] top-[18px] w-[2px] opacity-45"
                style={{
                  background:
                    "linear-gradient(var(--measured-green), var(--measured-gold-bright))",
                }}
              />

              {/* Start cap */}
              <Reveal>
                <div className="relative flex items-center gap-[1.1rem] py-1">
                  <div
                    className="z-10 ml-[17px] h-[14px] w-[14px] shrink-0 rounded-full"
                    style={{
                      background: "var(--measured-green)",
                      boxShadow: "0 0 0 5px rgba(45, 90, 61, 0.16)",
                    }}
                  />
                  <span
                    className="text-[0.74rem] font-semibold uppercase tracking-[0.08em]"
                    style={{ color: "var(--measured-subtext)" }}
                  >
                    Month 0 · You begin
                  </span>
                </div>
              </Reveal>

              {/* Items */}
              {[
                {
                  n: "01",
                  when: "Ongoing · 6 months",
                  title: "CGM-monitored GLP-1 therapy",
                  body: "Six months of clinically guided GLP-1 receptor agonist therapy, titrated to your response with continuous glucose monitoring at every step.",
                },
                {
                  n: "02",
                  when: "Throughout",
                  title: "Personalised meal planning",
                  body: "Your doctor builds a plan around your cuisine, preferences, and metabolic targets — with recipes adapted specifically for you.",
                },
                {
                  n: "03",
                  when: "Baseline & completion",
                  title: "DEXA body composition",
                  body: "Baseline and completion DEXA scans measure fat mass, lean mass, and visceral fat — giving you objective before-and-after data.",
                },
              ].map(({ n, when, title, body }, i) => (
                <Reveal key={n} delay={i * 0.08}>
                  <div
                    className="relative grid items-start py-[1.1rem]"
                    style={{ gridTemplateColumns: "48px 1fr", gap: "1.3rem" }}
                  >
                    <div
                      className="relative z-10 grid h-[48px] w-[48px] place-items-center rounded-full border font-serif text-[1.25rem] font-semibold"
                      style={{
                        background: "var(--measured-cream)",
                        borderColor: "var(--measured-line)",
                        color: "var(--measured-green)",
                        boxShadow: "var(--shadow-card)",
                      }}
                    >
                      {n}
                    </div>
                    <div
                      className="rounded-[16px] border px-[1.7rem] py-[1.4rem] transition-transform hover:-translate-y-0.5"
                      style={{
                        background: "var(--measured-cream)",
                        borderColor: "var(--measured-line-soft)",
                        boxShadow: "var(--shadow-card)",
                      }}
                    >
                      <div className="mb-[0.55rem]">
                        <span
                          className="text-[0.66rem] font-bold uppercase tracking-[0.13em]"
                          style={{ color: "var(--measured-gold-dark)" }}
                        >
                          {when}
                        </span>
                      </div>
                      <h3
                        className="font-serif font-semibold leading-[1.12]"
                        style={{ fontSize: "clamp(1.15rem, 1.8vw, 1.5rem)" }}
                      >
                        {title}
                      </h3>
                      <p
                        className="mt-2 text-[1rem] leading-[1.55]"
                        style={{ color: "var(--measured-subtext)" }}
                      >
                        {body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}

              {/* End cap */}
              <Reveal>
                <div className="relative flex items-center gap-[1.1rem] py-1">
                  <div
                    className="z-10 ml-[17px] h-[14px] w-[14px] shrink-0 rounded-full"
                    style={{
                      background: "var(--measured-gold-dark)",
                      boxShadow: "0 0 0 5px rgba(154, 122, 44, 0.18)",
                    }}
                  />
                  <span
                    className="text-[0.74rem] font-semibold uppercase tracking-[0.08em]"
                    style={{ color: "var(--measured-subtext)" }}
                  >
                    Month 6 · Your before-and-after results
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            Your doctor
            ══════════════════════════════════════════════════════ */}
        <section id="doctor" className="py-[clamp(5rem,9vw,9rem)]">
          <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-[clamp(2rem,5vw,4.5rem)] px-[clamp(1.25rem,4vw,3rem)] md:grid-cols-[0.85fr_1.15fr]">
            <Reveal className="relative">
              <div className="relative max-w-[420px]">
                <div
                  className="relative w-full overflow-hidden rounded-[20px]"
                  style={{
                    aspectRatio: "0.84",
                    boxShadow: "0 26px 60px -30px rgba(16,38,25,.4)",
                  }}
                >
                  <Image
                    src="/images/dr-saxena.jpeg"
                    alt="Dr Anubhav Saxena"
                    fill
                    className="object-cover"
                    style={{ objectPosition: "50% 15%" }}
                    sizes="(min-width: 820px) 35vw, 420px"
                    priority
                  />
                </div>
                {/* Name card */}
                <div
                  className="absolute bottom-[26px] left-[-16px] rounded-[14px] border px-[1.15rem] py-[0.8rem]"
                  style={{
                    background: "var(--measured-cream)",
                    borderColor: "var(--measured-line)",
                    boxShadow: "0 18px 40px -18px rgba(16,38,25,.4)",
                  }}
                >
                  <b className="block font-serif text-[1.1rem] font-semibold leading-[1.1]">
                    Dr Anubhav Saxena
                  </b>
                  <span
                    className="text-[0.74rem]"
                    style={{ color: "var(--measured-subtext)" }}
                  >
                    Your doctor
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <Eyebrow>Your doctor</Eyebrow>
              <h2
                className="mt-[1.1rem] font-serif font-medium leading-[1.04]"
                style={{
                  fontSize: "clamp(2.1rem, 4.2vw, 3.5rem)",
                  textWrap: "balance",
                }}
              >
                Dr Anubhav Saxena
              </h2>
              <div className="mt-[1.3rem] flex flex-wrap gap-2">
                {["MBBS", "FRACGP", "MPhil"].map((c) => (
                  <span
                    key={c}
                    className="rounded-full border px-[0.85rem] py-[0.38rem] text-[0.7rem] font-semibold uppercase tracking-[0.08em]"
                    style={{
                      color: "var(--measured-green)",
                      borderColor: "var(--measured-line)",
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
              <p
                className="mt-[1.2rem] leading-[1.6]"
                style={{
                  fontSize: "clamp(1.05rem, 1.3vw, 1.22rem)",
                  color: "var(--measured-subtext)",
                }}
              >
                Fellow of the Royal Australian College of General Practitioners
                with a research background in metabolic medicine. Dr Saxena
                designed the Health Optimisation Protocol to give patients a
                structured, evidence-based path to lasting weight and metabolic
                improvement.
              </p>
              <div className="mt-[1.9rem]">
                <BtnPrimary href={BOOKING_URL} external>
                  Book with Dr Saxena →
                </BtnPrimary>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            Testimonials
            ══════════════════════════════════════════════════════ */}
        <section className="py-[clamp(5rem,9vw,9rem)]">
          <div className="mx-auto max-w-[1180px] px-[clamp(1.25rem,4vw,3rem)]">
            <Reveal className="mb-[clamp(2.5rem,5vw,3.8rem)] text-center">
              <div className="flex justify-center">
                <Eyebrow center noRule>
                  Patient stories
                </Eyebrow>
              </div>
              <h2
                className="mt-[1.2rem] font-serif font-medium leading-[1.04]"
                style={{
                  fontSize: "clamp(2.1rem, 4.2vw, 3.5rem)",
                  textWrap: "balance",
                }}
              >
                Care that people{" "}
                <em
                  style={{
                    fontStyle: "italic",
                    color: "var(--measured-green)",
                  }}
                >
                  actually feel
                </em>
                .
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 gap-[1.4rem] md:grid-cols-3">
              {[
                {
                  quote:
                    "Measured advice and a genuinely personable team. The most practical, down-to-earth way I've ever worked with a doctor's office.",
                  name: "D. E.",
                  detail: "Patient since 2024",
                  ini: "DE",
                },
                {
                  quote:
                    "For the first time, my labs and how I actually feel were finally connected. I understand my own body now.",
                  name: "S. F.",
                  detail: "Metabolic program",
                  ini: "SF",
                },
                {
                  quote:
                    "From the first visit they knew my name and my history. Knowledgeable, personable, and always reachable.",
                  name: "A. W-S.",
                  detail: "Protocol patient",
                  ini: "AW",
                },
              ].map(({ quote, name, detail, ini }, i) => (
                <Reveal key={ini} delay={i * 0.08}>
                  <figure
                    className="flex h-full flex-col rounded-[18px] border p-8"
                    style={{
                      background: "var(--measured-cream)",
                      borderColor: "var(--measured-line-soft)",
                    }}
                  >
                    <div
                      className="mb-[1.1rem] text-[0.85rem] tracking-[0.18em]"
                      style={{ color: "var(--measured-gold-bright)" }}
                    >
                      ★★★★★
                    </div>
                    <blockquote
                      className="flex-1 font-serif text-[1.28rem] italic leading-[1.42]"
                      style={{ color: "var(--measured-ink)" }}
                    >
                      &ldquo;{quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-[1.6rem] flex items-center gap-3">
                      <span
                        className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full text-[0.78rem] font-bold"
                        style={{
                          background: "var(--measured-sand-deep)",
                          color: "var(--measured-green)",
                        }}
                      >
                        {ini}
                      </span>
                      <span
                        className="text-[0.82rem]"
                        style={{ color: "var(--measured-subtext)" }}
                      >
                        <b
                          className="block text-[0.88rem] font-semibold"
                          style={{ color: "var(--measured-ink)" }}
                        >
                          {name}
                        </b>
                        {detail}
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            FAQ
            ══════════════════════════════════════════════════════ */}
        <section
          id="faq"
          className="mx-auto max-w-[1180px] px-[clamp(1.25rem,4vw,3rem)] py-[clamp(5rem,9vw,9rem)]"
        >
          <div className="grid grid-cols-1 items-start gap-[clamp(2rem,5vw,4rem)] md:grid-cols-[0.7fr_1.3fr]">
            <Reveal>
              <Eyebrow>FAQ</Eyebrow>
              <h2
                className="mt-[1.2rem] font-serif font-medium leading-[1.04]"
                style={{
                  fontSize: "clamp(2.1rem, 4.2vw, 3.5rem)",
                  textWrap: "balance",
                }}
              >
                Questions, answered.
              </h2>
              <p
                className="mt-[1.2rem] leading-[1.6]"
                style={{
                  fontSize: "clamp(1.05rem, 1.3vw, 1.22rem)",
                  color: "var(--measured-subtext)",
                }}
              >
                Still unsure if Measured is right for you? The intro call is the
                easiest way to find out.
              </p>
              <div className="mt-[1.8rem]">
                <BtnPrimary href={BOOKING_URL} external>
                  Book a call →
                </BtnPrimary>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div style={{ borderTop: "1px solid var(--measured-line)" }}>
                {[
                  {
                    q: "How is Measured different from standard care?",
                    a: "Every plan is built around the individual — your CGM response, your labs, and the foods you actually enjoy. Your doctor knows your history before you arrive, builds and adjusts every plan personally, and there are no rushed, ten-minute visits or rotating providers.",
                  },
                  {
                    q: "How do the CGM and meal personalisation work together?",
                    a: "Your continuous glucose monitor shows how your body responds to each meal. Your doctor uses that data to adjust your meals and craft bespoke recipes around foods you like.",
                  },
                  {
                    q: "What does the program involve?",
                    a: "The Health Optimisation Protocol is a six-month, physician-led program: CGM-monitored GLP-1 therapy titrated to your response, personalised meal planning built by your doctor, and baseline and completion DEXA scans for objective before-and-after data.",
                  },
                  {
                    q: "Do I have to come into the office?",
                    a: "Your first visit is in person, so we can run your labs, fit your CGM, and complete your baseline DEXA. After that, regular check-ins happen over telehealth — or in person whenever you'd prefer.",
                  },
                  {
                    q: "Will the food actually be enjoyable?",
                    a: "That’s the point. Your doctor builds your plan around your cuisine and preferences and creates bespoke recipes tuned to your CGM response — so it’s food you look forward to that also moves your numbers.",
                  },
                  {
                    q: "How closely will my doctor follow my progress?",
                    a: "Closely. You stay in regular contact with your doctor throughout the six months, and as your CGM and labs change, your therapy and meals are adjusted — not left until the next quarterly visit.",
                  },
                ].map(({ q, a }) => (
                  <FaqEntry key={q} q={q} a={a} />
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            Contact form
            ══════════════════════════════════════════════════════ */}
        <ContactForm />

        {/* ══════════════════════════════════════════════════════
            Final CTA
            ══════════════════════════════════════════════════════ */}
        <section
          id="start"
          className="py-[clamp(5rem,10vw,9rem)] text-center"
          style={{
            background: "var(--measured-green-deep)",
            color: "var(--measured-cream)",
          }}
        >
          <div className="mx-auto max-w-[1180px] px-[clamp(1.25rem,4vw,3rem)]">
            <Reveal>
              <div className="flex justify-center">
                <Eyebrow center bright noRule>
                  Limited availability
                </Eyebrow>
              </div>
              <h2
                className="mx-auto mt-[1.4rem] font-serif font-medium leading-[1.04]"
                style={{
                  fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
                  color: "var(--measured-cream)",
                  textWrap: "balance",
                }}
              >
                Care the way{" "}
                <em
                  style={{
                    fontStyle: "italic",
                    color: "var(--measured-gold-bright)",
                  }}
                >
                  it should be
                </em>
                .
              </h2>
              <p
                className="mx-auto mt-[1.5rem] max-w-[34em] leading-[1.6]"
                style={{
                  fontSize: "clamp(1.05rem, 1.3vw, 1.22rem)",
                  color: "rgba(250,249,246,.72)",
                }}
              >
                We take on a limited number of patients so every plan gets the
                attention — and the coordination — it deserves. Start with a
                free, no-obligation call.
              </p>
              <div className="mt-[2.6rem] flex flex-wrap items-center justify-center gap-[0.9rem]">
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-[1.6rem] py-[0.95rem] text-[0.92rem] font-semibold tracking-[0.01em] transition-all hover:-translate-y-0.5 hover:brightness-[1.04]"
                  style={{
                    background: "var(--measured-cream)",
                    color: "var(--measured-green-deep)",
                  }}
                >
                  Book your free intro call →
                </a>
                <a
                  href="#how"
                  className="inline-flex items-center gap-2 rounded-full border px-[1.6rem] py-[0.95rem] text-[0.92rem] font-semibold tracking-[0.01em] transition-all hover:-translate-y-0.5"
                  style={{
                    borderColor: "rgba(250,249,246,.32)",
                    color: "var(--measured-cream)",
                  }}
                >
                  See how it works
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ══════════════════════════════════════════════════════
          Footer
          ══════════════════════════════════════════════════════ */}
      <footer
        className="py-[clamp(3.5rem,6vw,5rem)]"
        style={{
          background: "var(--measured-ink)",
          color: "rgba(250,249,246,.62)",
        }}
      >
        <div className="mx-auto max-w-[1180px] px-[clamp(1.25rem,4vw,3rem)]">
          <div
            className="grid grid-cols-1 gap-8 pb-12 sm:grid-cols-3"
            style={{ borderBottom: "1px solid rgba(250,249,246,.1)" }}
          >
            <div>
              <span
                className="font-serif text-[1.4rem] font-semibold leading-none tracking-tight"
                style={{ color: "var(--measured-cream)" }}
              >
                Measured
                <span style={{ color: "var(--measured-gold-dark)" }}>.</span>
              </span>
              <p
                className="mt-4 text-[0.92rem] leading-[1.6]"
                style={{
                  maxWidth: "30ch",
                  color: "rgba(250,249,246,.62)",
                }}
              >
                Concierge metabolic care — CGM-guided nutrition, bespoke
                recipes, and a doctor who personalises every step.
              </p>
            </div>

            <div>
              <h4
                className="mb-[1.1rem] text-[0.7rem] font-semibold uppercase tracking-[0.14em]"
                style={{ color: "rgba(250,249,246,.45)" }}
              >
                Practice
              </h4>
              {[
                { href: "#approach", label: "Our approach" },
                { href: "#focus", label: "What we treat" },
                { href: "#program", label: "The Program" },
                { href: "#doctor", label: "Your doctor" },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="mb-[0.6rem] block text-[0.9rem] transition-colors hover:text-[var(--measured-cream)]"
                  style={{ color: "rgba(250,249,246,.62)" }}
                >
                  {label}
                </a>
              ))}
            </div>

            <div>
              <h4
                className="mb-[1.1rem] text-[0.7rem] font-semibold uppercase tracking-[0.14em]"
                style={{ color: "rgba(250,249,246,.45)" }}
              >
                Get started
              </h4>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-[0.6rem] block text-[0.9rem] transition-colors hover:text-[var(--measured-cream)]"
                style={{ color: "rgba(250,249,246,.62)" }}
              >
                Book intro call
              </a>
              <a
                href="#how"
                className="mb-[0.6rem] block text-[0.9rem] transition-colors hover:text-[var(--measured-cream)]"
                style={{ color: "rgba(250,249,246,.62)" }}
              >
                How it works
              </a>
              <a
                href="#faq"
                className="mb-[0.6rem] block text-[0.9rem] transition-colors hover:text-[var(--measured-cream)]"
                style={{ color: "rgba(250,249,246,.62)" }}
              >
                FAQ
              </a>
              <a
                href="#contact"
                className="mb-[0.6rem] block text-[0.9rem] transition-colors hover:text-[var(--measured-cream)]"
                style={{ color: "rgba(250,249,246,.62)" }}
              >
                Contact
              </a>
            </div>
          </div>

          <div
            className="flex flex-wrap items-center justify-between gap-4 pt-8 text-[0.8rem]"
            style={{ color: "rgba(250,249,246,.45)" }}
          >
            <span>
              © {new Date().getFullYear()} Measured Metabolics · Concierge
              metabolic care
            </span>
            <div className="flex gap-[1.4rem]">
              <Link
                href="/demo"
                className="transition-colors hover:text-[var(--measured-cream)]"
              >
                Platform demo
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
