"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.04 },
  },
};

const itemUp = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.68,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const itemRight = {
  hidden: { opacity: 0, x: 24, scale: 0.97 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.68,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export function StaggerGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  hover = false,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  direction?: "up" | "right";
}) {
  return (
    <motion.div
      className={className}
      variants={direction === "right" ? itemRight : itemUp}
      whileHover={
        hover
          ? {
              y: -7,
              scale: 1.01,
              transition: { type: "spring", stiffness: 320, damping: 22 },
            }
          : undefined
      }
      whileTap={hover ? { scale: 0.98 } : undefined}
    >
      {children}
    </motion.div>
  );
}
