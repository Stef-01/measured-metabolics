import { DietitianComposerScreen } from "@/components/dietitian/screens/messages-screen";

export default async function DietitianMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ patient?: string }>;
}) {
  const { patient } = await searchParams;
  return <DietitianComposerScreen initialPatientId={patient} />;
}
