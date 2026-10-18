import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/marketing/SiteHeader";
import SiteFooter from "@/components/marketing/SiteFooter";
import AdSenseAd from "@/components/ads/AdSenseAd";
import { PLANS } from "@/lib/plans";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Fees & Withdrawal Policy",
  description:
    "ATOX fees in full: free registration, plan prices (₦3,000–₦1,000,000), ₦2,000 minimum withdrawal, 10% processing fee on every withdrawal, reviewed bank-transfer payouts, and how deposits are confirmed.",
  alternates: { canonical: `${SITE_URL}/fees` },
};

const formatNaira = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);

const FACTS = [
  {
    label: "Registration",
    value: "Free",
    note: "Creating an account costs nothing. You pay only when you choose to activate a plan.",
  },
  {
    label: "Minimum withdrawal",
    value: "₦2,000",
    note: "Requests below ₦2,000 cannot be submitted from the dashboard.",
  },
  {
    label: "Withdrawal processing fee",
    value: "10%",
    note: "Deducted from the requested amount. ₦10,000 requested → ₦9,000 paid out.",
  },
  {
    label: "Withdrawal payout",
    value: "Reviewed, then bank transfer",
    note: "Typically processed within 24–48 hours on business days after review; bank times may add delays.",
  },
];

export default function FeesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Fees &amp; Withdrawal Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything the platform charges, in one place. No figure on this page is
            invented — these are the values implemented in the product.
          </p>
        </div>

        {/* Key facts */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {FACTS.map((fact) => (
            <div key={fact.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">{fact.label}</p>
              <p className="text-2xl font-bold text-emerald-600 mb-2">{fact.value}</p>
              <p className="text-sm text-gray-600">{fact.note}</p>
            </div>
          ))}
        </div>

        {/* Fees ad — between key facts and plan pricing */}
        <AdSenseAd placementId="FEES_MID" />

        {/* Plan pricing (rendered from the same data the dashboard uses) */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Plan Pricing</h2>
          <p className="text-gray-600 mb-6">
            These are the prices you pay to activate each plan. Plan income is a plan
            parameter credited only on days when the daily tasks are completed — it is
            not a guaranteed return.{" "}
            <Link href="/risk-disclosure" className="text-emerald-600 underline">
              See the risk disclosure
            </Link>.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Plan</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Price (one-time)</th>
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
          <p className="text-xs text-gray-500 mt-3">
            Plan purchases are final and non-refundable once activated.
          </p>
        </section>

        {/* Deposits */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Deposits (Funding Your Wallet)</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3 text-gray-700">
            <p>ATOX charges no deposit fee — you transfer the exact amount and upload your payment screenshot.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Transfer only to the bank account displayed inside your own dashboard.</li>
              <li>Upload a clear screenshot of the transfer receipt in the Recharge screen.</li>
              <li>Support reviews the request and credits your wallet once the payment is confirmed.</li>
              <li>Never send money to account details shared through social media or messaging apps — only dashboard details are valid.</li>
            </ul>
          </div>
        </section>

        {/* Withdrawals with worked example */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Withdrawals — Worked Example</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-gray-700 mb-4">
              Every withdrawal has the 10% processing fee deducted before payment. For
              example, if you request ₦10,000 from your task balance:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left max-w-lg">
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  <tr><td className="py-2 pr-6 font-semibold">Requested amount</td><td className="py-2">₦10,000</td></tr>
                  <tr><td className="py-2 pr-6 font-semibold">10% processing fee</td><td className="py-2 text-red-600">− ₦1,000</td></tr>
                  <tr><td className="py-2 pr-6 font-semibold">You receive</td><td className="py-2 font-bold text-emerald-600">₦9,000</td></tr>
                </tbody>
              </table>
            </div>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-5">
              <li>Minimum withdrawal: ₦2,000 per request.</li>
              <li>You can withdraw from your referral balance or your task balance.</li>
              <li>Payouts go to the bank details registered on your profile after review — requests are not instant.</li>
            </ul>
          </div>
        </section>

        {/* Other services */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Other Services</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-2">Watch and Earn</h3>
              <p className="text-gray-700 text-sm">
                Free to use for accounts without an active plan. You earn ₦10 per
                completed video advertisement; there is no fee deducted from Watch and
                Earn rewards beyond the standard 10% withdrawal fee when you cash out.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-2">Data &amp; Airtime</h3>
              <p className="text-gray-700 text-sm">
                Data bundles and airtime are purchased at the prices shown at the point
                of purchase inside your dashboard, paid from your wallet balance. Live
                pricing comes from our delivery provider and can change without notice.
              </p>
            </div>
          </div>
        </section>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-sm text-amber-800">
          Fees and plan parameters shown here reflect the platform&apos;s current
          configuration and may change. The figures displayed inside your dashboard at
          the time of a transaction are always the ones that apply. Questions?{" "}
          <Link href="/contact" className="underline font-semibold">Contact support</Link>.
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}