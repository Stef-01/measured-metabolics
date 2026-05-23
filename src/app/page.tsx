import type { Metadata } from "next";
import { Landing } from "@/components/marketing/landing";

export const metadata: Metadata = {
  title: "Measured Metabolics",
  description:
    "Three minimal interfaces, one clinical brain. Pick a persona to enter the demo.",
};

export default function HomePage() {
  return <Landing />;
}
