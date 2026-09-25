import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import { ADS_ENABLED, ADSENSE_CLIENT_ID } from "@/lib/ads";
import AdsterraSmartlink from "@/components/AdsterraSmartlink";
import AdSenseScript from "@/components/AdSenseScript";
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
  title: "ATOX Investment Platform",
  description: "A modern digital investment platform for secure, transparent, and accessible investment opportunities.",
  other: {
    "google-adsense-account": ADSENSE_CLIENT_ID,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Google AdSense account ID for verification */}
        <AdSenseScript />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-center" />
        <AdsterraSmartlink />
      </body>
    </html>
  );
}


