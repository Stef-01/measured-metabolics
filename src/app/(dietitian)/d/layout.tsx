import type { ReactNode } from "react";
import { DietitianSideNav } from "@/components/dietitian/side-nav";
import { PageTransition } from "@/components/shared/page-transition";

export default function DietitianLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[var(--measured-cream)]">
      <DietitianSideNav />
      <main className="ml-[240px] min-h-dvh px-8 py-8">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
