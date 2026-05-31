import type { Metadata } from "next";
import { UpgradedLanding } from "@/components/marketing/upgraded";

export const metadata: Metadata = {
  title: "CLOVE: Specialist-Led Precision Weight Loss, Australia",
  description:
    "The only weight-loss program that reads your bloods, glucose and body composition together, so you lose fat, not muscle. Specialist-clinician-led, medication delivered Australia-wide.",
};

export default function HomePage() {
  return <UpgradedLanding />;
}
