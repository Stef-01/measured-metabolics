"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Measured] Global error:", error);
  }, [error]);

  const router = useRouter();

  return (
    <div className="min-h-dvh bg-[var(--measured-cream)] flex flex-col items-center justify-center gap-5 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--measured-evaluate)]/10">
        <AlertTriangle
          size={28}
          className="text-[var(--measured-evaluate)]"
          strokeWidth={1.8}
        />
      </div>
      <div className="space-y-1.5">
        <h2 className="font-serif text-[22px] leading-tight text-[var(--measured-dark)]">
          Something went wrong
        </h2>
        <p className="text-[13px] text-[var(--measured-subtext)] max-w-xs">
          An unexpected error occurred. Try again or head back to the home
          screen.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-xl border border-[var(--measured-border)] bg-white px-5 py-2.5 text-[13px] font-medium text-[var(--measured-dark)] shadow-[var(--shadow-card)] transition-colors hover:bg-[var(--measured-cream)]"
          type="button"
        >
          Try again
        </button>
        <button
          onClick={() => router.push("/")}
          className="rounded-xl bg-[var(--measured-green)] px-5 py-2.5 text-[13px] font-medium text-white shadow-[var(--shadow-card)] transition-colors hover:bg-[var(--measured-dark-green)]"
          type="button"
        >
          Home
        </button>
      </div>
    </div>
  );
}
