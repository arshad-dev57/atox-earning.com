import type { Metadata } from "next";
import SiteHeader from "@/components/marketing/SiteHeader";
import SiteFooter from "@/components/marketing/SiteFooter";
import AdSenseAd from "@/components/ads/AdSenseAd";
import { SITE_URL, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "The rules for using ATOX Investment Platform: eligibility (18+), one account per person, plan purchase and refund rules, withdrawal minimum of ₦2,000 with a 10% fee, acceptable use, suspension, and governing terms.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms and Conditions
          </h1>
          <p className="text-xl text-gray-600">Last updated: October 2026</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100 space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <div className="space-y-3">
              <p>
                By accessing or using ATOX Investment Platform (the &quot;Platform&quot;),
                you agree to be bound by these Terms and Conditions. If you do not
                agree, do not use the Platform.
              </p>
              <p>
                These terms form a legally binding agreement between you and ATOX
                Investment Platform. We may update them from time to time; the
                &quot;Last updated&quot; date at the top of this page shows when the
                current version took effect, and continued use after an update
                constitutes acceptance of the revised terms.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility &amp; Registration</h2>
            <div className="space-y-3">
              <p>To use the Platform you must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be at least 18 years of age;</li>
                <li>Provide accurate, current and complete registration information;</li>
                <li>Maintain one account only — multiple accounts per person are prohibited;</li>
                <li>Keep your login credentials confidential and notify support of any suspected unauthorised access.</li>
              </ul>
              <p>
                Registration is free. You are responsible for all activity that occurs
                under your account.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Investment Plans &amp; Daily Tasks</h2>
            <div className="space-y-3">
              <p>
                The Platform offers VIP investment plans. Each plan publishes its
                price, term, number of daily tasks and stated daily income. By
                activating a plan you confirm that you have reviewed these parameters
                in your dashboard before paying.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Plan income is credited only on days when the required daily tasks are completed.</li>
                <li>Stated income figures are plan parameters, not guaranteed returns. See the Risk Disclosure page.</li>
                <li>Plan purchases are final and non-refundable once activated.</li>
                <li>Plans run for their stated term; abandoning daily tasks does not cancel the plan or entitle you to a refund.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Deposits, Fees &amp; Withdrawals</h2>
            <div className="space-y-3">
              <ul className="list-disc pl-6 space-y-2">
                <li>Deposits are made by bank transfer to the account displayed inside your dashboard, with a payment screenshot uploaded for review. Only send funds to account details shown in your own dashboard.</li>
                <li>The minimum withdrawal amount is ₦2,000.</li>
                <li>A 10% processing fee is deducted from every withdrawal.</li>
                <li>Withdrawal requests are reviewed before payment and are paid to your registered bank details. They are not instant, and bank processing times may add delays.</li>
                <li>Withdrawals may be made from your task balance or referral balance, subject to the rules shown in the dashboard.</li>
              </ul>
              <p>
                The current fee schedule is summarised on the{" "}
                <a href="/fees" className="text-emerald-600 underline">Fees &amp; Withdrawals page</a>.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Referral Programme</h2>
            <div className="space-y-3">
              <p>
                Each account has a unique invitation code. Referral rewards are
                credited according to the programme rules displayed in the dashboard.
                Artificial, fraudulent or self-generated referrals are prohibited and
                may result in forfeiture of referral earnings and account suspension.
              </p>
            </div>
          </section>

          {/* Terms ad — between referral and acceptable-use sections */}
          <AdSenseAd placementId="TERMS_MID" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Acceptable Use</h2>
            <div className="space-y-3">
              <p>You must not:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create multiple accounts or misrepresent your identity;</li>
                <li>Use bots, scripts or automated means to complete daily tasks;</li>
                <li>Interfere with the Platform&apos;s operation or security;</li>
                <li>Use the Platform for any unlawful purpose;</li>
                <li>Share false testimonials or make unsupported claims about the Platform on its behalf.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Risk Acknowledgement</h2>
            <div className="space-y-3">
              <p>
                All investment and earning opportunities carry risk. You acknowledge
                that returns on the Platform are not guaranteed, that you may lose the
                money you commit to a plan, and that you should only participate with
                funds you can afford to lose. Full details are in our{" "}
                <a href="/risk-disclosure" className="text-emerald-600 underline">Risk Disclosure</a>.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Suspension &amp; Termination</h2>
            <div className="space-y-3">
              <p>We may suspend or terminate an account if:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>These terms are violated;</li>
                <li>Fraudulent or suspicious activity is detected;</li>
                <li>Multiple accounts are used to exploit referrals or bonuses;</li>
                <li>Legal or regulatory requirements require it.</li>
              </ul>
              <p>
                Upon termination, pending bonuses or unclaimed earnings may be
                forfeited and any remaining balance may be subject to review.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Disclaimers &amp; Limitation of Liability</h2>
            <div className="space-y-3">
              <p>
                The Platform is provided &quot;as is&quot; without warranties of any
                kind, express or implied. To the maximum extent permitted by law, ATOX
                is not liable for indirect, incidental or consequential losses arising
                from your use of the Platform, including loss of profits, data or
                goodwill.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Dispute Resolution &amp; Governing Law</h2>
            <div className="space-y-3">
              <p>
                Please contact support first — most issues (deposits, withdrawals,
                plan questions) are resolved through direct communication. Unresolved
                disputes are subject to the laws of the Federal Republic of Nigeria,
                and the courts located in Nigeria shall have jurisdiction, to the
                extent permitted by applicable law.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
            <div className="space-y-3">
              <p>For questions about these terms:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email: <a href={`mailto:${SUPPORT_EMAIL}`} className="text-emerald-600 underline">{SUPPORT_EMAIL}</a></li>
                <li>Customer care section inside your dashboard</li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}