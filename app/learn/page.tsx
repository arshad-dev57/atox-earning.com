import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import SiteHeader from "@/components/marketing/SiteHeader";
import SiteFooter from "@/components/marketing/SiteFooter";
import AdSenseAd from "@/components/ads/AdSenseAd";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Investment Guides — Learn Before You Invest",
  description:
    "Free guides on investment fundamentals, how investment risk works, how returns are calculated (with real ATOX plan examples), and how to evaluate any earning opportunity and avoid scams.",
  alternates: { canonical: `${SITE_URL}/learn` },
};

const ARTICLES = [
  {
    href: "/learn/investment-basics",
    title: "Investment Basics: How Investing and Risk Work",
    description:
      "What an investment actually is, the relationship between risk and return, time horizon and compounding, and the questions to ask before committing money to any opportunity.",
  },
  {
    href: "/learn/understanding-risk",
    title: "Understanding Risk: Why You Can Lose Money",
    description:
      "The main types of risk, position sizing rules, and a worked example that calculates the real percentage return of an ATOX plan — and what that implies about risk.",
  },
  {
    href: "/learn/avoiding-scams",
    title: "Evaluating Opportunities and Avoiding Scams",
    description:
      "A practical framework for judging any earning platform: sustainability math, transparency checks, red-flag signs, and how to use ATOX's own published pages to evaluate it.",
  },
];

export default function LearnHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
            <BookOpenIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Investment Guides</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Independent, practical explanations of risk, returns and scam detection.
            Read these before you put money into any platform — including ATOX.
          </p>
        </div>

        <div className="space-y-6 mb-14">
          {ARTICLES.map((article, index) => (
            <Link
              key={article.href}
              href={article.href}
              className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 mb-1">
                Guide {index + 1}
              </p>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h2>
              <p className="text-gray-600">{article.description}</p>
            </Link>
          ))}
        </div>

        {/* Learn hub ad — between article list and related reading */}
        <AdSenseAd placementId="LEARN_HUB_MID" />

        <div className="grid sm:grid-cols-3 gap-4">
          <Link href="/fees" className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
            <p className="font-semibold text-gray-900">Fees &amp; Withdrawals →</p>
            <p className="text-sm text-gray-500 mt-1">The real numbers: prices, minimums and the 10% fee.</p>
          </Link>
          <Link href="/risk-disclosure" className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
            <p className="font-semibold text-gray-900">Risk Disclosure →</p>
            <p className="text-sm text-gray-500 mt-1">The specific risks of using this platform.</p>
          </Link>
          <Link href="/faq" className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
            <p className="font-semibold text-gray-900">FAQ →</p>
            <p className="text-sm text-gray-500 mt-1">How plans, tasks and withdrawals work in practice.</p>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}