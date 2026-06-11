"use client";

/**
 * Advanced motion primitives for the CLOVE landing, informed by 2026 motion
 * trends: scroll-telling (useScroll/useTransform), cursor interaction
 * (magnetic + 3D tilt), kinetic counters, and a scroll progress rail.
 *
 * Every primitive degrades to a static state under prefers-reduced-motion, and
 * all motion stays on GPU-friendly transform/opacity properties.
 */

import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useReducedMotion,
  useInView,
  animate,
} from "framer-motion";
import {
  useRef,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type PointerEvent,
} from "react";
import { openFunnel } from "./shared";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* Hydration-safe "on the client yet?" check: false during SSR and the first
   client paint, true right after. Lets progressive-enhancement layers return
   null without ever disagreeing with the server-rendered markup. */
const noopSubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/* ── Scroll progress rail — fixed hairline that fills as you read ── */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const mounted = useMounted();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.4,
  });
  // Render nothing until mounted so SSR and the first client paint always
  // match; a reduce-user's `null` would otherwise be a hydration mismatch.
  if (!mounted || reduce) return null;
  return (
    <motion.div
      aria-hidden
      className="grad-lav fixed inset-x-0 top-0 z-[150] h-[3px] origin-left"
      style={{ scaleX }}
    />
  );
}

/* ── Magnetic — children drift toward the cursor and spring back ── */
export function Magnetic({
  children,
  strength = 0.32,
  className = "inline-flex",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 });

  function onMove(e: PointerEvent<HTMLDivElement>) {
    // Mouse only: skip on touch/pen so taps and scrolls stay rock-steady.
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Tilt — subtle pointer-driven 3D rotation for cards ── */
export function Tilt({
  children,
  max = 7,
  className,
}: {
  children: ReactNode;
  max?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 20, mass: 0.5 });
  const sry = useSpring(ry, { stiffness: 200, damping: 20, mass: 0.5 });

  function onMove(e: PointerEvent<HTMLDivElement>) {
    // Mouse only: 3D tilt would fight touch scrolling on phones.
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * max);
    rx.set(-py * max);
  }
  function reset() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{
        rotateX: srx,
        rotateY: sry,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Parallax — scroll-linked vertical drift for media ── */
export function Parallax({
  children,
  amount = 60,
  className,
}: {
  children: ReactNode;
  amount?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  return (
    <motion.div ref={ref} style={{ y: reduce ? 0 : y }} className={className}>
      {children}
    </motion.div>
  );
}

/* ── CountUp — animates a figure when it scrolls into view ── */
export function CountUp({
  to,
  from = 0,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.5,
  className,
}: {
  to: number;
  from?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [val, setVal] = useState(from);

  useEffect(() => {
    if (!inView) return;
    // Reduce users get the final figure immediately (zero-duration tween),
    // keeping SSR markup identical for every visitor.
    const controls = animate(from, to, {
      duration: reduce ? 0 : duration,
      ease: EASE,
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, reduce, from, to, duration]);

  return (
    <span
      ref={ref}
      className={"tabular-nums" + (className ? " " + className : "")}
    >
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ── MobileCtaBar — thumb-reachable persistent CTA on phones ──
   Slides up once the hero scrolls away; clears the home-indicator safe area
   and hides at lg where the inline CTAs are always in view. */
/* ── Spotlight — a soft glow that tracks the cursor over a dark surface ── */
export function Spotlight({
  className = "",
  size = 460,
  color = "rgba(255,255,255,0.14)",
}: {
  className?: string;
  size?: number;
  color?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const sx = useSpring(x, { stiffness: 260, damping: 30, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 30, mass: 0.5 });
  const [on, setOn] = useState(false);
  const mounted = useMounted();

  function onMove(e: PointerEvent<HTMLDivElement>) {
    // Mouse only: a touch "spotlight" would lag the finger and feel broken.
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
    if (!on) setOn(true);
  }

  // Static surfaces (and reduced-motion users) simply see the section as-is.
  // Mount-gated so SSR and the first client paint always match.
  if (!mounted || reduce) return null;

  return (
    <motion.div
      ref={ref}
      aria-hidden
      onPointerMove={onMove}
      onPointerLeave={() => setOn(false)}
      className={"pointer-events-none absolute inset-0 z-0 " + className}
    >
      <motion.div
        className="absolute rounded-full blur-2xl transition-opacity duration-500"
        style={{
          width: size,
          height: size,
          x: sx,
          y: sy,
          translateX: "-50%",
          translateY: "-50%",
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          opacity: on ? 1 : 0,
        }}
      />
    </motion.div>
  );
}

export function MobileCtaBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-[120] border-t border-line2 bg-paper/85 px-4 pt-3 pb-[max(env(safe-area-inset-bottom),14px)] backdrop-blur-md lg:hidden"
          initial={{ y: "120%" }}
          animate={{ y: 0 }}
          exit={{ y: "120%" }}
          transition={{ type: "spring", stiffness: 360, damping: 32 }}
        >
          <button
            type="button"
            onClick={openFunnel}
            className="press sheen flex w-full items-center justify-center gap-2 rounded-full bg-lav py-4 text-[0.95rem] font-bold text-white"
          >
            Take the assessment <span aria-hidden>→</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
