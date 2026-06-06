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

const SITE_DESCRIPTION =
  "Specialist-led precision weight loss. CLOVE reads your bloods, glucose and body composition together, so you lose fat, not muscle. Medication delivered Australia-wide.";

export const metadata: Metadata = {
  title: {
    default: "CLOVE: Specialist-Led Precision Weight Loss, Australia",
    template: "%s · CLOVE",
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://measured.vercel.app",
  ),
  applicationName: "CLOVE",
  keywords: [
    "weight loss",
    "precision medicine",
    "GLP-1",
    "telehealth",
    "metabolic health",
    "DEXA",
    "CGM",
    "Australia",
  ],
  openGraph: {
    title: "CLOVE: Specialist-Led Precision Weight Loss",
    description: SITE_DESCRIPTION,
    siteName: "CLOVE",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: "/landing/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CLOVE: specialist-led precision weight loss, Australia-wide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CLOVE: Specialist-Led Precision Weight Loss",
    description: SITE_DESCRIPTION,
    images: ["/landing/og-image.jpg"],
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
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-black focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
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
