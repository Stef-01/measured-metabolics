import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { FadeUp } from "./fade-up";
import { StaggerGroup, StaggerItem } from "./stagger-group";
import { MobileBookingBar } from "./mobile-booking-bar";
import { HeroSection } from "./hero-section";
import { CtaBand } from "./cta-band";
import { BookNowButton } from "./book-now-button";

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
    initial: "S",
  },
  {
    quote:
      "Getting the DEXA scan at the start and end made the results real — I could see exactly where the fat mass had shifted. That data matters to me.",
    name: "James T.",
    detail: "Lost 13 kg · 6 months",
    initial: "J",
  },
  {
    quote:
      "I'd tried other programmes. This one was different because Dr Saxena actually adjusted the medication based on my CGM data, not just a standard schedule.",
    name: "Priya K.",
    detail: "Lost 9 kg · 6 months",
    initial: "P",
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
          <nav className="hidden items-center gap-7 md:flex">
            <a
              href="#protocol"
              className="text-[13px] font-medium text-[var(--measured-subtext)] transition-colors hover:text-[var(--measured-dark)]"
            >
              How it works
            </a>
            <a
              href="#faq"
              className="text-[13px] font-medium text-[var(--measured-subtext)] transition-colors hover:text-[var(--measured-dark)]"
            >
              FAQ
            </a>
          </nav>
          <BookNowButton url={BOOKING_URL} />
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────── */}
      <HeroSection bookingUrl={BOOKING_URL} />

      {/* ── Outcomes strip ───────────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6">
          <StaggerGroup className="grid grid-cols-1 divide-y divide-[var(--measured-border-soft)] py-12 md:grid-cols-3 md:divide-x md:divide-y-0 md:py-16">
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
              <StaggerItem
                key={stat}
                className="px-0 py-7 text-center md:px-8 md:py-0 md:first:pl-0 md:last:pr-0"
              >
                <p className="font-serif text-[20px] font-normal leading-tight tracking-tight text-[var(--measured-dark)] md:text-[24px]">
                  {stat}
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.1em] text-[var(--measured-subtext)]">
                  {label}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
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

          <StaggerGroup className="grid gap-6 md:grid-cols-3">
            {PROTOCOL.map((step) => (
              <StaggerItem key={step.n} hover>
                {/* Card with surface — hover lift makes sense here */}
                <div className="overflow-hidden rounded-2xl border border-[var(--measured-border-soft)] bg-white shadow-[var(--shadow-card)]">
                  {/* Image thumbnail */}
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={step.photo}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      sizes="(min-width: 768px) 320px, 100vw"
                    />
                    {/* Step number overlay */}
                    <div className="absolute right-4 top-4 font-serif text-[52px] leading-none text-white/20 select-none">
                      {step.n}
                    </div>
                    {/* Gradient fade */}
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(255,255,255,0.15) 0%, transparent 60%)",
                      }}
                    />
                  </div>

                  {/* Card content */}
                  <div className="p-6">
                    <div className="mb-4 h-px w-8 bg-[var(--measured-green)]" />
                    <h3 className="font-serif text-[22px] leading-tight text-[var(--measured-dark)]">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-[var(--measured-subtext)]">
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
              {/* Portrait with decorative depth */}
              <div className="relative shrink-0">
                {/* Decorative offset background */}
                <div
                  aria-hidden="true"
                  className="absolute -bottom-3 -right-3 h-full w-full rounded-2xl bg-[var(--measured-green)]/8"
                />
                <div className="relative h-[280px] w-full overflow-hidden rounded-2xl shadow-[0_8px_48px_-8px_rgba(0,0,0,0.14)] md:h-[400px] md:w-[300px]">
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
                      className="rounded-md bg-[var(--measured-green)]/8 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--measured-dark-green)] ring-1 ring-[var(--measured-green)]/20"
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
                  <ChevronDown
                    size={14}
                    strokeWidth={2.4}
                    className="-rotate-90"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────── */}
      <section className="bg-[var(--measured-sand)]">
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
          <FadeUp>
            <div className="mb-12">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--measured-subtext)]">
                Patient outcomes
              </p>
              <h2 className="font-serif text-[38px] leading-tight tracking-tight text-[var(--measured-dark)]">
                Real results, real patients.
              </h2>
            </div>
          </FadeUp>

          <StaggerGroup className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <StaggerItem key={t.name} direction="right">
                <figure className="flex h-full flex-col rounded-2xl border border-[var(--measured-border-soft)] bg-white p-7 shadow-[var(--shadow-card)]">
                  {/* Stars */}
                  <div className="mb-4 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className="text-[14px] text-[var(--measured-gold)]"
                        aria-hidden="true"
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <blockquote className="flex-1">
                    <p className="font-serif text-[18px] italic leading-[1.6] text-[var(--measured-dark)]">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </blockquote>

                  <figcaption className="mt-6 flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--measured-green)]/10 text-[11px] font-bold text-[var(--measured-dark-green)]">
                      {t.initial}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[var(--measured-dark)]">
                        {t.name}
                      </p>
                      <p className="text-[12px] text-[var(--measured-green)]">
                        {t.detail}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section id="faq" className="bg-white">
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
                <summary className="flex cursor-pointer items-start justify-between gap-6 text-[16px] font-medium text-[var(--measured-dark)]">
                  <span>{item.q}</span>
                  <ChevronDown
                    size={18}
                    strokeWidth={2}
                    className="mt-0.5 shrink-0 text-[var(--measured-subtext)] transition-transform duration-300 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="faq-body">
                  <div>
                    <p className="pb-1 pt-4 text-[15px] leading-relaxed text-[var(--measured-subtext)]">
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
      <CtaBand bookingUrl={BOOKING_URL} />

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
