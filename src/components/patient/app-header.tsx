"use client";

import { motion } from "framer-motion";

interface Props {
  eyebrow?: string;
  title: string;
  trailing?: React.ReactNode;
}

export function PatientAppHeader({ eyebrow, title, trailing }: Props) {
  return (
    <header className="app-header">
      <motion.div
        className="mx-auto flex max-w-md items-center justify-between gap-3 px-5 py-4"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="min-w-0 flex-1">
          {eyebrow && (
            <div className="text-[11px] font-medium text-[var(--measured-subtext)]">
              {eyebrow}
            </div>
          )}
          <h1 className="font-serif text-[26px] leading-tight tracking-tight text-[var(--measured-dark)]">
            {title}
          </h1>
        </div>
        {trailing && <div className="shrink-0">{trailing}</div>}
      </motion.div>
    </header>
  );
}
