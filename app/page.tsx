import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import HomeClient from "@/components/home/HomeClient";

export const metadata: Metadata = {
  title: "ATOX Investment Platform — Investment Plans, Watch & Earn, Data & Airtime",
  description:
    "ATOX is a Nigerian digital platform where users activate tiered investment plans, complete daily ad-watching tasks, earn referral bonuses, or use Watch and Earn without a plan. Published fees: ₦2,000 minimum withdrawal with a 10% processing fee. Investing involves risk.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "ATOX Investment Platform",
    description:
      "Investment plans with daily tasks, Watch and Earn, referrals, and mobile data and airtime top-ups. Review fees and risk disclosure before investing.",
    url: SITE_URL,
    siteName: "ATOX Investment Platform",
    type: "website",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ATOX Investment Platform",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.jpg`,
  email: "support@atoxinvestmentplatform.com",
  description:
    "Digital platform offering tiered investment plans with daily tasks, a Watch and Earn programme, referral bonuses, and mobile data and airtime top-ups in Nigeria.",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ATOX Investment Platform",
  url: SITE_URL,
  publisher: { "@type": "Organization", name: "ATOX Investment Platform" },
};

/**
 * The homepage is a server component so the real marketing content and
 * metadata are present in the server-rendered HTML that crawlers fetch.
 * Interactive behaviour (auth redirect, buttons) lives in HomeClient,
 * which renders all content immediately instead of gating it behind a
 * loading spinner.
 */
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HomeClient />
    </>
  );
}