import type { Metadata, Viewport } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import { DeviceFrame } from "@/components/shared/device-frame";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { ToastHost } from "@/components/shared/toast-host";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-serif",
  weight: "400",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Banksia — The Clinician Companion",
  description:
    "Banksia gives clinicians a calm, focused dashboard for patient cases, prescriptions, and outcomes. Built on the same design system as Sous, tuned for clinical work.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://banksia.vercel.app",
  ),
  openGraph: {
    title: "Banksia — The Clinician Companion",
    description:
      "A calm, focused workspace for dietitians and clinicians. Today's queue, patient cases, and outcomes — all in one place.",
    siteName: "Banksia",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Banksia — The Clinician Companion",
    description:
      "A calm, focused workspace for dietitians and clinicians. Today's queue, patient cases, and outcomes — all in one place.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${dmSerif.variable} antialiased font-sans min-h-dvh`}
      >
        <ErrorBoundary>
          <DeviceFrame>{children}</DeviceFrame>
        </ErrorBoundary>
        <ToastHost />
      </body>
    </html>
  );
}
