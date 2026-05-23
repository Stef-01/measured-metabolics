import { Home } from "lucide-react";
import { PersonaStub } from "@/components/shared/persona-stub";

export default function PatientHomePage() {
  return (
    <PersonaStub
      persona="Patient"
      title="Home"
      blurb="One-card today screen. Single primary action: snap your next meal."
      Icon={Home}
      bullets={[
        "Streak / week number, latest dietitian note",
        "Single primary CTA: 'Snap a meal'",
        "Below-fold: today's plan preview, weekly trend ring, message tease",
      ]}
    />
  );
}
