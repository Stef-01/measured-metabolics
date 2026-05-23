import { LayoutDashboard } from "lucide-react";
import { PersonaStub } from "@/components/shared/persona-stub";

export default function DietitianDashboardPage() {
  return (
    <PersonaStub
      persona="Dietitian"
      title="Today"
      blurb="Active patient count, awaiting-review count, severe-symptom flags, today's session list."
      Icon={LayoutDashboard}
      bullets={[
        "4 KPI cards: active patients · meals waiting · severe flags · sessions today",
        "Patients flagged this morning surface above the fold",
        "Single primary CTA: 'Open meal review queue'",
      ]}
    />
  );
}
