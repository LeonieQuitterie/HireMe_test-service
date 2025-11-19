import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { NavbarCandidate } from "@/components/layout/navbar-candidate";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Interview Manager - Video Interview Platform",
  description: "Professional video interview management and evaluation platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <NavbarCandidate />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
