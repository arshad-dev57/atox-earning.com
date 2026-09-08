import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import { ADS_ENABLED, ADSENSE_CLIENT_ID } from "@/lib/ads";
import AdsterraSmartlink from "@/components/AdsterraSmartlink";
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
      <body className="min-h-full flex flex-col">
        {/* Google AdSense — always present so Google can verify the live site */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {children}
        <Toaster position="top-center" />
        <AdsterraSmartlink />

        {ADS_ENABLED && (
          <>
            {/* Adsterra Popunder */}
            <Script
              src="https://pl30130375.effectivecpmnetwork.com/9b/70/31/9b703119ae59c516b07fef704eede719.js"
              strategy="afterInteractive"
            />

            {/* Legacy Adsterra native/smartlink unit */}
            <Script
              src="https://pl30130376.effectivecpmnetwork.com/34fe2f29c9e1aac5ce45d112f266a216/invoke.js"
              strategy="afterInteractive"
              data-cfasync="false"
            />
            <div id="container-34fe2f29c9e1aac5ce45d112f266a216"></div>

            {/* Adsterra Native Banner */}
            <Script
              src="https://pl30130378.effectivecpmnetwork.com/cd/e2/88/cde288f0e69ef76da2f9b2dadf08213d.js"
              strategy="afterInteractive"
            />

            {/* Adsterra Socialbar */}
            <Script
              src="https://www.effectivecpmnetwork.com/ncasjz39t2?key=e7b696d54319d28034a82ec0870d6078"
              strategy="afterInteractive"
            />
          </>
        )}
      </body>
    </html>
  );
}


