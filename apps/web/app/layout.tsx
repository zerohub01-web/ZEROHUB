import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export function generateMetadata(): Metadata {
  return {
    title: "ZeroOps | Business Automation Platform",
    description: "ZeroOps automates manual business workflows. Stop doing repetitive work. Scale operations with intelligent automation, custom integrations, and enterprise-grade security.",
    alternates: { canonical: "https://zeroops.in" },
    openGraph: {
      title: "ZeroOps | Business Automation Platform",
      description: "ZeroOps automates manual business workflows. Stop doing repetitive work. Scale operations with intelligent automation, custom integrations, and enterprise-grade security.",
      url: "https://zeroops.in",
      type: "website",
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
