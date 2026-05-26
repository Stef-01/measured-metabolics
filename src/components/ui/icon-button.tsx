"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/cn";

/**
 * IconButton — shared primitive for icon-only controls.
 *
 * Guarantees a 48×48 px hit area even when the visible glyph is smaller,
 * via padding on the outer element and a tightly centered icon.
 */

type Variant = "ghost" | "subtle" | "solid";
type Size = "md" | "sm";

const VARIANTS: Record<Variant, string> = {
  ghost:
    "text-[var(--measured-subtext)] hover:bg-[var(--measured-cream)] active:bg-[var(--measured-input-bg)]",
  subtle:
    "bg-[var(--measured-cream)] text-[var(--measured-dark)] hover:bg-[var(--measured-input-bg)] active:bg-[var(--measured-border-soft)]",
  solid:
    "bg-[var(--measured-green)] text-white hover:bg-[var(--measured-dark-green)]",
};

const SIZES: Record<Size, string> = {
  md: "h-12 w-12",
  sm: "h-11 w-11",
};

type MotionButtonProps = HTMLMotionProps<"button">;

export interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  keyof MotionButtonProps | "children"
> {
  "aria-label": string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  showFocusRing?: boolean;
  className?: string;
  onClick?: MotionButtonProps["onClick"];
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      children,
      variant = "ghost",
      size = "md",
      showFocusRing = true,
      className,
      disabled,
      type = "button",
      ...rest
    },
    ref,
  ) {
    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled}
        whileTap={disabled ? undefined : { scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full",
          "transition-colors duration-150",
          SIZES[size],
          VARIANTS[variant],
          disabled && "opacity-40 cursor-not-allowed",
          showFocusRing &&
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--measured-green)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--measured-cream)]",
          className,
        )}
        {...(rest as MotionButtonProps)}
      >
        {children}
      </motion.button>
    );
  },
);
