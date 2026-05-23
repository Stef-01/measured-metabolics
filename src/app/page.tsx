import type { Metadata } from "next";
import { Landing } from "@/components/marketing/landing";

export const metadata: Metadata = {
  title: "Banksia | The clinician companion",
  description:
    "A calm dashboard for clinicians: today's case queue, patient charts, and outcomes. Built on the Sous design language, separately for clinical work.",
};

export default function HomePage() {
  return <Landing />;
}
