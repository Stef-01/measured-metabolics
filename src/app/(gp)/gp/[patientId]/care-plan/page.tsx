import { notFound } from "next/navigation";
import { findPatient } from "@/lib/mock";
import { GpCarePlanCard } from "@/components/gp/cards/care-plan-card";

interface Props {
  params: Promise<{ patientId: string }>;
}

export default async function GpCarePlanPage({ params }: Props) {
  const { patientId } = await params;
  const patient = findPatient(patientId);
  if (!patient) notFound();
  return <GpCarePlanCard patient={patient} />;
}
