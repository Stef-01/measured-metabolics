import { Receipt } from "lucide-react";
import { PersonaStub } from "@/components/shared/persona-stub";

export default function GpBillingPage() {
  return (
    <PersonaStub
      persona="GP"
      title="Billing"
      blurb="Eligibility hints (CDM, GPMP, TCA, MHCP). Ranked by likelihood; each item explains the rationale and what's still needed."
      Icon={Receipt}
      bullets={[
        "MBS items as suggestions, never auto-claimed",
        "Each item: rationale, missing data, confidence",
        "Audit logged when an item is copied",
      ]}
    />
  );
}
