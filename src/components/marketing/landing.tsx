"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Stethoscope, ClipboardList, Activity, ArrowRight } from "lucide-react";

/**
 * Landing — marketing surface for Banksia.
 *
 * Same visual language as Sous: cream backdrop, serif headline, deep green
 * primary CTA, generous whitespace. Repositioned for the clinician audience.
 */
export function Landing() {
  return (
    <main className="min-h-dvh bg-[var(--banksia-cream)]">
      <div className="mx-auto max-w-5xl px-6 py-12 md:py-20">
        {/* Header bar */}
        <header className="mb-16 flex items-center justify-between md:mb-24">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--banksia-green)] text-white shadow-[var(--shadow-cta)]"
              aria-hidden
            >
              <Stethoscope size={18} strokeWidth={2.2} />
            </span>
            <span className="font-serif text-xl font-semibold text-[var(--banksia-dark)]">
              Banksia
            </span>
          </div>
          <Link
            href="/today"
            className="text-sm font-medium text-[var(--banksia-green)] hover:text-[var(--banksia-dark-green)]"
          >
            Open dashboard →
          </Link>
        </header>

        {/* Hero */}
        <section className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[var(--banksia-subtext)]">
              The clinician companion
            </p>
            <h1 className="font-serif text-4xl leading-[1.1] text-[var(--banksia-dark)] md:text-5xl">
              A calm dashboard for the work that
              <span className="text-[var(--banksia-green)]"> actually moves outcomes.</span>
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[var(--banksia-subtext)]">
              Banksia is the clinician twin of Sous — same patient-trusted UI,
              built around case queues, prescriptions, and follow-ups. One
              screen, one decision, one patient at a time.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/today"
                className="cta-shadow inline-flex items-center gap-2 rounded-2xl bg-[var(--banksia-green)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--banksia-dark-green)]"
              >
                Open today&apos;s queue
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/patients"
                className="inline-flex items-center gap-2 rounded-2xl border border-[var(--banksia-border)] bg-white px-6 py-3 text-sm font-semibold text-[var(--banksia-dark)] transition-colors hover:bg-neutral-50"
              >
                See patient list
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="surface-raised p-6 md:p-7"
          >
            <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--banksia-subtext)]">
              Today, 22 May
            </p>
            <h3 className="mt-1 font-serif text-2xl text-[var(--banksia-dark)]">
              4 cases, 1 priority
            </h3>

            <ul className="mt-5 space-y-3">
              {[
                {
                  name: "Aroha M.",
                  note: "Post-op nutrition review",
                  tag: "priority",
                },
                {
                  name: "Daniel K.",
                  note: "Type 2 diabetes — 6 wk follow-up",
                  tag: "follow-up",
                },
                {
                  name: "Priya S.",
                  note: "New referral · IBS-D",
                  tag: "intake",
                },
              ].map((row) => (
                <li
                  key={row.name}
                  className="flex items-center justify-between rounded-xl border border-[var(--banksia-border-soft)] bg-[var(--banksia-cream)]/40 px-3.5 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--banksia-dark)] truncate">
                      {row.name}
                    </p>
                    <p className="text-xs text-[var(--banksia-subtext)] truncate">
                      {row.note}
                    </p>
                  </div>
                  <span
                    className={
                      row.tag === "priority"
                        ? "rounded-full bg-[var(--banksia-evaluate)]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--banksia-evaluate)]"
                        : "rounded-full bg-[var(--banksia-green)]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--banksia-green)]"
                    }
                  >
                    {row.tag}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* Pillars */}
        <section className="mt-20 grid gap-6 md:mt-28 md:grid-cols-3">
          {[
            {
              icon: ClipboardList,
              title: "Today's queue",
              body: "The only screen most clinicians need. One action, one patient, no setup pages.",
            },
            {
              icon: Stethoscope,
              title: "Patient charts",
              body: "Searchable, lightweight charts. Long-press to prescribe a Sous plan in one tap.",
            },
            {
              icon: Activity,
              title: "Outcome insights",
              body: "Population-level signal — adherence, weight trend, biomarkers — without dashboards-for-dashboards-sake.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="surface-card p-6">
              <span
                className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--banksia-green)]/10 text-[var(--banksia-green)]"
                aria-hidden
              >
                <Icon size={20} strokeWidth={1.8} />
              </span>
              <h3 className="font-serif text-lg text-[var(--banksia-dark)]">
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--banksia-subtext)]">
                {body}
              </p>
            </div>
          ))}
        </section>

        <footer className="mt-20 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--banksia-border-soft)] pt-6 text-xs text-[var(--banksia-subtext)] md:mt-28">
          <span>© Banksia · Clinician edition</span>
          <span>Same UI as Sous · separate workspace</span>
        </footer>
      </div>
    </main>
  );
}
