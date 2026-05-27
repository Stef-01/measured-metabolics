import type { Transition, Variants } from "framer-motion";

// ── Spring presets ─────────────────────────────────────────────────────────────
// Use these everywhere instead of ad-hoc duration/ease values.

export const spring = {
  snappy: { type: "spring", stiffness: 400, damping: 30 } satisfies Transition,
  smooth: { type: "spring", stiffness: 280, damping: 24 } satisfies Transition,
  bouncy: { type: "spring", stiffness: 320, damping: 16 } satisfies Transition,
  reveal: {
    duration: 0.64,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  } satisfies Transition,
  fast: {
    duration: 0.22,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  } satisfies Transition,
};

// ── Shared variant factories ───────────────────────────────────────────────────

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: spring.reveal },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: spring.fast },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: spring.reveal },
};

export function staggerContainer(stagger = 0.08, delay = 0): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
}

export const wordReveal: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};
