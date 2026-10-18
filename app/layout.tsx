import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ADSENSE_CLIENT_ID } from "@/lib/ads";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import SiteAds from "@/components/SiteAds";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Investment Plans, Watch & Earn, Data & Airtime`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "ATOX Investment Platform offers tiered investment plans with daily tasks, a Watch and Earn programme, referral bonuses, and mobile data and airtime top-ups in Nigeria. Review our fees, risk disclosure and terms before investing.",
  applicationName: SITE_NAME,
  other: {
    // Site verification for the existing AdSense publisher account.
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
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-center" />

        {/*
          All advertising scripts (Google AdSense + Adsterra units) load through
          this single route-aware component. It renders nothing on login,
          registration, dashboard, admin, Watch and Earn, plan/redirect, API and
          error screens — see components/SiteAds.tsx and lib/ad-eligibility.ts.
        */}
        <SiteAds />
      </body>
    </html>
  );
}


