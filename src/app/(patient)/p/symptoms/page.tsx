import { HeartPulse } from "lucide-react";
import { PersonaStub } from "@/components/shared/persona-stub";

export default function PatientSymptomsPage() {
  return (
    <PersonaStub
      persona="Patient"
      title="Quick symptom check"
      blurb="Five chip-row questions. Severe answers trigger an inline escalation card with the dietitian's name and a 'Send now' CTA."
      Icon={HeartPulse}
      bullets={[
        "Nausea · Constipation · Appetite · Hypos · Meds as planned",
        "Severe → escalation card surfaces immediately",
        "Logs saved offline to localStorage; queued for sync",
      ]}
    />
  );
}
