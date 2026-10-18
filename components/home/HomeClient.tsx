"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  ChartBarIcon,
  DevicePhoneMobileIcon,
  PlayIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { PLANS } from "@/lib/plans";
import SiteHeader from "@/components/marketing/SiteHeader";
import SiteFooter from "@/components/marketing/SiteFooter";
import AdBanner from "@/components/AdBanner";
import AdSenseAd from "@/components/ads/AdSenseAd";

const formatNaira = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);

const STEPS = [
  {
    title: "Create a free account",
    body: "Register with your name, email, Nigerian phone number and a password. Each person may register one account.",
  },
  {
    title: "Fund your wallet",
    body: "Transfer to the bank account shown in your dashboard, then upload your payment screenshot. Support confirms the deposit before your balance is credited.",
  },
  {
    title: "Activate a plan and do daily tasks",
    body: "Buy a VIP plan and watch the required number of ads each day. Plan income is credited to your balance only on days when the daily tasks are completed.",
  },
  {
    title: "Withdraw your balance",
    body: "Request a withdrawal from your dashboard once your balance reaches ₦2,000. A 10% processing fee applies and requests are reviewed before payment.",
  },
];

export default function HomeClient() {
  const router = useRouter();

  // Auth redirect runs in the background — the marketing content below renders
  // immediately (including in the server-rendered HTML that search engines
  // fetch), so the landing page always contains real publisher content.
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        router.push(userDoc.exists() && userDoc.data().isAdmin ? "/admin" : "/dashboard");
      } catch {
        router.push("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-6">
              Investment plans · Watch &amp; Earn · Data &amp; airtime
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up">
              ATOX Investment Platform
            </h1>
            <p
              className="text-lg md:text-xl text-gray-600 mb-6 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              ATOX is a digital platform where registered users can activate tiered
              investment plans that require daily ad-watching tasks, earn small
              rewards through the Watch and Earn programme when they have no active
              plan, collect referral bonuses, and buy mobile data and airtime for
              Nigerian networks — all from one dashboard.
            </p>
            <p
              className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 max-w-2xl mx-auto mb-8 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <ExclamationTriangleIcon className="w-4 h-4 inline-block mr-1 -mt-0.5" />
              Investment products on ATOX carry risk. Returns are not guaranteed and
              you can lose money. Read the{" "}
              <Link href="/risk-disclosure" className="underline font-semibold">
                risk disclosure
              </Link>{" "}
              before participating.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Link
                href="/register"
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl font-semibold text-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all hover:scale-105 transform"
              >
                Create Free Account
              </Link>
              <Link
                href="/learn"
                className="px-8 py-4 bg-white text-emerald-700 border border-emerald-200 rounded-2xl font-semibold text-lg hover:shadow-lg transition-all"
              >
                Learn Before You Invest
              </Link>
            </div>
          </div>
        </section>

        {/* Homepage ad — after introductory hero content */}
        <AdSenseAd placementId="HOMEPAGE_ABOVE_FOLD" />

        {/* What ATOX offers */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
                What ATOX Offers
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                Three services are available on the platform today, each described
                honestly below — including its limits.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-100 hover:shadow-xl transition-shadow animate-scale-in" style={{ animationDelay: "0.3s" }}>
                <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center mb-6">
                  <ChartBarIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">VIP Investment Plans</h3>
                <p className="text-gray-600 mb-4">
                  Each plan has a fixed price, a fixed number of daily ad tasks and a
                  stated daily income for the plan term. Income is credited only when
                  the daily tasks are completed. Plan prices and terms are listed
                  publicly below and confirmed in your dashboard before purchase.
                </p>
                <Link href="/fees" className="text-emerald-600 font-semibold hover:text-emerald-700">
                  Plan pricing &amp; fees →
                </Link>
              </div>
              <div className="p-8 bg-gradient-to-br from-teal-50 to-white rounded-2xl border border-teal-100 hover:shadow-xl transition-shadow animate-scale-in" style={{ animationDelay: "0.4s" }}>
                <div className="w-14 h-14 bg-teal-600 rounded-xl flex items-center justify-center mb-6">
                  <PlayIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Watch and Earn</h3>
                <p className="text-gray-600 mb-4">
                  Users without an active plan can watch short advertisements and earn
                  ₦10 per completed video, as many times as they want. This option is
                  not available while a VIP plan is active — plan members earn through
                  their daily tasks instead.
                </p>
                <Link href="/faq" className="text-emerald-600 font-semibold hover:text-emerald-700">
                  How it works →
                </Link>
              </div>
              <div className="p-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 hover:shadow-xl transition-shadow animate-scale-in" style={{ animationDelay: "0.5s" }}>
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <DevicePhoneMobileIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Data &amp; Airtime</h3>
                <p className="text-gray-600 mb-4">
                  Buy mobile data and airtime for MTN, Airtel, Glo and 9mobile from
                  your dashboard using your wallet balance. Live prices and
                  availability are shown at the point of purchase inside the app.
                </p>
                <Link href="/faq" className="text-emerald-600 font-semibold hover:text-emerald-700">
                  Read the FAQ →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                From registration to withdrawal, here is the complete flow — including
                the checks and fees that apply along the way.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {STEPS.map((step, index) => (
                <div key={step.title} className="text-center animate-scale-in" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                  <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 text-white text-2xl font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-10 max-w-2xl mx-auto">
              Eligibility: you must be at least 18 years old and provide accurate
              registration details. One account per person. Full rules are in our{" "}
              <Link href="/terms" className="text-emerald-600 underline">Terms and Conditions</Link>.
            </p>
          </div>
        </section>

        {/* Homepage ad — between content sections */}
        <AdSenseAd placementId="HOMEPAGE_MID" />

        {/* Plans table */}
        <section id="plans" className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
                Investment Plans &amp; Pricing
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                These are the current plan parameters published on the platform. The
                same figures are shown in your dashboard before you pay. Income is
                credited only for days on which the plan&apos;s daily tasks are
                completed — it is not a guaranteed return.
              </p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Plan</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Price</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Term</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Daily tasks</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Stated daily income</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Stated total income</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  {PLANS.map((plan) => (
                    <tr key={plan.id} className="hover:bg-emerald-50/50">
                      <td className="px-4 py-3 font-semibold">{plan.name}</td>
                      <td className="px-4 py-3">{formatNaira(plan.price)}</td>
                      <td className="px-4 py-3">{plan.durationDays} days</td>
                      <td className="px-4 py-3">{plan.ads} ads / day</td>
                      <td className="px-4 py-3">{formatNaira(plan.dailyIncome)}</td>
                      {/* Total derived from the operational daily income × term so
                          published figures always match what the system credits. */}
                      <td className="px-4 py-3">{formatNaira(plan.dailyIncome * plan.durationDays)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              A 10% processing fee is deducted from every withdrawal. See the{" "}
              <Link href="/fees" className="text-emerald-600 underline">Fees &amp; Withdrawals page</Link>{" "}
              for the full cost breakdown and the{" "}
              <Link href="/risk-disclosure" className="text-emerald-600 underline">risk disclosure</Link>{" "}
              for why high stated returns imply high risk.
            </p>

            {/* In-content advertisement — only rendered on eligible public pages */}
            <AdBanner />
          </div>
        </section>

        {/* Fees summary */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Fees, Withdrawals &amp; Costs
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
                <BanknotesIcon className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Published withdrawal terms</h3>
                  <p className="text-sm text-gray-600">
                    Minimum withdrawal is ₦2,000. A 10% processing fee applies.
                    Withdrawal requests are reviewed and paid to your registered bank
                    details — they are not instant.
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
                <ShieldCheckIcon className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Registration is free</h3>
                  <p className="text-sm text-gray-600">
                    Creating an account costs nothing. You pay only when you choose to
                    activate a plan, and plan purchases are final once activated —
                    read the terms before buying.
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center mt-8">
              <Link
                href="/fees"
                className="inline-block px-6 py-3 bg-white text-emerald-700 border border-emerald-200 rounded-xl font-semibold hover:shadow-lg transition"
              >
                Read the full Fees &amp; Withdrawal Policy
              </Link>
            </div>
          </div>
        </section>

        {/* Trust & learning */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Understand the Risks Before You Participate
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              No investment is risk-free, and products offering high daily returns
              carry proportionally high risk. Our learning centre explains how
              investment risk works, how returns are calculated on ATOX, and how to
              evaluate any earning opportunity — including this one.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/learn"
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
              >
                Browse Investment Guides
              </Link>
              <Link
                href="/risk-disclosure"
                className="px-6 py-3 bg-white text-emerald-700 border border-emerald-200 rounded-xl font-semibold hover:shadow-lg transition"
              >
                Read the Risk Disclosure
              </Link>
            </div>
          </div>
        </section>

        {/* Support */}
        <section className="py-16 bg-gradient-to-r from-emerald-600 to-green-600">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Questions? We Answer by Email
            </h2>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
              Support is provided by email at support@atoxinvestmentplatform.com.
              Include your registered email and a description of your question.
              Common questions are already answered in the FAQ.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-4 bg-white text-emerald-600 rounded-2xl font-semibold hover:bg-gray-100 transition-all"
              >
                Contact Support
              </Link>
              <Link
                href="/faq"
                className="px-8 py-4 bg-emerald-700 text-white rounded-2xl font-semibold hover:bg-emerald-800 transition-all"
              >
                Read the FAQ
              </Link>
            </div>
          </div>
        </section>

        {/* Homepage ad — before footer */}
        <AdSenseAd placementId="HOMEPAGE_BELOW_FOLD" />
      </main>

      <SiteFooter />
    </div>
  );
}