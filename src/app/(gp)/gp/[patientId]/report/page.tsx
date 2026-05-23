import { notFound } from "next/navigation";
import { findPatient } from "@/lib/mock";
import { GpReportCard } from "@/components/gp/cards/report-card";

interface Props {
  params: Promise<{ patientId: string }>;
}

export default async function GpReportPage({ params }: Props) {
  const { patientId } = await params;
  const patient = findPatient(patientId);
  if (!patient) notFound();
  return <GpReportCard patient={patient} />;
}
