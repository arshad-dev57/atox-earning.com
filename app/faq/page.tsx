import type { Metadata } from "next";
import Link from "next/link";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import SiteHeader from "@/components/marketing/SiteHeader";
import SiteFooter from "@/components/marketing/SiteFooter";
import FaqAccordion from "@/components/faq/FaqAccordion";
import AdSenseAd from "@/components/ads/AdSenseAd";
import { FAQS } from "@/lib/faq-data";
import { SITE_NAME, SITE_URL, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about ATOX Investment Platform: how plans and daily tasks work, Watch and Earn, deposits by bank transfer, the ₦2,000 minimum withdrawal and 10% fee, referrals, refunds, security and support.",
  alternates: { canonical: `${SITE_URL}/faq` },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SiteHeader />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
            <QuestionMarkCircleIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Straight answers about how {SITE_NAME} works — including fees and risks.
          </p>
        </div>

        {/* FAQ accordion (content is also present in the server-rendered HTML) */}
        <FaqAccordion faqs={FAQS} />

        {/* FAQ ad — between Q&A content and related reading */}
        <AdSenseAd placementId="FAQ_MID" />

        {/* Related reading */}
        <div className="mt-12 grid sm:grid-cols-3 gap-4">
          <Link
            href="/fees"
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition"
          >
            <p className="font-semibold text-gray-900">Fees &amp; Withdrawals →</p>
            <p className="text-sm text-gray-500 mt-1">Plan prices, the 10% withdrawal fee and minimums.</p>
          </Link>
          <Link
            href="/risk-disclosure"
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition"
          >
            <p className="font-semibold text-gray-900">Risk Disclosure →</p>
            <p className="text-sm text-gray-500 mt-1">What can go wrong, and why returns are not guaranteed.</p>
          </Link>
          <Link
            href="/learn"
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition"
          >
            <p className="font-semibold text-gray-900">Investment Guides →</p>
            <p className="text-sm text-gray-500 mt-1">Learn about risk, returns and avoiding scams.</p>
          </Link>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-8 md:p-12 text-center shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Still Have Questions?</h2>
          <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
            If your question is not answered here, email our support team at{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="underline font-semibold">
              {SUPPORT_EMAIL}
            </a>{" "}
            from your registered email address.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-white text-emerald-600 hover:bg-gray-100 transition-all font-bold rounded-2xl shadow-lg text-lg"
            >
              Contact Support
            </Link>
            <Link
              href="/register"
              className="px-8 py-4 bg-emerald-700 text-white hover:bg-emerald-800 transition-all font-bold rounded-2xl shadow-lg text-lg"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}