import { notFound } from "next/navigation";
import { findPatient } from "@/lib/mock";
import { GpReferralCard } from "@/components/gp/cards/referral-card";

interface Props {
  params: Promise<{ patientId: string }>;
}

export default async function GpReferralPage({ params }: Props) {
  const { patientId } = await params;
  const patient = findPatient(patientId);
  if (!patient) notFound();
  return <GpReferralCard patient={patient} />;
}
