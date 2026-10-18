import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheckIcon,
  LightBulbIcon,
  UserGroupIcon,
  ChartBarIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";
import SiteHeader from "@/components/marketing/SiteHeader";
import SiteFooter from "@/components/marketing/SiteFooter";
import AdSenseAd from "@/components/ads/AdSenseAd";
import { SITE_URL, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn what ATOX Investment Platform is, what services it actually provides (investment plans with daily tasks, Watch and Earn, referrals, and data & airtime), who runs support, and how we treat risk and transparency.",
  alternates: { canonical: `${SITE_URL}/about` },
};

const coreValues = [
  {
    title: "Honesty",
    description:
      "We publish what our plans cost, what they state they pay, and the fees that apply — so you can decide with full information.",
    icon: ScaleIcon,
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Clarity",
    description:
      "Plan terms, withdrawal rules and risks are written in plain language on public pages, not hidden in small print.",
    icon: LightBulbIcon,
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "Accountability",
    description:
      "Every deposit and withdrawal on the platform is reviewed and recorded, and support handles disputes by email.",
    icon: ShieldCheckIcon,
    color: "from-red-500 to-rose-600",
  },
  {
    title: "User Focus",
    description:
      "The dashboard is built so users can track plans, daily tasks, balances and transaction history themselves.",
    icon: UserGroupIcon,
    color: "from-purple-500 to-purple-700",
  },
  {
    title: "Continuous Improvement",
    description:
      "We keep improving the platform's tools — from task tracking to data and airtime top-ups — based on user feedback.",
    icon: ChartBarIcon,
    color: "from-amber-500 to-orange-600",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full">
        {/* Hero */}
        <section className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
            About ATOX Investment Platform
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            A Digital Platform for Plans, Tasks &amp; Top-Ups
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ATOX Investment Platform is a Nigeria-focused digital service where
            registered users can activate investment plans that require daily
            ad-watching tasks, use the Watch and Earn programme, earn referral
            bonuses, and purchase mobile data and airtime from a single dashboard.
          </p>
        </section>

        {/* What the platform actually is */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              What ATOX Actually Provides
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-gray-700 leading-relaxed">
              <p>
                <strong className="text-gray-900">Investment plans.</strong> Users can
                activate a VIP plan by paying its published price. Each plan specifies a
                term (for example, 15 or 30 days), a number of daily ad tasks, and a
                stated daily income. Income is credited to the user&apos;s balance only
                on days when the daily tasks are completed.
              </p>
              <p>
                <strong className="text-gray-900">Watch and Earn.</strong> Users without
                an active plan can watch short advertisements and earn ₦10 per completed
                video. This programme exists for users who want to try the platform
                without buying a plan.
              </p>
              <p>
                <strong className="text-gray-900">Referrals.</strong> Registered users
                receive an invitation code they can share. When a new user registers
                with that code, referral rewards may be credited according to the
                programme rules shown in the dashboard.
              </p>
              <p>
                <strong className="text-gray-900">Data &amp; airtime.</strong> Wallet
                balances can be used to buy data bundles and airtime for MTN, Airtel,
                Glo and 9mobile from inside the dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 border border-emerald-100">
            <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">🎯</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To give everyday users in Nigeria straightforward access to digital
              earning tools — plans with clear terms, honest fee information, and
              self-service account management — while treating risk and transparency
              as first-class responsibilities.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">👁️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To become a well-regarded digital earning and investment platform in
              Nigeria, known for publishing clear terms, processing withdrawals
              consistently, and helping users make informed decisions about risk.
            </p>
          </div>
        </section>

        {/* Why choose — concrete and verifiable */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">
            What You Can Verify for Yourself
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Plan prices, terms and stated income are published publicly and shown again in your dashboard before purchase.",
              "Withdrawal rules — ₦2,000 minimum and a 10% processing fee — are published on our Fees page.",
              "Deposits and withdrawals are reviewed and recorded; your history is visible in your dashboard.",
              "Risk information is published up front on our Risk Disclosure page, not buried in an appendix.",
              `Support is reachable by email at ${SUPPORT_EMAIL} and common questions are answered in the FAQ.`,
              "Registration is free and no payment is required to create an account.",
            ].map((point, index) => (
              <div key={index} className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-100">
                <span className="text-emerald-600 text-lg flex-shrink-0 mt-0.5">✓</span>
                <p className="text-gray-700 font-medium">{point}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About ad — after verified-platform content */}
        <AdSenseAd placementId="BELOW_ABOUT" />

        {/* Core Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {coreValues.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col items-center text-center">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center shadow-lg mb-5`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-gray-900">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Transparency CTA */}
        <section>
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Read Before You Participate</h2>
            <p className="text-emerald-100 max-w-2xl mx-auto mb-8 leading-relaxed">
              We encourage every visitor to read the fees, terms and risk disclosure
              before creating an account or activating a plan. If anything is unclear,
              contact support first — investing always carries risk.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/risk-disclosure"
                className="px-8 py-4 bg-white text-emerald-600 hover:bg-gray-100 transition-all font-bold rounded-2xl shadow-lg text-lg"
              >
                Risk Disclosure
              </Link>
              <Link
                href="/fees"
                className="px-8 py-4 bg-emerald-700 text-white hover:bg-emerald-800 transition-all font-bold rounded-2xl shadow-lg text-lg"
              >
                Fees &amp; Withdrawals
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-emerald-800/60 text-white hover:bg-emerald-800 transition-all font-bold rounded-2xl shadow-lg text-lg"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}