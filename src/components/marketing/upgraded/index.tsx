"use client";

import { MotionConfig } from "framer-motion";
import { ScrollProgress, MobileCtaBar, SectionDots } from "./motion-fx";
import { Nav, Hero } from "./hero";
import {
  TrustBar,
  Difference,
  ProofStats,
  Capabilities,
  ProgressTracked,
  Journey,
  EverythingIncluded,
  Program,
  Medications,
  Pricing,
  Doctor,
  TripleBaseline,
  VideoBand,
  Quotes,
  FAQ,
  CTA,
  Footer,
} from "./sections";
import { Funnel } from "./funnel";

/**
 * UpgradedLanding, the warm-paper / charcoal precision redesign.
 *
 * Everything is scoped under `.measured-upgraded`, which retunes the shared
 * `lav` accent + gradients to charcoal without affecting the rest of the app.
 */
export function UpgradedLanding() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="measured-upgraded bg-paper text-ink font-sans antialiased">
        <ScrollProgress />
        <SectionDots
          sections={[
            { id: "top", label: "Start" },
            { id: "journey", label: "How it works" },
            { id: "program", label: "Programs" },
            { id: "medication", label: "Medication" },
            { id: "pricing", label: "Pricing" },
            { id: "doctor", label: "Precision" },
            { id: "faq", label: "FAQ" },
            { id: "start", label: "Get started" },
          ]}
        />
        <Nav />
        <main id="main">
          <Hero />
          <TrustBar />
          <Difference />
          <ProofStats />
          <Capabilities />
          <Journey />
          <ProgressTracked />
          <EverythingIncluded />
          <Program />
          <Medications />
          <Pricing />
          <Doctor />
          <TripleBaseline />
          <VideoBand />
          <Quotes />
          <FAQ />
          <CTA />
        </main>
        <Footer />
        <Funnel />
        <MobileCtaBar />
      </div>
    </MotionConfig>
  );
}
