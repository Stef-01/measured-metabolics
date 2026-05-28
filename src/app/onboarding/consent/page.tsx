"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { cn } from "@/lib/utils/cn";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];
const listContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const listItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease } },
};

const TIERS: Array<{
  kind: "clinical_care" | "rwe" | "marketing";
  title: string;
  required: boolean;
  blurb: string;
}> = [
  {
    kind: "clinical_care",
    title: "Care provision",
    required: true,
    blurb:
      "Required to use Measured. Lets your dietitian and GP see your meals, CGM, symptoms, plan, and reports so they can provide care.",
  },
  {
    kind: "rwe",
    title: "Research & real-world evidence",
    required: false,
    blurb:
      "Optional. Allows de-identified data to support published research on metabolic care. You can withdraw at any time on the Privacy page; care continues unchanged.",
  },
  {
    kind: "marketing",
    title: "Marketing communications",
    required: false,
    blurb:
      "Optional. Lets us send product updates and pilot study invitations.",
  },
];

export default function ConsentPage() {
  const [state, setState] = useState({
    clinical_care: true,
    rwe: false,
    marketing: false,
  });
  const [submitted, setSubmitted] = useState(false);

  function toggle(kind: "rwe" | "marketing") {
    setState((s) => ({ ...s, [kind]: !s[kind] }));
  }

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
          Onboarding
        </p>
        <h1 className="mt-1 font-serif text-[32px] leading-tight tracking-tight text-[var(--measured-dark)]">
          Three things to choose
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-[var(--measured-subtext)]">
          Each one is independent. You can change RWE and marketing on the
          Privacy page later.
        </p>
      </motion.div>

      <motion.ul
        className="mt-6 space-y-3"
        variants={listContainer}
        initial="hidden"
        animate="show"
      >
        {TIERS.map((t) => {
          const checked = t.required
            ? true
            : state[t.kind as "rwe" | "marketing"];
          return (
            <motion.li
              key={t.kind}
              variants={listItem}
              className={cn(
                "rounded-3xl border p-4 transition-colors",
                checked
                  ? "border-[var(--measured-green)]/30 bg-[var(--measured-green)]/4"
                  : "border-[var(--measured-border-soft)] bg-[var(--measured-card)]",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[15px] font-semibold text-[var(--measured-dark)]">
                      {t.title}
                    </p>
                    {t.required ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--measured-green)]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-dark-green)]">
                        <ShieldCheck
                          size={10}
                          strokeWidth={2.2}
                          aria-hidden="true"
                        />
                        Required
                      </span>
                    ) : (
                      <span className="rounded-full bg-[var(--measured-cream)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
                        Optional
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--measured-subtext)]">
                    {t.blurb}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={checked}
                  disabled={t.required}
                  onClick={() =>
                    !t.required && toggle(t.kind as "rwe" | "marketing")
                  }
                  className={cn(
                    "relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--measured-green)]/50",
                    checked
                      ? "bg-[var(--measured-green)]"
                      : "bg-[var(--measured-border)]",
                    t.required && "cursor-default opacity-60",
                  )}
                >
                  <motion.span
                    layout
                    className={cn(
                      "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow",
                      checked && "translate-x-5",
                    )}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </motion.li>
          );
        })}
      </motion.ul>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="confirmed"
            className="mt-8 flex flex-col items-center gap-3 rounded-3xl bg-[var(--measured-green)] px-6 py-6 text-center text-white shadow-[0_4px_20px_-4px_rgba(45,90,61,0.35)]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
          >
            <CheckCircle2 size={28} strokeWidth={2} aria-hidden="true" />
            <div className="text-[15px] font-semibold">Consent saved</div>
            <p className="text-[12px] text-white/80">
              You can update RWE &amp; marketing any time on the Privacy page.
            </p>
            <Link
              href="/p/home"
              className="mt-1 rounded-2xl bg-white px-5 py-2.5 text-[14px] font-semibold text-[var(--measured-dark-green)]"
            >
              Continue to Today
            </Link>
          </motion.div>
        ) : (
          <motion.button
            key="submit"
            type="button"
            onClick={() => setSubmitted(true)}
            className="cta-shadow mt-8 w-full rounded-2xl bg-[var(--measured-green)] px-4 py-3.5 text-[15px] font-semibold text-white hover:bg-[var(--measured-dark-green)] transition-colors"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.96 }}
          >
            Save consent
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
}
