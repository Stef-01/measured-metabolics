import { ClipboardList } from "lucide-react";
import { PersonaStub } from "@/components/shared/persona-stub";

export default function GpCarePlanPage() {
  return (
    <PersonaStub
      persona="GP"
      title="Care plan"
      blurb="Problems · goals · team · review date. Prefilled from the patient's record; export to PDF or paste into MD/BP."
      Icon={ClipboardList}
      bullets={[
        "Editable lists with one-click 'Add common problem'",
        "Suggests linking to billing item if eligible",
        "Stage 8 emits PDF",
      ]}
    />
  );
}
