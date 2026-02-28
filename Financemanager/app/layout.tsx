import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinAI.io — AI Finance Manager",
  description: "AI-powered personal finance dashboard with intelligent insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased bg-background text-foreground`}>
        <div className="app-shell">
          <Sidebar />
          <main className="app-main">
            <div className="app-content">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
