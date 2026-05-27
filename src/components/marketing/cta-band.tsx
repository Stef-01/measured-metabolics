"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CtaBand({ bookingUrl }: { bookingUrl: string }) {
  return (
    <section className="relative overflow-hidden bg-[var(--measured-green)]">
      {/* Background lifestyle image at very low opacity */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/images/hero/kitchen-counter.jpg"
          alt=""
          fill
          className="object-cover"
          style={{ opacity: 0.08, mixBlendMode: "overlay" }}
          sizes="100vw"
        />
      </div>

      {/* Ambient orb */}
      <motion.div
        className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-white/6 blur-[130px]"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-5xl px-6 py-20 text-center md:py-32">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45"
        >
          Get started
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
          className="font-serif text-[44px] leading-tight tracking-tight text-white md:text-[54px]"
        >
          Start your programme.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, delay: 0.14 }}
          className="mx-auto mt-4 max-w-[360px] text-[15px] leading-relaxed text-white/55"
        >
          Six months of clinically supervised metabolic medicine, tailored to
          your biology.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, delay: 0.22 }}
          className="mt-10"
        >
          <motion.a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-[15px] font-semibold text-[var(--measured-dark-green)] shadow-[0_4px_32px_-4px_rgba(0,0,0,0.25)]"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
          >
            Book via HealthEngine
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
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-5 text-[12px] text-white/30"
        >
          Medicare rebates available on GP consultations
        </motion.p>
      </div>
    </section>
  );
}
