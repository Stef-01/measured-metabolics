"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function BookNowButton({ url }: { url: string }) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full bg-[var(--measured-green)] px-4 py-2 text-[13px] font-semibold text-white"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
    >
      Book now
      <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" />
    </motion.a>
  );
}
