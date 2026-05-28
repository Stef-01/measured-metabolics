"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { StaggerGroup, StaggerItem } from "./stagger-group";

interface ProtocolStep {
  n: string;
  title: string;
  body: string;
  photo: string;
}

export function ProtocolSection({ steps }: { steps: ProtocolStep[] }) {
  return (
    <StaggerGroup className="divide-y divide-[var(--measured-border-soft)]">
      {steps.map((step) => (
        <StaggerItem key={step.n}>
          <div className="flex items-center gap-6 py-10 md:gap-14 md:py-14">
            {/* Step number — decorative, ultra-light */}
            <div
              className="shrink-0 select-none font-serif leading-none"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                color: "rgba(10, 10, 8, 0.08)",
              }}
            >
              {step.n}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              {/* Hairline grows in from left */}
              <motion.div
                className="mb-3 h-px origin-left bg-[var(--measured-green)]"
                style={{ width: 24 }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.56,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.12,
                }}
              />
              <h3
                className="font-serif leading-tight text-[var(--measured-dark)]"
                style={{ fontSize: "var(--text-h3)" }}
              >
                {step.title}
              </h3>
              <p className="mt-3 max-w-[380px] text-[15px] leading-relaxed text-[var(--measured-subtext)]">
                {step.body}
              </p>
            </div>

            {/* Image — wipes in from the right */}
            <motion.div
              className="relative hidden h-[144px] w-[144px] shrink-0 overflow-hidden rounded-xl md:block"
              initial={{ clipPath: "inset(0 100% 0 0 round 12px)" }}
              whileInView={{ clipPath: "inset(0 0% 0 0 round 12px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.88,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.18,
              }}
            >
              <Image
                src={step.photo}
                alt=""
                fill
                className="object-cover"
                sizes="144px"
              />
            </motion.div>
          </div>
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}
