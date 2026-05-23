import { notFound } from "next/navigation";
import { findPatient } from "@/lib/mock";
import { GpContextCard } from "@/components/gp/cards/context-card";

interface Props {
  params: Promise<{ patientId: string }>;
}

export default async function GpContextPage({ params }: Props) {
  const { patientId } = await params;
  const patient = findPatient(patientId);
  if (!patient) notFound();
  return <GpContextCard patient={patient} />;
}
