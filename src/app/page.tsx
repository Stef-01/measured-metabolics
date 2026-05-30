import type { Metadata } from "next";
import { DoctorLanding } from "@/components/marketing/doctor-landing";

export const metadata: Metadata = {
  title: "Measured Metabolics — Concierge Metabolic Care",
  description:
    "Physician-led, personalised metabolic care. CGM-monitored GLP-1 therapy, bespoke meal planning, and DEXA body composition — a structured six-month protocol with Dr Anubhav Saxena.",
};

export default function HomePage() {
  return <DoctorLanding />;
}
