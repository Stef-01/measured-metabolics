import { MessageCircle } from "lucide-react";
import { PersonaStub } from "@/components/shared/persona-stub";

export default function PatientMessagesPage() {
  return (
    <PersonaStub
      persona="Patient"
      title="Messages"
      blurb="One thread with your dietitian. No general chatbot. Replies show name + credential."
      Icon={MessageCircle}
      bullets={[
        "Thread bubbles, Maya Singh APD signed",
        "Severe-symptom triage card surfaces a 'Reply now' CTA",
        "Stage 6 swaps localStorage for Supabase Realtime",
      ]}
    />
  );
}
