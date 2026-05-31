import type { Metadata } from "next";
import { UpgradedLanding } from "@/components/marketing/upgraded";

export const metadata: Metadata = {
  title: "CLOVE: Specialist-Led Precision Weight Loss, Australia",
  description:
    "A specialist-clinician-led precision weight loss program. Bloods, CGM and DEXA turned into a plan built around your biology, with GLP-1 medication delivered Australia-wide.",
};

export default function HomePage() {
  return <UpgradedLanding />;
}
