"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { staggerContainer, wordReveal } from "@/lib/motion";

function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <motion.span key={i} variants={wordReveal} className="inline-block">
          {word}&nbsp;
        </motion.span>
      ))}
    </>
  );
}

const wordContainer = staggerContainer(0.07, 0.1);

export function HeroSection({ bookingUrl }: { bookingUrl: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-7, 7]), {
    stiffness: 70,
    damping: 20,
  });
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [6, -6]), {
    stiffness: 70,
    damping: 20,
  });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) / (rect.width / 2));
    mouseY.set((e.clientY - rect.top - rect.height / 2) / (rect.height / 2));
  }

  function onMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 72% 20%, #1a3328 0%, #0A0A08 55%)",
      }}
    >
      {/* Ambient orbs */}
      <motion.div
        className="pointer-events-none absolute -left-48 top-1/4 h-[640px] w-[640px] rounded-full bg-[var(--measured-green)]/5 blur-[160px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute right-32 top-0 h-[320px] w-[320px] rounded-full bg-[#2d5a3d]/25 blur-[120px]"
        animate={{ scale: [1, 1.4, 1], opacity: [0.25, 0.55, 0.25] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />

      <div className="mx-auto max-w-5xl px-6 pt-16 pb-24 md:pt-28 md:pb-32">
        <div className="flex flex-col gap-12 md:flex-row md:items-center md:gap-16 lg:gap-20">
          {/* ── Left: text ── */}
          <div className="flex-1">
            {/* Eyebrow with pulsing dot */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 flex items-center gap-2.5"
            >
              <motion.span
                className="block h-1.5 w-1.5 rounded-full bg-[var(--measured-green)]"
                animate={{ scale: [1, 1.8, 1], opacity: [1, 0.4, 1] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
                Health Optimisation Protocol&nbsp;·&nbsp;Beecroft NSW
              </span>
            </motion.div>

            {/* Word-by-word heading */}
            <motion.h1
              variants={wordContainer}
              initial="hidden"
              animate="show"
              className="font-serif text-[44px] font-normal leading-[1.06] tracking-tight text-white sm:text-[52px] md:text-[64px] md:leading-[1.02] lg:text-[72px]"
            >
              <span className="block">
                <Words text="A structured path" />
              </span>
              <span className="block font-light italic text-white/55">
                <Words text="to metabolic health." />
              </span>
            </motion.h1>

            {/* Body */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.6,
              }}
              className="mt-7 max-w-[400px] text-[16px] leading-relaxed text-white/40"
            >
              A medically supervised six-month programme combining GLP-1
              therapy, DEXA body composition scanning, and personalised
              dietitian support.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.75,
              }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <motion.a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-[15px] font-semibold text-[var(--measured-dark-green)]"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
              >
                Book a consultation
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.8,
                    ease: "easeInOut",
                    repeatDelay: 0.8,
                  }}
                >
                  <ArrowRight size={15} strokeWidth={2.4} aria-hidden="true" />
                </motion.span>
              </motion.a>
              <a
                href="#protocol"
                className="flex items-center gap-1.5 text-[13px] font-medium text-white/35 transition-colors hover:text-white/65"
              >
                How it works
                <ChevronDown size={13} strokeWidth={2} aria-hidden="true" />
              </a>
            </motion.div>

            {/* Trust markers */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2"
            >
              {["FRACGP", "MPhil", "Medicare eligible"].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <div className="h-px w-3 bg-[var(--measured-green)]/70" />
                  <span className="text-[11px] text-white/30">{t}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: 3-D tilt image ── */}
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.25,
            }}
            className="relative hidden md:block md:w-[280px] lg:w-[340px]"
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{ perspective: 900 }}
          >
            <motion.div
              style={{ rotateX, rotateY }}
              className="relative h-[420px] overflow-hidden rounded-[28px] lg:h-[480px]"
            >
              <Image
                src="/images/dr-saxena.jpeg"
                alt="Dr Anubhav Saxena"
                fill
                className="object-cover object-top"
                sizes="(min-width: 1024px) 340px, 280px"
                priority
              />
              {/* Bottom gradient overlay */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,10,8,0.7) 0%, transparent 40%)",
                }}
              />
              {/* Inset ring */}
              <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/10" />
            </motion.div>

            {/* Floating credential badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.82, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                delay: 1.05,
                type: "spring",
                stiffness: 240,
                damping: 20,
              }}
              className="absolute -bottom-5 -left-7 rounded-2xl border border-white/12 bg-black/40 px-4 py-3.5 shadow-xl backdrop-blur-xl"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45">
                Your clinician
              </p>
              <p className="mt-1 text-[14px] font-medium leading-tight text-white">
                Dr Anubhav Saxena
              </p>
              <p className="mt-0.5 text-[11px] text-white/35">
                MBBS · FRACGP · MPhil
              </p>
            </motion.div>

            {/* Floating programme badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 1.2,
                type: "spring",
                stiffness: 240,
                damping: 20,
              }}
              className="absolute -right-6 top-10 rounded-2xl border border-[var(--measured-green)]/35 bg-[var(--measured-green)]/80 px-3.5 py-3 shadow-lg backdrop-blur-xl"
            >
              <p className="text-[9px] font-semibold uppercase tracking-wider text-white/55">
                Programme
              </p>
              <p className="text-[24px] font-bold leading-none text-white">6</p>
              <p className="text-[11px] text-white/60">months</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.5 }}
        aria-hidden="true"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/15 pt-2">
          <motion.div
            className="h-1.5 w-1 rounded-full bg-white/40"
            animate={{ y: [0, 9, 0], opacity: [0.8, 0.2, 0.8] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
