"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";

export function HeroParallax({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -72]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <div ref={sectionRef}>
      <motion.div style={{ y, opacity }}>{children}</motion.div>
    </div>
  );
}
