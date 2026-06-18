import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "MComSpin — Business Engagement & Monetization Infrastructure",
  description: "Controlled gamification infrastructure for lead generation, partner rotation, reward distribution, and collaborative commerce. Enterprise-grade engagement automation.",
  keywords: "business engagement, gamification infrastructure, lead generation, partner rotation, collaborative commerce, reward distribution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased scroll-smooth ${inter.variable}`}
    >
      <body className="min-h-full flex flex-col bg-surface text-on-surface font-body">{children}</body>
    </html>
  );
}
