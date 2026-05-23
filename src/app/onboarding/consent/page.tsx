"use client";

import { useState } from "react";
import Link from "next/link";

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
      <p className="text-[12px] uppercase tracking-wide text-[var(--measured-subtext)]">
        Consent
      </p>
      <h1 className="mt-2 text-[24px] font-semibold text-[var(--measured-text)]">
        Three things to choose
      </h1>
      <p className="mt-3 text-[14px] leading-snug text-[var(--measured-subtext)]">
        Each one is independent. You can change RWE and marketing on the Privacy
        page later.
      </p>

      <ul className="mt-6 space-y-3">
        {TIERS.map((t) => (
          <li
            key={t.kind}
            className="rounded-3xl border border-[var(--measured-border)] bg-[var(--measured-card)] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[15px] font-semibold text-[var(--measured-text)]">
                  {t.title}
                </p>
                <p className="mt-1 text-[12px] text-[var(--measured-subtext)]">
                  {t.blurb}
                </p>
              </div>
              <label className="ml-2 mt-1 inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={
                    t.required ? true : state[t.kind as "rwe" | "marketing"]
                  }
                  disabled={t.required}
                  onChange={() =>
                    !t.required && toggle(t.kind as "rwe" | "marketing")
                  }
                  className="h-5 w-5 accent-[var(--measured-accent)]"
                />
              </label>
            </div>
            {t.required && (
              <p className="mt-2 text-[11px] uppercase tracking-wider text-[var(--measured-subtext)]">
                Required
              </p>
            )}
          </li>
        ))}
      </ul>

      {submitted ? (
        <div className="mt-8 rounded-3xl border border-[var(--measured-border)] bg-[var(--measured-card)] p-5">
          <p className="text-[14px] text-[var(--measured-text)]">
            Saved. You can withdraw RWE / marketing any time on the Privacy
            page.
          </p>
          <Link
            href="/p/home"
            className="mt-3 inline-flex rounded-2xl bg-[var(--measured-text)] px-4 py-2 text-[14px] font-semibold text-[var(--measured-bg)]"
          >
            Continue to Today
          </Link>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          className="mt-8 w-full rounded-2xl bg-[var(--measured-text)] px-4 py-3 text-[15px] font-semibold text-[var(--measured-bg)]"
        >
          Save consent
        </button>
      )}
    </main>
  );
}
