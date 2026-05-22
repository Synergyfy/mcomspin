import type { Metadata } from "next";
import "./globals.css";

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
      className="h-full antialiased scroll-smooth"
    >
      <body className="min-h-full flex flex-col bg-white text-[#1a1a1a]">{children}</body>
    </html>
  );
}
