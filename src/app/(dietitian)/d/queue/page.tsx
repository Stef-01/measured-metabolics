import { ClipboardCheck } from "lucide-react";
import { PersonaStub } from "@/components/shared/persona-stub";

export default function DietitianQueuePage() {
  return (
    <PersonaStub
      persona="Dietitian"
      title="Meal review queue"
      blurb="The work surface of the platform. Five meals reviewed in under five minutes via keyboard shortcuts."
      Icon={ClipboardCheck}
      bullets={[
        "Left: queue of pending meals (chronological, severity-pinned)",
        "Right: photo · AI summary · CGM context · quick-edit nutrition",
        "Shortcuts: A approve · E edit · F flag · M message · N next",
      ]}
    />
  );
}
