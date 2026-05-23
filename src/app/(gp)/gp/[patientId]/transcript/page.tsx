import { notFound } from "next/navigation";
import { findPatient } from "@/lib/mock";
import { GpTranscriptCard } from "@/components/gp/cards/transcript-card";

interface Props {
  params: Promise<{ patientId: string }>;
}

export default async function GpTranscriptPage({ params }: Props) {
  const { patientId } = await params;
  const patient = findPatient(patientId);
  if (!patient) notFound();
  return <GpTranscriptCard patient={patient} />;
}
