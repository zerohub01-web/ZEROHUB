import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export function generateMetadata(): Metadata {
  return {
    title: "Affordable Web Development & Automated Websites | ZeroOps Bangalore",
    description: "ZeroOps delivers highly secure, affordable web development for small businesses. Founded by Nishanth Raj S, we engineer zero-maintenance Next.js websites.",
    alternates: { canonical: "https://zeroops.in" },
    openGraph: {
      title: "Affordable Web Development & Automated Websites | ZeroOps",
      description: "Enterprise-grade Next.js web applications tailored for small businesses. Automation-first, zero-maintenance, affordable pricing.",
      url: "https://zeroops.in",
      type: "website",
      images: [{ url: "https://zeroops.in/og-image.jpg" }]
    },
    twitter: {
      card: "summary_large_image",
      title: "Affordable Web Development | ZeroOps",
      description: "Enterprise-grade Next.js web applications tailored for small businesses. Automation-first, zero-maintenance, affordable pricing.",
      images: ["https://zeroops.in/og-image.jpg"]
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="bottom-right" toastOptions={{ className: 'soft-card font-sans text-sm', duration: 4000 }} />
      </body>
    </html>
  );
}
