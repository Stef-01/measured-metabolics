import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeUp } from "./fade-up";
import { StaggerGroup, StaggerItem } from "./stagger-group";
import { MobileBookingBar } from "./mobile-booking-bar";

const BOOKING_URL =
  "https://healthengine.com.au/doctor/nsw/beecroft/dr-anubhav-saxena/p123180";

// ── Protocol data ─────────────────────────────────────────────────────────────

const PROTOCOL = [
  {
    n: "01",
    title: "CGM monitored GLP-1 therapy",
    body: "Six months of clinically guided GLP-1 receptor agonist therapy, titrated to your response with continuous glucose monitoring at every step.",
    photo: "/images/protocol/cgm.jpg",
  },
  {
    n: "02",
    title: "Personalised meal planning",
    body: "Your dietitian builds a plan around your cuisine, preferences, and metabolic targets — with recipes adapted specifically for you.",
    photo: "/images/protocol/meal-bowl.jpg",
  },
  {
    n: "03",
    title: "DEXA body composition",
    body: "Baseline and completion DEXA scans measure fat mass, lean mass, and visceral fat — giving you objective before-and-after data.",
    photo: "/images/protocol/dexa.jpg",
  },
];

// ── Testimonials ──────────────────────────────────────────────────────────────
// Replace with verified patient-approved quotes before launch.

const TESTIMONIALS = [
  {
    quote:
      "The combination of regular monitoring and having a dietitian adjust my plan made a difference I hadn't found anywhere else. It felt clinical without being cold.",
    name: "Sarah M.",
    detail: "Lost 10 kg · 6 months",
  },
  {
    quote:
      "Getting the DEXA scan at the start and end made the results real — I could see exactly where the fat mass had shifted. That data matters to me.",
    name: "James T.",
    detail: "Lost 13 kg · 6 months",
  },
  {
    quote:
      "I'd tried other programmes. This one was different because Dr Saxena actually adjusted the medication based on my CGM data, not just a standard schedule.",
    name: "Priya K.",
    detail: "Lost 9 kg · 6 months",
  },
];

// ── FAQ ───────────────────────────────────────────────────────────────────────

