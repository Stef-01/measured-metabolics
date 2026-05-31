"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** Opens the assessment funnel modal (listened for by <Funnel/>). */
export function openFunnel() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("open-funnel"));
  }
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type RevealTag = "div" | "h2" | "h3" | "p" | "span" | "section" | "figure";

const MOTION_TAGS = {
  div: motion.div,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
  section: motion.section,
  figure: motion.figure,
} as const;

/** Scroll-triggered fade-up, used across every section below the hero. */
export function Reveal({
  children,
  as = "div",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  as?: RevealTag;
  delay?: number;
  className?: string;
}) {
  const MotionTag = MOTION_TAGS[as] as React.ElementType;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -7% 0px" }}
      transition={{ duration: 0.8, delay: delay / 1000, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

export function Eyebrow({
  children,
  center = false,
}: {
  children: ReactNode;
  center?: boolean;
}) {
  return (
    <span
      className={
        "inline-flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-muted " +
        (center ? "justify-center" : "")
      }
    >
      <span className="w-2 h-2 rounded-full grad-dot"></span>
      {children}
    </span>
  );
}

type BtnVariant = "primary" | "ghost" | "white" | "dark";

const BTN_VARIANTS: Record<BtnVariant, string> = {
  primary:
    "bg-lav text-white border-transparent shadow-[0_10px_26px_-12px_rgba(20,18,12,.45)] hover:-translate-y-0.5",
  ghost: "bg-transparent text-ink border-line2 hover:bg-bgsoft",
  white:
    "bg-white text-ink border-line2 hover:border-ink hover:-translate-y-0.5",
  dark: "bg-ink text-white border-transparent hover:-translate-y-0.5",
};

export function Btn({
  children,
  variant = "primary",
  lg = false,
  href,
  onClick,
  className = "",
}: {
  children: ReactNode;
  variant?: BtnVariant;
  lg?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  const base =
    "press inline-flex items-center gap-2 font-semibold rounded-full border whitespace-nowrap cursor-pointer " +
    (lg
      ? "text-base px-7 py-[1.05rem] "
      : "text-[0.95rem] px-[1.6rem] py-[0.95rem] ");
  const cls = base + BTN_VARIANTS[variant] + " " + className;
  if (href) {
    return (
      <a href={href} onClick={onClick} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
