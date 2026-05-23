import { Users } from "lucide-react";
import { PersonaStub } from "@/components/shared/persona-stub";

export default function DietitianPatientsPage() {
  return (
    <PersonaStub
      persona="Dietitian"
      title="Patient panel"
      blurb="Your active caseload. Filter by risk, cuisine, GP. Tap to open patient detail."
      Icon={Users}
      bullets={[
        "Filter chips: risk · cuisine · GP · review status",
        "Row: name · age · conditions · risk · last meal · last symptom",
        "Severe-symptom rows pinned to top until acknowledged",
      ]}
    />
  );
}
