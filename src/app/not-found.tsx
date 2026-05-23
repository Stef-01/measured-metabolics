import Link from "next/link";
import { Stethoscope } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-[var(--banksia-cream)] flex flex-col items-center justify-center gap-5 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--banksia-green)]/10">
        <Stethoscope
          size={28}
          className="text-[var(--banksia-green)]"
          strokeWidth={1.8}
        />
      </div>
      <div className="space-y-1.5">
        <h2 className="font-serif text-lg font-semibold text-[var(--banksia-dark)]">
          Page not found
        </h2>
        <p className="text-sm text-[var(--banksia-subtext)] max-w-xs">
          That page doesn&apos;t exist. Head back to Today to keep working.
        </p>
      </div>
      <Link
        href="/today"
        className="rounded-xl bg-[var(--banksia-green)] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[var(--banksia-dark-green)]"
      >
        Back to Today
      </Link>
    </div>
  );
}
