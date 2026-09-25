"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md py-4 px-6 shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg?v=2" alt="Atox Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold text-gray-900">ATOX</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="px-5 py-2 text-gray-600 font-semibold hover:bg-gray-50 rounded-xl transition"
            >
              Home
            </button>
            <button
              onClick={() => router.push("/register")}
              className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8 transition font-medium"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Home
        </button>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
            <DocumentTextIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms and Conditions
          </h1>
          <p className="text-xl text-gray-600">
            Last updated: September 2024
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <div className="space-y-3 text-gray-700">
              <p>By accessing and using the ATOX Investment Platform, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our platform.</p>
              <p>These terms constitute a legally binding agreement between you and ATOX Investment Platform. We reserve the right to modify these terms at any time, and your continued use of the platform constitutes acceptance of any changes.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Account Registration</h2>
            <div className="space-y-3 text-gray-700">
              <p>To use our platform, you must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be at least 18 years of age</li>
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and update your account information to keep it accurate</li>
                <li>Safeguard your account credentials and prevent unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
              <p className="mt-4">You agree to notify us immediately of any unauthorized use of your account or any other breach of security.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Investment Plans and Returns</h2>
            <div className="space-y-3 text-gray-700">
              <p>Our platform offers various investment plans with different returns and terms. By purchasing a plan, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Complete daily tasks (watching ads) to earn daily returns</li>
                <li>Understand that returns are not guaranteed and are subject to plan terms</li>
                <li>Adhere to the specific requirements of each investment plan</li>
                <li>Recognize that investment activities carry inherent risks</li>
              </ul>
              <p className="mt-4">Daily returns are calculated based on the plan specifications and may vary. Past performance does not guarantee future results.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Deposits and Withdrawals</h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Deposits:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>All deposits must be made through approved payment methods</li>
                <li>Minimum deposit amounts apply as specified in the platform</li>
                <li>Deposits are subject to verification before being credited to your account</li>
                <li>We reserve the right to reject deposits from suspicious sources</li>
              </ul>
              <p className="mt-4"><strong>Withdrawals:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Withdrawal requests are processed according to the platform&apos;s schedule</li>
                <li>Minimum withdrawal amounts and processing times apply</li>
                <li>A withdrawal fee may be deducted as specified in the platform</li>
                <li>Withdrawals to verified bank accounts only</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. User Conduct</h2>
            <div className="space-y-3 text-gray-700">
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the platform for any illegal or unauthorized purpose</li>
                <li>Attempt to gain unauthorized access to our systems or other users&apos; accounts</li>
                <li>Interfere with or disrupt the platform&apos;s operation</li>
                <li>Use automated tools to abuse or exploit the platform</li>
                <li>Create multiple accounts to exploit referral or bonus systems</li>
                <li>Provide false or misleading information</li>
                <li>Engage in fraudulent activities or money laundering</li>
              </ul>
              <p className="mt-4">Violation of these terms may result in account suspension or termination without notice.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Referral Program</h2>
            <div className="space-y-3 text-gray-700">
              <p>Our referral program allows you to earn bonuses by referring new users. The program terms include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Referral bonuses are paid when referred users meet specified criteria</li>
                <li>Self-referrals are not permitted and will result in disqualification</li>
                <li>Referral bonuses are subject to change at our discretion</li>
                <li>Abuse of the referral system may result in account termination</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data and Airtime Services</h2>
            <div className="space-y-3 text-gray-700">
              <p>For data and airtime recharge services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Services are provided subject to availability of network operators</li>
                <li>We are not responsible for network operator issues or delays</li>
                <li>All transactions are final unless errors are proven</li>
                <li>Service availability may vary by network and region</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Intellectual Property</h2>
            <div className="space-y-3 text-gray-700">
              <p>All content, features, and functionality of the ATOX Investment Platform are owned by ATOX and are protected by international copyright, trademark, and other intellectual property laws.</p>
              <p>You may not reproduce, modify, distribute, or create derivative works of any platform content without our express written permission.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <div className="space-y-3 text-gray-700">
              <p>ATOX Investment Platform shall not be liable for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Any indirect, incidental, special, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Service interruptions or technical failures</li>
                <li>Actions of third parties or network operators</li>
                <li>Investment losses or market fluctuations</li>
              </ul>
              <p className="mt-4">Our total liability to you shall not exceed the amount you have deposited into your account.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Account Suspension and Termination</h2>
            <div className="space-y-3 text-gray-700">
              <p>We reserve the right to suspend or terminate your account if:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You violate these terms and conditions</li>
                <li>You engage in fraudulent or suspicious activities</li>
                <li>Your account remains inactive for an extended period</li>
                <li>Regulatory or legal requirements necessitate such action</li>
              </ul>
              <p className="mt-4">Upon termination, you will forfeit any pending bonuses or unclaimed earnings, and your account balance may be subject to review.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Dispute Resolution</h2>
            <div className="space-y-3 text-gray-700">
              <p>Any disputes arising from your use of the platform shall be resolved through:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Direct negotiation between the parties</li>
                <li>Mediation through our customer support system</li>
                <li>Arbitration as governed by applicable laws</li>
              </ul>
              <p className="mt-4">Courts of competent jurisdiction in the platform&apos;s operating jurisdiction shall have exclusive jurisdiction over any disputes.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
            <div className="space-y-3 text-gray-700">
              <p>These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which ATOX Investment Platform operates. Any legal action shall be subject to the exclusive jurisdiction of the courts in that jurisdiction.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Indemnification</h2>
            <div className="space-y-3 text-gray-700">
              <p>You agree to indemnify and hold harmless ATOX Investment Platform, its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of the platform or violation of these terms.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Amendments</h2>
            <div className="space-y-3 text-gray-700">
              <p>We reserve the right to amend these terms at any time. Amendments will be effective immediately upon posting on the platform. Your continued use of the platform after amendments constitutes acceptance of the modified terms.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Information</h2>
            <div className="space-y-3 text-gray-700">
              <p>For questions about these terms and conditions, please contact us through:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Customer support through your dashboard</li>
                <li>Email: support@atoxinvestmentplatform.com</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}