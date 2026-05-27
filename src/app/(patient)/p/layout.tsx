import type { ReactNode } from "react";
import { PatientBottomNav } from "@/components/patient/bottom-nav";
import { PersonaSwitcher } from "@/components/shared/persona-switcher";
import { PageTransition } from "@/components/shared/page-transition";

export default function PatientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[var(--measured-cream)] pb-24">
      <PageTransition>{children}</PageTransition>
      <PersonaSwitcher active="patient" variant="floating" />
      <PatientBottomNav />
    </div>
  );
}
