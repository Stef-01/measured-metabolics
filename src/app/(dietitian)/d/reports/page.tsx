import { FileText } from "lucide-react";
import { PersonaStub } from "@/components/shared/persona-stub";

export default function DietitianReportsPage() {
  return (
    <PersonaStub
      persona="Dietitian"
      title="GP report builder"
      blurb="One screen, one button. AI drafts, dietitian edits, PDF lands in the GP's MD/BP inbox."
      Icon={FileText}
      bullets={[
        "AI-drafted summary · recommendations · meal/symptom counts",
        "Edit inline, then 'Send to GP'",
        "Stage 8 wires React PDF + audit log",
      ]}
    />
  );
}
