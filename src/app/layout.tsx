import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/ui/ToastProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SecureTrack",
  description: "Track. Verify. Fix. Faster.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
