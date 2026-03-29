import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Private Jet Charter Directory | Global Routes & Airports | AeroElite",
  description: "Discover 10,000+ private jet routes across Asia, Europe & US. Instant quotes, premium aircraft, and seamless travel experiences. 24/7 availability.",
  keywords: ["private jet charter", "private aviation", "jet charter", "private flights"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
