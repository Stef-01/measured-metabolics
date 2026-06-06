import type { Metadata } from "next";
import { UpgradedLanding } from "@/components/marketing/upgraded";

export const metadata: Metadata = {
  // Absolute title so the homepage stays the brand line (not "<page> · CLOVE").
  title: {
    absolute: "CLOVE: Specialist-Led Precision Weight Loss, Australia",
  },
  description:
    "The only weight-loss program that reads your bloods, glucose and body composition together, so you lose fat, not muscle. Specialist-clinician-led, medication delivered Australia-wide.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <UpgradedLanding />;
}
