import type { Metadata } from "next";
import { EnvelopeIcon, ChatBubbleLeftRightIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import SiteHeader from "@/components/marketing/SiteHeader";
import SiteFooter from "@/components/marketing/SiteFooter";
import AdSenseAd from "@/components/ads/AdSenseAd";
import { SITE_NAME, SITE_URL, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    `Contact ${SITE_NAME} support by email at ${SUPPORT_EMAIL}. What to include in your message, what we can and cannot help with, and links to self-service answers.`,
  alternates: { canonical: `${SITE_URL}/contact` },
};

const CHANNELS = [
  {
    title: "Email support",
    icon: EnvelopeIcon,
    lines: [
      SUPPORT_EMAIL,
      "Use the email address you registered with so we can locate your account.",
    ],
  },
  {
    title: "In-app customer care",
    icon: ChatBubbleLeftRightIcon,
    lines: [
      "Open the Customer Care section inside your dashboard after logging in.",
      "Best for account-specific questions tied to your user ID.",
    ],
  },
  {
    title: "Self-service answers",
    icon: QuestionMarkCircleIcon,
    lines: [
      "FAQ — plans, tasks, withdrawals and fees answered in detail.",
      "Fees & Withdrawals page — the published cost schedule.",
    ],
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {SITE_NAME} support is provided by email and inside the app. We do not
            operate walk-in offices or phone lines — this helps us keep every request
            tied to a verified account.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {CHANNELS.map((channel) => {
            const Icon = channel.icon;
            return (
              <div key={channel.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="font-bold text-gray-900 mb-2">{channel.title}</h2>
                <ul className="space-y-2 text-sm text-gray-600">
                  {channel.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What to include in your message</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>The email address you registered with;</li>
            <li>Your user ID from the dashboard profile section;</li>
            <li>The type of request (deposit not credited, withdrawal status, plan question, technical problem);</li>
            <li>Transaction details — amount, date, and the bank account you paid from (for deposits) or the last four digits of your account number (for withdrawals);</li>
            <li>Screenshots where relevant.</li>
          </ul>
          <p className="text-sm text-gray-500 mt-4">
            We can never ask for your password. Anyone asking for it is not ATOX —
            report it to us immediately.
          </p>
        </div>

        {/* Contact ad — after what-to-include content */}
        <AdSenseAd placementId="CONTACT_MID" />

        <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Ready to send your question?
          </h2>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="inline-block px-8 py-4 bg-white text-emerald-600 rounded-2xl font-semibold hover:bg-gray-100 transition-all shadow-lg"
          >
            Email {SUPPORT_EMAIL}
          </a>
          <p className="text-emerald-100 text-sm mt-4">
            Looking for quick answers first?{" "}
            <Link href="/faq" className="underline font-semibold">Read the FAQ</Link>.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}