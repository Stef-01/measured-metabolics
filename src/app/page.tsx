import type { Metadata } from "next";
import { UpgradedLanding } from "@/components/marketing/upgraded";

export const metadata: Metadata = {
  title: "Measured — Precision Metabolic Medicine, Australia",
  description:
    "Pathology-validated testing, CGM-guided GLP-1 therapy, and a doctor who turns your data into a plan built around the life you actually live — medication delivered, Australia-wide.",
};

export default function HomePage() {
  return <UpgradedLanding />;
}
