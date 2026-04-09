import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope, Syne } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { GoogleAnalytics } from "../components/GoogleAnalytics";
import { LazyLeadCaptureWidget } from "../components/chatbot/LazyLeadCaptureWidget";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap"
});

export function generateMetadata(): Metadata {
  return {
    title: "Affordable Web Development & Automated Websites | ZeroOps Bangalore",
    description: "ZeroOps delivers highly secure, affordable web development for small businesses. We engineer zero-maintenance Next.js websites with enterprise-grade automation.",
    keywords: [
      "digital marketing automation",
      "lead generation system",
      "business automation services",
      "website development Bangalore",
      "conversion optimization"
    ],
    metadataBase: new URL("https://zeroops.in"),
    alternates: { canonical: "https://zeroops.in" },
    openGraph: {
      title: "ZeroOps | Business Automation Platform",
      description: "ZeroOps automates manual business workflows. Stop doing repetitive work. Scale operations with intelligent automation, custom integrations, and enterprise-grade security.",
      url: "https://zeroops.in",
      type: "website",
      siteName: "ZERO",
      images: [{ url: "https://zeroops.in/logo.png" }]
    },
    twitter: {
      card: "summary_large_image",
      title: "ZeroOps | Business Automation Platform",
      description: "ZeroOps automates manual business workflows. Stop doing repetitive work. Scale operations with intelligent automation, custom integrations, and enterprise-grade security.",
      images: ["https://zeroops.in/logo.png"]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      }
    }
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";

  return (
    <html lang="en">
      <body className={`${manrope.variable} ${syne.variable} ${jetBrainsMono.variable}`}>
        <GoogleAnalytics measurementId={measurementId} />
        {children}
        <LazyLeadCaptureWidget />
        <Toaster position="bottom-right" toastOptions={{ className: 'soft-card font-sans text-sm', duration: 4000 }} />
      </body>
    </html>
  );
}
