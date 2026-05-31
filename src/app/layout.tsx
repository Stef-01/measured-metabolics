import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond, Hanken_Grotesk } from "next/font/google";
import { DeviceFrame } from "@/components/shared/device-frame";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { ToastHost } from "@/components/shared/toast-host";
import { QueryProvider } from "@/lib/query/provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Measured Metabolics: Patient + Dietitian + GP, one care loop",
  description:
    "A metabolic chronic care platform. Patients capture meals and symptoms; dietitians review and plan; GPs see a 30-second sidebar, all on one Supabase data model.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://measured.vercel.app",
  ),
  openGraph: {
    title: "Measured Metabolics",
    description:
      "Metabolic chronic care made easier to deliver, easier to follow, and easier to coordinate.",
    siteName: "Measured",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Measured Metabolics",
    description:
      "Metabolic chronic care made easier to deliver, easier to follow, and easier to coordinate.",
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
        className={`${inter.variable} ${hanken.variable} ${cormorant.variable} antialiased font-sans min-h-dvh`}
      >
        <ErrorBoundary>
          <QueryProvider>
            <DeviceFrame>{children}</DeviceFrame>
          </QueryProvider>
        </ErrorBoundary>
        <ToastHost />
      </body>
    </html>
  );
}
