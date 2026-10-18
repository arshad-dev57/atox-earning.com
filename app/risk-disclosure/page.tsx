import type { Metadata } from "next";
import Link from "next/link";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import SiteHeader from "@/components/marketing/SiteHeader";
import SiteFooter from "@/components/marketing/SiteFooter";
import AdSenseAd from "@/components/ads/AdSenseAd";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Risk Disclosure",
  description:
    "The risks of participating on ATOX Investment Platform: returns are not guaranteed, you can lose your invested capital, plan income depends on daily tasks and platform operation, referral income is not assured, and withdrawal timing is subject to review.",
  alternates: { canonical: `${SITE_URL}/risk-disclosure` },
};

const RISKS = [
  {
    title: "Returns are not guaranteed",
    body: "Every income figure published on this site — plan daily income, Watch and Earn rewards, referral bonuses — describes how the system credits rewards when its conditions are met. None of it is a promise that you will earn a profit. If the conditions are not met, or the platform cannot sustain payouts, you may earn nothing.",
  },
  {
    title: "You can lose your capital",
    body: "When you pay for a plan, that money is at risk. Plan purchases are non-refundable once activated. If the platform stops operating, suspends payouts, or your account is suspended for a terms violation, you may lose part or all of the amount you paid.",
  },
  {
    title: "High stated returns imply high risk",
    body: "Some plans state daily incomes that imply very high percentage returns over their term. As a general rule in finance, the higher the promised return, the higher the probability that it will not be delivered sustainably. Treat high-return plans accordingly and never commit money you cannot afford to lose.",
  },
  {
    title: "Income depends on your daily activity",
    body: "Plan income is only credited on days when you complete all required daily tasks. Missing a day means no income for that day. Task availability, advertisement supply and platform uptime are outside your control.",
  },
  {
    title: "Withdrawals are reviewed, not instant",
    body: "Withdrawal requests (minimum ₦2,000, 10% processing fee) go through a review before payment. Delays can occur for verification, bank processing, or platform operational reasons. Liquidity risk — not being able to withdraw when you want — is real on any such platform.",
  },
  {
    title: "Referral income is not assured",
    body: "Referral rewards depend on real people registering with your code and becoming active. Encouraging others to take risk they do not understand also carries ethical and personal risk — only share your experience honestly.",
  },
  {
    title: "Operational and technical risk",
    body: "The platform runs on third-party infrastructure (hosting, payment channels, telecommunication providers). Outages, cyber-attacks, account compromise or provider failures can interrupt the service or affect balances.",
  },
  {
    title: "Not a bank deposit",
    body: "Balances and plan purchases on ATOX are not bank deposits, are not insured by any deposit insurance scheme, and do not earn bank-style interest. Keep your emergency savings in a regulated institution.",
  },
];

export default function RiskDisclosurePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30">
            <ExclamationTriangleIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Risk Disclosure</h1>
          <p className="text-xl text-gray-600">
            Read this carefully before creating an account or activating a plan.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-10 text-amber-900 leading-relaxed">
          <p>
            <strong>In short:</strong> participating on ATOX involves risk. Returns
            are not guaranteed, plan purchases are non-refundable, and you can lose
            money. Only participate with funds you can afford to lose, and never with
            money reserved for rent, food, school fees or emergencies.
          </p>
        </div>

        {/* Risk ad — after the short summary, before detailed risks */}
        <AdSenseAd placementId="RISK_MID" />

        <div className="space-y-6 mb-12">
          {RISKS.slice(0, 4).map((risk, index) => (
            <section key={risk.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {index + 1}. {risk.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">{risk.body}</p>
            </section>
          ))}
        </div>

        <div className="space-y-6 mb-12">
          {RISKS.slice(4).map((risk, index) => (
            <section key={risk.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {index + 5}. {risk.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">{risk.body}</p>
            </section>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Practical risk-management rules</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Decide your maximum loss before you start — an amount whose disappearance would not change your life.</li>
            <li>If you choose to participate at all, start with the smallest plan and treat the money as at-risk, not invested.</li>
            <li>Do not reinvest everything; withdraw periodically rather than compounding your exposure.</li>
            <li>Never borrow money or sell assets to fund a plan.</li>
            <li>Be sceptical of anyone — including referrers — promising guaranteed profit or &quot;no risk&quot;.</li>
          </ul>
        </div>

        <p className="text-gray-600 leading-relaxed">
          This disclosure is general information, not financial advice. If you need
          advice about your personal circumstances, consult a licensed financial
          adviser. For how costs work, see the{" "}
          <Link href="/fees" className="text-emerald-600 underline">Fees &amp; Withdrawals page</Link>;
          for the binding rules, see the{" "}
          <Link href="/terms" className="text-emerald-600 underline">Terms and Conditions</Link>.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}