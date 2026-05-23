import { Inbox } from "lucide-react";
import { PersonaStub } from "@/components/shared/persona-stub";

export default function DietitianReferralsPage() {
  return (
    <PersonaStub
      persona="Dietitian"
      title="Referral inbox"
      blurb="GP referrals waiting to be accepted or assigned. Priority-sorted with consent status badges."
      Icon={Inbox}
      bullets={[
        "Each row: patient · GP · conditions · cuisine · priority chip",
        "Accept → patient moves into your panel; Assign → re-routes",
        "Consent-pending rows blocked from acceptance",
      ]}
    />
  );
}
