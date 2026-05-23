"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

/**
 * SearchTrigger — full-width pill that opens patient search.
 * Mirrors the Sous CravingSearchBar visual: cream-tinted background,
 * subtle border, soft inner shadow, generous touch target.
 */
export function SearchTrigger({ onClick }: { onClick?: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      className="flex w-full items-center gap-3 rounded-2xl border border-[var(--banksia-border)] bg-[var(--banksia-input-bg)] px-4 py-3 text-left text-sm text-[var(--banksia-subtext)] transition-colors hover:bg-[#ebe7e1]"
      aria-label="Search patients"
    >
      <Search size={18} className="text-[var(--banksia-subtext)]" strokeWidth={2} />
      <span className="flex-1 truncate">Search a patient or condition…</span>
      <kbd className="hidden rounded-md border border-[var(--banksia-border-soft)] bg-white px-1.5 py-0.5 text-[10px] font-medium text-[var(--banksia-subtext)] md:inline">
        ⌘K
      </kbd>
    </motion.button>
  );
}
