"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

export function MobileBookingBar({ url }: { url: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 180);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={[
        "fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--measured-border-soft)]",
        "bg-white/96 px-4 pt-3 backdrop-blur-md transition-transform duration-300 md:hidden",
        "pb-[max(env(safe-area-inset-bottom,0px),16px)]",
        visible ? "translate-y-0" : "translate-y-full",
      ].join(" ")}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--measured-green)] py-3.5 text-[15px] font-semibold text-white"
      >
        Book a consultation
        <ArrowRight size={15} strokeWidth={2.4} aria-hidden="true" />
      </a>
    </div>
  );
}
