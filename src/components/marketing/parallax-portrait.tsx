"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface ParallaxPortraitProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
}

export function ParallaxPortrait({
  src,
  alt,
  sizes,
  priority,
}: ParallaxPortraitProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Subtle ±22px vertical drift as the section scrolls through view
  const y = useTransform(scrollYProgress, [0, 1], [-22, 22]);

  return (
    <div
      ref={ref}
      className="relative h-[280px] w-full overflow-hidden rounded-2xl shadow-[0_8px_48px_-8px_rgba(0,0,0,0.14)] md:h-[400px] md:w-[300px]"
    >
      {/* Slightly oversized wrapper so parallax never shows gaps at edges */}
      <motion.div className="absolute -inset-y-8 inset-x-0" style={{ y }}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          style={{ objectPosition: "50% 30%" }}
          sizes={sizes}
          priority={priority}
        />
      </motion.div>
    </div>
  );
}
