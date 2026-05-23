import { Send } from "lucide-react";
import { PersonaStub } from "@/components/shared/persona-stub";

export default function GpReferralPage() {
  return (
    <PersonaStub
      persona="GP"
      title="Refer to dietitian"
      blurb="2-minute referral. Reason · cuisine · priority. Consent prompt sent to patient as SMS. Auto-routes to dietitian panel."
      Icon={Send}
      bullets={[
        "Pre-filled with conditions and meds from context",
        "Cuisine + priority chips",
        "Consent SMS preview before send",
      ]}
    />
  );
}
