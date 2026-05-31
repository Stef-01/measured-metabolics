import type { Metadata } from "next";
import { Landing } from "@/components/marketing/landing";

export const metadata: Metadata = {
  title: "CLOVE Platform Demo",
  description:
    "Three minimal interfaces, one clinical brain. Pick a persona to enter the demo.",
};

export default function DemoPage() {
  return <Landing />;
}
