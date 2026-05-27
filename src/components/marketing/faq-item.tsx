"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FaqItemProps {
  q: string;
  a: string;
}

export function FaqItem({ q, a }: FaqItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-start justify-between gap-6 text-left text-[16px] font-medium text-[var(--measured-dark)]"
        aria-expanded={open}
      >
        <span>{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
          className="mt-0.5 shrink-0 text-[var(--measured-subtext)]"
        >
          <ChevronDown size={18} strokeWidth={2} aria-hidden="true" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.22, ease: "easeOut" },
            }}
            className="overflow-hidden"
          >
            <p className="pb-1 pt-4 text-[15px] leading-relaxed text-[var(--measured-subtext)]">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
