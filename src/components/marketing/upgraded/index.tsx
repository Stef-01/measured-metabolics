"use client";

import { MotionConfig } from "framer-motion";
import { ScrollProgress, MobileCtaBar } from "./motion-fx";
import { Nav, Hero } from "./hero";
import {
  Affiliations,
  Difference,
  ProofStats,
  ProgressTracked,
  EverythingIncluded,
  Pricing,
  VideoBand,
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
        <Nav />
        <main id="main">
          <Hero />
          <Affiliations />
          <Difference />
          <ProofStats />
          <EverythingIncluded />
          <ProgressTracked />
          <Pricing />
          <VideoBand />
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
