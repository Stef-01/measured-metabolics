"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function MobileBookingBar({ url }: { url: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 180);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="booking-bar"
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--measured-border-soft)] bg-white/96 px-4 pt-3 backdrop-blur-md md:hidden pb-[max(env(safe-area-inset-bottom,0px),16px)]"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        >
          <motion.a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--measured-green)] py-3.5 text-[15px] font-semibold text-white"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            Book a consultation
            <ArrowRight size={15} strokeWidth={2.4} aria-hidden="true" />
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
