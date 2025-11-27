// D:\HireMeAI\apps\frontend\app\candidate\layout.tsx

import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

// Import đúng component navbar + footer của candidate
import { NavbarCandidate } from "@/components/layout/navbar-candidate";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
   subsets: ["latin"],
   variable: "--font-inter",
   display: "swap",
});

export const metadata: Metadata = {
   title: "Candidate Dashboard - HireMeAI",
   description: "Manage your job applications, video interviews, and track your hiring progress",
};

export default function CandidateLayout({
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
            {/* Navbar dành riêng cho Candidate */}
            <NavbarCandidate />

            {/* Nội dung chính */}
            <main className="flex-1">
               {children}
            </main>

            {/* Footer chung */}
            <Footer />
         </body>
      </html>
   );
}