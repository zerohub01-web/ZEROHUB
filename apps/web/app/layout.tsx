import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { FloatingCTA } from "../components/FloatingCTA";

export const metadata: Metadata = {
  title: "ZERO | Business Automation Systems & SaaS OS",
  description: "We replace manual business work with automated systems. High-performance websites, secure admin dashboards, and decision-grade analytics for growth teams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://www.zeroops.in" />
      </head>
      <body>
        {children}
        <FloatingCTA />
        <Toaster position="bottom-right" toastOptions={{ className: 'soft-card font-sans text-sm', duration: 4000 }} />
      </body>
    </html>
  );
}
