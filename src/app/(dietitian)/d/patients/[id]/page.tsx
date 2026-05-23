import { notFound } from "next/navigation";
import { findPatient } from "@/lib/mock";
import { DietitianPatientDetailScreen } from "@/components/dietitian/screens/patient-detail-screen";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientDetailPage({ params }: PageProps) {
  const { id } = await params;
  const patient = findPatient(id);
  if (!patient) notFound();
  return <DietitianPatientDetailScreen patient={patient} />;
}
