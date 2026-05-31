"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { openFunnel } from "./shared";
import { Magnetic } from "./motion-fx";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const NAV_LINKS: [string, string][] = [
  ["About Us", "#doctor"],
  ["How It Works", "#journey"],
  ["Programs", "#program"],
  ["Medication", "#medication"],
  ["Pricing", "#pricing"],
  ["FAQ", "#faq"],
];

export function Nav() {
  // Apple-style condensing nav: the pill narrows and tightens once the page
  // scrolls past the hero fold.
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 32);
    if (v > 80) setMenuOpen(false); // tuck the mobile menu away on scroll
  });
  return (
    <header className="fixed top-3.5 inset-x-0 z-[100] flex flex-col items-center px-3.5">
      <div
        className={
          "glass-dark flex w-full items-center justify-between gap-4 rounded-full pl-6 transition-all duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] " +
          (scrolled
            ? "max-w-[1080px] px-2 py-1.5"
            : "max-w-[1320px] px-2.5 py-2")
        }
      >
        <a
          href="#top"
          className="font-disp text-[1.35rem] font-extrabold tracking-tight text-white leading-none"
        >
          CLOVE
        </a>
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-[0.85rem] font-medium text-white/80 hover:text-white transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <Magnetic strength={0.4}>
            <button
              type="button"
              onClick={openFunnel}
              className="press rounded-full bg-white px-5 py-2.5 text-[0.88rem] font-bold whitespace-nowrap text-ink hover:-translate-y-0.5 sm:px-6"
            >
              Get Started
            </button>
          </Magnetic>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white hover:bg-white/10 lg:hidden"
          >
            {menuOpen ? (
              <X size={22} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Menu size={22} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile / tablet menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="mt-2 w-full max-w-[1320px] overflow-hidden rounded-3xl border border-white/12 bg-[rgba(16,16,13,0.95)] p-2 shadow-[0_24px_50px_-26px_rgba(0,0,0,0.85)] backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            {NAV_LINKS.map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-2xl px-4 py-3 text-[0.98rem] font-medium text-white/85 transition-colors hover:bg-white/10"
              >
                {label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openFunnel();
              }}
              className="press mt-1 w-full rounded-2xl bg-white py-3 text-[0.95rem] font-bold text-ink"
            >
              Take the assessment
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

const ICONS: Record<string, ReactNode> = {
  shield: (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l7 3v5c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  clock: (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  ),
  pulse: (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12h4l2.5-6 4 13L20 12h1" />
    </svg>
  ),
  video: (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="6" width="13" height="12" rx="2.5" />
      <path d="M16 10l5-3v10l-5-3" />
    </svg>
  ),
};

const TRUST: [string, string][] = [
  ["shield", "AHPRA-registered"],
  ["clock", "24–48h doctor review"],
  ["pulse", "CGM-guided therapy"],
  ["video", "Telehealth Australia-wide"],
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const mediaY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const lines = ["Lose weight with", "precision medicine."];

  return (
    <section
      ref={ref}
      id="top"
      className="grain relative min-h-[100svh] flex flex-col overflow-hidden bg-[#0a0e0c] text-white"
    >
      {/* cinematic media bed */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ y: mediaY, scale: mediaScale }}
        >
          <div
            className="absolute inset-0 bg-center bg-cover scale-110"
            style={{ backgroundImage: "url('/landing/hero-mtn.jpg')" }}
          ></div>
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/landing/hero-mtn.jpg"
            className="absolute inset-0 w-full h-full object-cover scale-110"
          >
            <source src="/landing/hero-bg.mp4" type="video/mp4" />
          </video>
        </motion.div>
        {/* vertical scrim */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg,rgba(8,12,10,.6) 0%,rgba(8,12,10,.12) 26%,rgba(8,12,10,.24) 58%,rgba(8,12,10,.52) 84%,rgba(8,12,10,.78) 100%)",
          }}
        ></div>
        {/* horizontal scrim for left-aligned copy legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(102deg,rgba(8,12,10,.86) 0%,rgba(8,12,10,.5) 36%,rgba(8,12,10,.08) 66%,rgba(8,12,10,0) 100%)",
          }}
        ></div>
      </div>

      {/* hero copy */}
      <motion.div
        className="relative z-[2] flex-1 flex items-center will-change-transform"
        style={{ y: copyY, opacity: copyOpacity }}
      >
        <div className="w-full max-w-[1320px] mx-auto px-[clamp(1.25rem,4vw,2.75rem)] pt-[clamp(8.5rem,18vh,10.5rem)] pb-8">
          <div className="max-w-[47rem]">
            <h1 className="font-disp tracking-[-.04em] leading-[.98] text-[clamp(2.2rem,4.8vw,4rem)]">
              {lines.map((line, i) => (
                <span key={line} className="hero-mask">
                  <motion.span
                    className="hero-rise"
                    initial={{ y: "116%", opacity: 0, filter: "blur(12px)" }}
                    animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                    transition={{
                      duration: 1,
                      delay: 0.15 + i * 0.13,
                      ease: EASE,
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p
              className="mt-6 max-w-[36rem] text-[clamp(0.92rem,1vw,1.08rem)] leading-[1.6] text-white/80"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.59, ease: EASE }}
            >
              A specialist-clinician-led program that turns your bloods, CGM and
              DEXA into a plan built around your biology. Medication delivered,
              Australia-wide.
            </motion.p>
            <motion.div
              className="mt-9 flex gap-3.5 flex-wrap"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.68, ease: EASE }}
            >
              <Magnetic strength={0.45}>
                <button
                  type="button"
                  onClick={openFunnel}
                  className="group press inline-flex items-center gap-2 rounded-full bg-white text-ink font-bold text-base px-7 py-[1.05rem] shadow-[0_18px_40px_-18px_rgba(0,0,0,.8)] hover:-translate-y-0.5"
                >
                  Check your eligibility{" "}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </Magnetic>
              <a
                href="#journey"
                className="press inline-flex items-center gap-2 rounded-full font-semibold text-base px-7 py-[1.05rem] text-white bg-white/10 border border-white/25 backdrop-blur-md hover:bg-white/[0.18]"
              >
                How it works
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* slim trust line */}
      <motion.div
        className="relative z-[2] px-[clamp(1.25rem,4vw,2.75rem)] pb-[clamp(1.75rem,3.5vw,2.75rem)]"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.77, ease: EASE }}
      >
        <div className="max-w-[1320px] mx-auto flex flex-wrap items-center gap-x-5 gap-y-2.5">
          {TRUST.map(([icon, label], i) => (
            <span key={label} className="flex items-center gap-x-5">
              {i > 0 && (
                <span className="hidden sm:block w-px h-3.5 bg-white/20"></span>
              )}
              <span className="inline-flex items-center gap-2 text-[0.84rem] font-medium text-white/85">
                <span className="text-white/55 [&_svg]:w-[17px] [&_svg]:h-[17px]">
                  {ICONS[icon]}
                </span>
                {label}
              </span>
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
