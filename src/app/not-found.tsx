import Link from "next/link";
import { Stethoscope } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-[var(--measured-cream)] flex flex-col items-center justify-center gap-5 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--measured-green)]/10">
        <Stethoscope
          size={28}
          className="text-[var(--measured-green)]"
          strokeWidth={1.8}
        />
      </div>
      <div className="space-y-1.5">
        <h2 className="font-serif text-[22px] leading-tight text-[var(--measured-dark)]">
          Page not found
        </h2>
        <p className="text-[13px] text-[var(--measured-subtext)] max-w-xs">
          That page doesn&apos;t exist. Pick a persona from the home screen.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-xl bg-[var(--measured-green)] px-5 py-2.5 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-[var(--measured-dark-green)]"
      >
        Home
      </Link>
    </div>
  );
}
