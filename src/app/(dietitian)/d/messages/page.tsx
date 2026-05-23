import { MessageSquare } from "lucide-react";
import { PersonaStub } from "@/components/shared/persona-stub";

export default function DietitianMessagesPage() {
  return (
    <PersonaStub
      persona="Dietitian"
      title="Composer"
      blurb="Threads with patients. Severe-symptom escalations float to the top until you reply."
      Icon={MessageSquare}
      bullets={[
        "Left: thread list, severe rows pinned",
        "Right: composer with templated phrases (Stage 6)",
        "All sends audited",
      ]}
    />
  );
}
