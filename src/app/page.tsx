import type { Metadata } from "next";
import { DoctorLanding } from "@/components/marketing/doctor-landing";

export const metadata: Metadata = {
  title: "Dr Anubhav Saxena — Health Optimisation Protocol",
  description:
    "A medically supervised 6-month metabolic health program. GLP-1 therapy, DEXA body composition scanning, and personalised dietitian meal planning. Book via HealthEngine.",
};

export default function HomePage() {
  return <DoctorLanding />;
}
