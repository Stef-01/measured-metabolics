import { User } from "lucide-react";
import { PersonaStub } from "@/components/shared/persona-stub";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientDetailPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <PersonaStub
      persona="Dietitian"
      title={`Patient · ${id}`}
      blurb="Tabs: Overview · CGM + Meals · Plan · Reports · Messages. Built in Week 4."
      Icon={User}
      bullets={[
        "Header: name · age · conditions · last reviewed",
        "Tabs persist their scroll position across visits",
        "Plan tab launches the Plan Builder modal",
      ]}
    />
  );
}
