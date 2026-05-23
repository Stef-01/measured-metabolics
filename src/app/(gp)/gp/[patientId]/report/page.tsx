import { FileChartColumn } from "lucide-react";
import { PersonaStub } from "@/components/shared/persona-stub";

export default function GpReportPage() {
  return (
    <PersonaStub
      persona="GP"
      title="Dietitian report"
      blurb="The 30-second read. Latest dietitian summary, recommendations, and counts. Open the PDF or jump straight to billing."
      Icon={FileChartColumn}
      bullets={[
        "1 paragraph summary, 3 bullet recommendations",
        "Inline meal-uploaded / symptom-logged counts",
        "Buttons: Open PDF · Add to billing",
      ]}
    />
  );
}
