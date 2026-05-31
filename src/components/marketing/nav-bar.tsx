"use client";

import {
  useScroll,
  useTransform,
  useMotionTemplate,
  useSpring,
  motion,
} from "framer-motion";
import { BookNowButton } from "./book-now-button";

export function NavBar({ bookingUrl }: { bookingUrl: string }) {
  const { scrollY, scrollYProgress } = useScroll();

  // Background fades from transparent to frosted white as hero scrolls under nav
  const alpha = useTransform(scrollY, [0, 56], [0, 0.94]);
  const bg = useMotionTemplate`rgba(255, 255, 255, ${alpha})`;

  // Shadow materialises on scroll
  const shadowAlpha = useTransform(scrollY, [0, 56], [0, 0.05]);
  const shadow = useMotionTemplate`0 1px 4px rgba(13, 13, 13, ${shadowAlpha})`;

  // Scroll progress bar — spring-smoothed for elegance
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      {/* Progress line */}
      <motion.div
        className="fixed left-0 right-0 top-0 z-[200] h-[2px] origin-left bg-[var(--measured-green)]"
        style={{ scaleX }}
      />

      <motion.header
        className="sticky top-0 z-50 border-b border-[var(--measured-border-soft)] backdrop-blur-md"
        style={{ backgroundColor: bg, boxShadow: shadow }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="font-serif text-[20px] tracking-tight text-[var(--measured-dark)]">
            CLOVE
          </div>
          <nav className="hidden items-center gap-7 md:flex">
            <a
              href="#protocol"
              className="text-[13px] font-medium text-[var(--measured-subtext)] transition-colors hover:text-[var(--measured-dark)]"
            >
              How it works
            </a>
            <a
              href="#faq"
              className="text-[13px] font-medium text-[var(--measured-subtext)] transition-colors hover:text-[var(--measured-dark)]"
            >
              FAQ
            </a>
          </nav>
          <BookNowButton url={bookingUrl} />
        </div>
      </motion.header>
    </>
  );
}