const FAQ = [
  {
    q: "Which GLP-1 medication is used?",
    a: "Dr Saxena prescribes semaglutide (Wegovy or Ozempic) or liraglutide (Saxenda) depending on your clinical profile, PBS eligibility, and response. Medication choice is made at your initial consultation and reviewed at every appointment.",
  },
  {
    q: "Is this covered by Medicare?",
    a: "Initial and follow-up GP consultations are eligible for Medicare rebates under chronic disease management items. The DEXA scan and dietitian sessions attract separate Medicare or private health rebates depending on your cover. Full cost transparency is provided at consultation.",
  },
  {
    q: "Do I need to come in person, or is this telehealth?",
    a: "Initial consultation and DEXA scans are conducted in person at the Beecroft practice. Subsequent GLP-1 review appointments can be conducted via telehealth where clinically appropriate.",
  },
  {
    q: "What does the DEXA scan involve?",
    a: "A DEXA scan takes approximately 10 minutes lying still on a flat table. Low-dose X-ray beams measure fat mass, lean mass, and bone density across the whole body. No preparation is required and there is no discomfort.",
  },
  {
    q: "How is this different from getting Ozempic from my usual GP?",
    a: "This programme combines GLP-1 therapy with continuous glucose monitoring to titrate dosing precisely, baseline and completion DEXA scans to track body composition rather than just weight, and a personalised dietitian meal plan. The monitoring infrastructure is what produces different outcomes.",
  },
  {
    q: "Can I join if I have Type 2 diabetes?",
    a: "Yes. GLP-1 therapy is indicated for both weight management and glycaemic control in Type 2 diabetes. Dr Saxena will review your current medications and adjust the protocol accordingly.",
  },
  {
    q: "What happens after six months?",
    a: "The programme concludes with a final DEXA scan and dietitian review. Dr Saxena provides a written clinical summary and a maintenance plan. Continuation of GLP-1 therapy beyond six months is assessed based on your response and goals.",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export function DoctorLanding() {
  return (
    <main className="min-h-dvh bg-white pb-20 text-[var(--measured-dark)] md:pb-0">
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

      {/* ── Hero — dark typographic panel ─────────────── */}
      <section
        className="bg-[var(--measured-dark)]"
        style={{
          background:
            "radial-gradient(ellipse at 78% 18%, #1d3428 0%, #0A0A08 58%)",
        }}
      >
        <div className="mx-auto max-w-5xl px-6 pt-20 pb-28 md:pt-40 md:pb-44">
          <p className="hero-el hero-el-1 mb-8 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Health Optimisation Protocol&nbsp;·&nbsp;Beecroft NSW
          </p>
          <h1 className="hero-el hero-el-2 font-serif text-[40px] font-normal leading-[1.06] tracking-tight text-white sm:text-[56px] md:text-[88px] md:leading-[1.02]">
            A structured path
            <br />
            <span className="font-light italic opacity-75">
              to metabolic health.
            </span>
          </h1>
          <p className="hero-el hero-el-3 mt-8 max-w-[480px] text-[17px] leading-relaxed text-white/50">
            A medically supervised six-month program combining GLP-1 therapy,
            DEXA body composition scanning, and personalised dietitian support.
          </p>
          <div className="hero-el hero-el-4 mt-12 flex items-center gap-6">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-[15px] font-semibold text-[var(--measured-dark-green)] transition-all hover:bg-[var(--measured-cream)] active:scale-[0.97]"
            >
              Book a consultation
              <ArrowRight size={15} strokeWidth={2.4} aria-hidden="true" />
            </a>
            <a
              href="#protocol"
              className="text-[13px] text-white/40 transition-colors hover:text-white/70"
            >
              See how it works ↓
            </a>
          </div>
        </div>
      </section>

      {/* ── Outcomes strip ───────────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 divide-y divide-[var(--measured-border-soft)] py-12 md:grid-cols-3 md:divide-x md:divide-y-0 md:py-16">
            {[
              { stat: "Six months", label: "Complete supervised programme" },
              {
                stat: "GLP-1 · DEXA · Dietitian",
                label: "Three integrated components",
              },
              {
                stat: "Medicare rebate",
                label: "Available on GP consultations",
              },
            ].map(({ stat, label }) => (
              <div
                key={stat}
                className="px-0 py-7 text-center md:px-8 md:py-0 md:first:pl-0 md:last:pr-0"
              >
                <p className="font-serif text-[20px] font-normal leading-tight tracking-tight text-[var(--measured-dark)] md:text-[24px]">
                  {stat}
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.1em] text-[var(--measured-subtext)]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Protocol ─────────────────────────────────── */}
      <section id="protocol" className="bg-[var(--measured-sand)]">
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
          <FadeUp>
            <div className="mb-16">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--measured-subtext)]">
                What&apos;s included
              </p>
              <h2 className="font-serif text-[42px] leading-tight tracking-tight text-[var(--measured-dark)]">
                The protocol
              </h2>
              <p className="mt-3 max-w-[400px] text-[15px] text-[var(--measured-subtext)]">
                Three integrated components, coordinated over six months.
              </p>
            </div>
          </FadeUp>

          <StaggerGroup className="grid gap-14 md:grid-cols-3 md:gap-10">
            {PROTOCOL.map((step) => (
              <StaggerItem key={step.n}>
                <div className="relative overflow-hidden">
                  {/* Greyscale photo bleeds in from the right */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-0 top-0 bottom-0 w-[72%]"
                    style={{
                      maskImage:
                        "linear-gradient(to right, transparent 0%, black 50%)",
                      WebkitMaskImage:
                        "linear-gradient(to right, transparent 0%, black 50%)",
                    }}
                  >
                    <Image
                      src={step.photo}
                      alt=""
                      fill
                      className="object-cover"
                      style={{
                        filter: "grayscale(1)",
                        opacity: 0.2,
                        mixBlendMode: "multiply",
                      }}
                      sizes="(min-width: 768px) 220px, 70vw"
                    />
                  </div>

                  {/* Text */}
                  <div className="relative">
                    <div className="mb-6 h-px w-8 bg-[var(--measured-green)]" />
                    <div
                      aria-hidden="true"
                      className="font-serif text-[88px] leading-none text-[var(--measured-green)]/10"
                    >
                      {step.n}
                    </div>
                    <h3 className="mt-6 font-serif text-[26px] leading-tight text-[var(--measured-dark)]">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-[var(--measured-subtext)]">
                      {step.body}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ── Doctor ───────────────────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
          <FadeUp>
            <div className="flex flex-col gap-14 md:flex-row md:items-start md:gap-20">
              {/* Portrait */}
              <div className="shrink-0">
                <div className="relative h-[280px] w-full overflow-hidden rounded-2xl bg-[var(--measured-sand)] shadow-[0_8px_48px_-8px_rgba(0,0,0,0.14)] md:h-[400px] md:w-[300px]">
                  <Image
                    src="/images/dr-saxena.jpeg"
                    alt="Dr Anubhav Saxena"
                    fill
                    className="object-cover object-top"
                    sizes="(min-width: 768px) 300px, 100vw"
                    priority
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="flex flex-col justify-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--measured-subtext)]">
                  Your doctor
                </p>
                <h2 className="mt-5 font-serif text-[40px] leading-tight tracking-tight text-[var(--measured-dark)]">
                  Dr Anubhav Saxena
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["MBBS", "FRACGP", "MPhil"].map((c) => (
                    <span
                      key={c}
                      className="rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-[var(--measured-green)] ring-1 ring-[var(--measured-green)]/25"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <p className="mt-7 max-w-[440px] text-[16px] leading-[1.75] text-[var(--measured-subtext)]">
                  Fellow of the Royal Australian College of General
                  Practitioners with a research background in metabolic
                  medicine. Dr Saxena designed the Health Optimisation Protocol
                  to give patients a structured, evidence-based path to lasting
                  weight and metabolic improvement.
                </p>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--measured-dark-green)] transition-opacity hover:opacity-70"
                >
                  Book with Dr Saxena
                  <ArrowRight size={14} strokeWidth={2.4} aria-hidden="true" />
                </a>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────── */}
      {/* Replace placeholder quotes with verified patient-approved content before launch */}
      <section className="bg-[var(--measured-sand)]">
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
          <FadeUp>
            <p className="mb-12 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--measured-subtext)]">
              Patient outcomes
            </p>
          </FadeUp>

          <StaggerGroup className="grid gap-10 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <StaggerItem key={t.name}>
                <figure className="border-l-2 border-[var(--measured-green)] pl-6">
                  <blockquote>
                    <p className="font-serif text-[20px] italic leading-[1.55] text-[var(--measured-dark)]">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </blockquote>
                  <figcaption className="mt-4 text-[13px] text-[var(--measured-subtext)]">
                    — {t.name}&ensp;·&ensp;{t.detail}
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
          <FadeUp>
            <div className="mb-12">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--measured-subtext)]">
                Common questions
              </p>
              <h2 className="font-serif text-[38px] leading-tight tracking-tight text-[var(--measured-dark)]">
                What to expect
              </h2>
            </div>
          </FadeUp>

          <div className="divide-y divide-[var(--measured-border-soft)]">
            {FAQ.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex items-start justify-between gap-6 text-[16px] font-medium text-[var(--measured-dark)]">
                  <span>{item.q}</span>
                  <span
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-[var(--measured-subtext)] transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="faq-body">
                  <div>
                    <p className="pt-4 pb-1 text-[15px] leading-relaxed text-[var(--measured-subtext)]">
                      {item.a}
                    </p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA band ─────────────────────────────────── */}
      <section className="bg-[var(--measured-green)]">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center md:py-28">
          <h2 className="font-serif text-[44px] leading-tight tracking-tight text-white md:text-[52px]">
            Start your programme.
          </h2>
          <div className="mt-10">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-[15px] font-semibold text-[var(--measured-dark-green)] shadow-[0_2px_24px_-4px_rgba(0,0,0,0.22)] transition-all hover:bg-[var(--measured-cream)] active:scale-[0.97]"
            >
              Book via HealthEngine
              <ArrowRight size={15} strokeWidth={2.4} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <MobileBookingBar url={BOOKING_URL} />

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
