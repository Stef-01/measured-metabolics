import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — CLOVE",
  robots: { index: false },
};

const SECTIONS: [string, string][] = [
  [
    "About these terms",
    "These terms govern your use of the CLOVE website and service. By using the site or booking an assessment, you agree to them. CLOVE is an Australian telehealth service operated by [legal entity name], ABN [add ABN].",
  ],
  [
    "Not medical advice",
    "The website is general information only and is not medical advice. Care, diagnosis and any prescription are provided by AHPRA-registered practitioners, only where clinically appropriate, and are not suitable for everyone.",
  ],
  [
    "Eligibility and assessment",
    "Completing the assessment does not guarantee acceptance into a program or any prescription. Eligibility and the right treatment, if any, are determined by your clinician based on your history and assessment.",
  ],
  [
    "Payments and cancellation",
    "Pricing is shown on the site. There is no lock-in contract; you can cancel anytime, and there are no hidden fees. Refunds, where applicable, follow Australian Consumer Law.",
  ],
  [
    "Medicines, risks and delivery",
    "Prescription medicines carry risks and side effects your clinician will discuss with you. Where prescribed, medication is dispensed by a pharmacy and delivered to you. Availability depends on assessment and supply.",
  ],
  ["Contact", "Questions about these terms can be sent to care@clove.au."],
];

export default function TermsPage() {
  return (
    <main className="min-h-dvh bg-[#faf8f2] text-[#1b1b16]">
      <div className="mx-auto max-w-[760px] px-6 py-16">
        <Link
          href="/"
          className="text-[0.85rem] font-semibold text-[#52504a] transition-colors hover:text-[#1b1b16]"
        >
          ← CLOVE
        </Link>
        <p className="mt-8 rounded-xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-[0.85rem] leading-relaxed text-amber-900">
          Draft placeholder. This is a starting template and must be reviewed
          and finalised by your legal advisor before launch.
        </p>
        <h1 className="mt-8 text-[clamp(2rem,4vw,2.6rem)] font-extrabold tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-2 text-[0.85rem] text-[#928d83]">
          Last updated: [add date]
        </p>
        <div className="mt-10 space-y-8">
          {SECTIONS.map(([h, body]) => (
            <section key={h}>
              <h2 className="text-[1.15rem] font-bold tracking-tight">{h}</h2>
              <p className="mt-2 text-[1rem] leading-relaxed text-[#52504a]">
                {body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
