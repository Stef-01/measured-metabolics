import type { ReactNode } from "react";
import { PatientBottomNav } from "@/components/patient/bottom-nav";

export default function PatientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[var(--measured-cream)] pb-24">
      {children}
      <PatientBottomNav />
    </div>
  );
}
