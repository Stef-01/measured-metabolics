import { User } from "lucide-react";
import { PersonaStub } from "@/components/shared/persona-stub";

export default function GpContextPage() {
  return (
    <PersonaStub
      persona="GP"
      title="Patient context"
      blurb="30-second read. Last A1c, weight delta, time-in-range, dietitian's pattern summary."
      Icon={User}
      bullets={[
        "3 numeric tiles: A1c · weight · TIR%",
        "Pattern summary (3 bullets) from latest dietitian review",
        "Symptom flags float to the top if severe",
      ]}
    />
  );
}
