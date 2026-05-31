"use client";

import { MotionConfig } from "framer-motion";
import { ScrollProgress, MobileCtaBar } from "./motion-fx";
import { Nav, Hero } from "./hero";
import {
  Difference,
  WhatWeTest,
  ProgressTracked,
  Journey,
  EverythingIncluded,
  Program,
  Pricing,
  Doctor,
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
        <Nav />
        <main>
          <Hero />
          <Difference />
          <WhatWeTest />
          <ProgressTracked />
          <Journey />
          <EverythingIncluded />
          <Program />
          <Pricing />
          <Doctor />
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
