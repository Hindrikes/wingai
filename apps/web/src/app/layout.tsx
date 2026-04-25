import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WingAI — AI-drivet dejtingoperativsystem",
  description:
    "Din personliga AI-dejtingcoach. Analyserar matcher, förbättrar dina konversationer och bokar fler dates — på svenska.",
  keywords: ["dejting", "AI", "Hinge", "Tinder", "Sverige", "dejtingcoach"],
  openGraph: {
    title: "WingAI",
    description: "AI-drivet dejtingoperativsystem för den svenska marknaden",
    locale: "sv_SE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
