import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const BOOKING_URL =
  "https://healthengine.com.au/doctor/nsw/beecroft/dr-anubhav-saxena/p123180";

const PROTOCOL = [
  {
    n: "01",
    title: "CGM monitored GLP-1 therapy",
    body: "Six months of clinically guided GLP-1 receptor agonist therapy, titrated to your response with continuous glucose monitoring at every step.",
    photo: "/images/protocol/cgm.jpg",
  },
  {
    n: "02",
    title: "DEXA body composition",
    body: "Baseline and completion DEXA scans measure fat mass, lean mass, and visceral fat — giving you objective before-and-after data.",
    photo: "/images/protocol/dexa.jpg",
  },
  {
    n: "03",
    title: "Personalised meal planning",
    body: "Your dietitian builds a plan around your cuisine, preferences, and metabolic targets — with recipes adapted specifically for you.",
    photo: "/images/protocol/meal.jpg",
  },
];

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
      <section className="mx-auto max-w-5xl px-6 pt-28 pb-24 md:pt-40 md:pb-36">
        <p className="mb-8 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--measured-subtext)]">
          Health Optimisation Protocol · Beecroft NSW
        </p>
        <h1 className="font-serif text-[58px] leading-[1.02] tracking-tight text-[var(--measured-dark)] md:text-[84px]">
          A structured path
          <br />
          to metabolic health.
        </h1>
        <p className="mt-8 max-w-[460px] text-[17px] leading-relaxed text-[var(--measured-subtext)]">
          A medically supervised six-month program combining GLP-1 therapy, DEXA
          body composition scanning, and personalised dietitian support.
        </p>
        <div className="mt-10">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-shadow inline-flex items-center gap-2 rounded-2xl bg-[var(--measured-green)] px-7 py-4 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Book a consultation
            <ArrowRight size={15} strokeWidth={2.4} aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* ── Protocol ─────────────────────────────────── */}
      <section className="bg-[var(--measured-cream)]">
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
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

          <div className="grid gap-14 md:grid-cols-3 md:gap-10">
            {PROTOCOL.map((step) => (
              <div key={step.n} className="relative overflow-hidden">
                {/* Greyscale photo bleeds in from the right */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 top-0 bottom-0 w-[62%]"
                  style={{
                    maskImage:
                      "linear-gradient(to right, transparent 0%, black 55%)",
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent 0%, black 55%)",
                  }}
                >
                  <Image
                    src={step.photo}
                    alt=""
                    fill
                    className="object-cover"
                    style={{
                      filter: "grayscale(1)",
                      opacity: 0.16,
                      mixBlendMode: "multiply",
                    }}
                    sizes="(min-width: 768px) 200px, 60vw"
                  />
                </div>

                {/* Text */}
                <div className="relative">
                  <div className="mb-6 h-px w-8 bg-[var(--measured-green)]" />
                  <div
                    aria-hidden="true"
                    className="font-serif text-[72px] leading-none text-[var(--measured-green)]/15"
                  >
                    {step.n}
                  </div>
                  <h3 className="mt-6 font-serif text-[24px] leading-tight text-[var(--measured-dark)]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-[var(--measured-subtext)]">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Doctor ───────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <div className="flex flex-col gap-14 md:flex-row md:items-start md:gap-20">
          {/* Portrait */}
          <div className="shrink-0">
            <div className="relative h-[380px] w-[300px] overflow-hidden rounded-3xl bg-[var(--measured-cream)] shadow-[0_8px_48px_-8px_rgba(0,0,0,0.14)]">
              <Image
                src="/images/dr-saxena.jpeg"
                alt="Dr Anubhav Saxena"
                fill
                className="object-cover object-top"
                sizes="300px"
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
            <p className="mt-2 text-[13px] text-[var(--measured-subtext)]">
              MBBS · FRACGP · MPhil · BSc(Adv) · DCH
            </p>
            <p className="mt-7 max-w-[440px] text-[16px] leading-relaxed text-[var(--measured-subtext)]">
              Fellow of the Royal Australian College of General Practitioners
              with a research background in metabolic medicine. Dr Saxena
              designed the Health Optimisation Protocol to give patients a
              structured, evidence-based path to lasting weight and metabolic
              improvement.
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
      </section>

      {/* ── CTA band ─────────────────────────────────── */}
      <section className="bg-[var(--measured-green)]">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center md:py-28">
          <h2 className="font-serif text-[44px] leading-tight tracking-tight text-white md:text-[52px]">
            Ready to start?
          </h2>
          <p className="mt-4 text-[15px] text-white/60">
            Book your initial consultation via HealthEngine.
          </p>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-[15px] font-semibold text-[var(--measured-dark-green)] shadow-[0_2px_24px_-4px_rgba(0,0,0,0.25)] transition-colors hover:bg-[var(--measured-cream)]"
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
