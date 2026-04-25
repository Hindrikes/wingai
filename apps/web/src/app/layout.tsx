import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const BASE_URL = "https://wingai-umber.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: "WingAI — AI-drivet dejtingoperativsystem", template: "%s | WingAI" },
  description: "Din personliga AI-dejtingcoach. Analyserar matcher, förbättrar dina konversationer och bokar fler dates — på svenska.",
  keywords: ["dejting", "AI", "Hinge", "Tinder", "Bumble", "Sverige", "dejtingcoach", "dating app"],
  openGraph: {
    title: "WingAI — AI-drivet dejtingoperativsystem",
    description: "Analyserar matcher, förbättrar konversationer och bokar fler dates — på svenska.",
    url: BASE_URL,
    siteName: "WingAI",
    locale: "sv_SE",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "WingAI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WingAI — AI-drivet dejtingoperativsystem",
    description: "Analyserar matcher och bokar fler dates — AI på svenska.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <body className={`${fraunces.variable} ${instrumentSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
