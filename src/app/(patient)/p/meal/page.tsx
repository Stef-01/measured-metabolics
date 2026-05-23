import { Camera } from "lucide-react";
import { PersonaStub } from "@/components/shared/persona-stub";

export default function PatientMealPage() {
  return (
    <PersonaStub
      persona="Patient"
      title="Add a meal"
      blurb="Camera or library upload, optional note, optional CGM context. Saves locally, syncs once Stage 6 wires Supabase Storage."
      Icon={Camera}
      bullets={[
        "Inline camera viewport (Stage 2 will use getUserMedia + canvas capture)",
        "Optional 1-line note + meal type pill row",
        "Saves to localStorage during vibe stages",
      ]}
    />
  );
}
