import { FileText } from "lucide-react";
import { PersonaStub } from "@/components/shared/persona-stub";

export default function GpTranscriptPage() {
  return (
    <PersonaStub
      persona="GP"
      title="Transcript"
      blurb="Paste a consultation transcript. AI returns subjective / objective / assessment / plan ready to drop into MD or BP."
      Icon={FileText}
      bullets={[
        "Textarea + Analyze button",
        "SOAP draft with confidence pills",
        "Stage 7 worker turns this real",
      ]}
    />
  );
}
