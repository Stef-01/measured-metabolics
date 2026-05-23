import { CalendarDays } from "lucide-react";
import { PersonaStub } from "@/components/shared/persona-stub";

export default function PatientPlanPage() {
  return (
    <PersonaStub
      persona="Patient"
      title="Today's plan"
      blurb="Breakfast / lunch / dinner / snack with one rationale line each. Tap a meal to open its recipe card."
      Icon={CalendarDays}
      bullets={[
        "4 meal cards: title + one-line dietitian rationale",
        "Approved-by stamp: when a dietitian last signed off",
        "Recipe card opens at /p/plan/[slug]",
      ]}
    />
  );
}
