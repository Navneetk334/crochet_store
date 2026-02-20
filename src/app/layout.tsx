import type { Metadata } from "next";
import { Playfair_Display, Inter, Dancing_Script } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-script",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Caught Craft Handed | Premium Handcrafted Crochet",
  description: "Discover a curated collection of artisanal, hand-stitched crochet pieces. From home decor to sustainable fashion, every loop tells a story of patience and artistry.",
  keywords: ["crochet", "handcrafted", "artisanal", "sustainable fashion", "home decor", "handmade india"],
  openGraph: {
    title: "Caught Craft Handed",
    description: "Woven with Love, Handed with Care.",
    images: ["/og-image.jpg"],
  },
};

import ClientLayout from "@/components/ClientLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${inter.variable} ${dancingScript.variable} antialiased selection:bg-sage selection:text-white`} suppressHydrationWarning>
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
