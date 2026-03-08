import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZERO",
  description: "Immersive ZERO website + secure analytics admin platform"
};

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
