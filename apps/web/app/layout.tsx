import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZERO",
  description: "Immersive ZERO website + secure analytics admin platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
