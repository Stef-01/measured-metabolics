import { notFound } from "next/navigation";
import { findPatient } from "@/lib/mock";
import { GpBillingCard } from "@/components/gp/cards/billing-card";

interface Props {
  params: Promise<{ patientId: string }>;
}

export default async function GpBillingPage({ params }: Props) {
  const { patientId } = await params;
  const patient = findPatient(patientId);
  if (!patient) notFound();
  return <GpBillingCard patient={patient} />;
}
