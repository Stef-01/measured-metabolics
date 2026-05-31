import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — CLOVE",
  robots: { index: false },
};

const SECTIONS: [string, string][] = [
  [
    "Who we are",
    "CLOVE is an Australian telehealth service connecting you with AHPRA-registered practitioners for metabolic and weight care. This policy explains how we handle your personal and health information under the Privacy Act 1988 (Cth) and the Australian Privacy Principles.",
  ],
  [
    "Information we collect",
    "Contact details (name, email, phone); information you provide in the assessment and during care; health information your clinician records; and standard technical data (device, analytics) needed to run the service.",
  ],
  [
    "How we use it",
    "To assess eligibility, provide and coordinate your care, arrange any prescription and delivery, send appointment and reminder messages, and improve the service. We do not sell your personal information.",
  ],
  [
    "Storage and security",
    "Your data is stored on secure, access-controlled infrastructure and encrypted in transit and at rest. Access is limited to staff and practitioners involved in your care.",
  ],
  [
    "Your choices",
    "You can request access to or correction of your information, opt out of marketing messages, and ask questions about how your data is handled by contacting us at care@clove.au.",
  ],
];

export default function PrivacyPage() {
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
          and finalised by your legal / privacy advisor before launch.
        </p>
        <h1 className="mt-8 text-[clamp(2rem,4vw,2.6rem)] font-extrabold tracking-tight">
          Privacy Policy
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
