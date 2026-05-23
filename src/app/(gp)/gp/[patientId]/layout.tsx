import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { findPatient } from "@/lib/mock/patients";
import { GpSidebarShell } from "@/components/gp/sidebar-shell";

interface Props {
  params: Promise<{ patientId: string }>;
  children: ReactNode;
}

export default async function GpPatientLayout({ params, children }: Props) {
  const { patientId } = await params;
  const patient = findPatient(patientId);
  if (!patient) notFound();
  return (
    <div className="min-h-dvh bg-[var(--measured-cream)]">
      <GpSidebarShell patient={patient}>{children}</GpSidebarShell>
    </div>
  );
}
