import { Activity } from "lucide-react";
import { PersonaStub } from "@/components/shared/persona-stub";

export default function PatientMetricsPage() {
  return (
    <PersonaStub
      persona="Patient"
      title="Metrics"
      blurb="Glucose, weight, symptom trend across 14 days. Recharts area + line + dots. CGM band shaded."
      Icon={Activity}
      bullets={[
        "Tabs: Glucose · Weight · Symptoms",
        "Time-in-range donut summary up top",
        "Tap a spike → linked meal photo opens",
      ]}
    />
  );
}
