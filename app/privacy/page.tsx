"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function PrivacyPolicyPage() {
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
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
            <ShieldCheckIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600">
            Last updated: September 2024
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <div className="space-y-3 text-gray-700">
              <p>ATOX Investment Platform collects information you provide directly to us, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personal identification information (name, email address, phone number)</li>
                <li>Account credentials (password, security settings)</li>
                <li>Financial information (bank details for deposits and withdrawals)</li>
                <li>Transaction history and investment activity</li>
                <li>Device and usage information when you access our platform</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <div className="space-y-3 text-gray-700">
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our investment platform services</li>
                <li>Process transactions and manage your account</li>
                <li>Send you important notifications about your account and investments</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Comply with legal obligations and protect our platform from fraud</li>
                <li>Analyze usage patterns to improve user experience</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Security</h2>
            <div className="space-y-3 text-gray-700">
              <p>We implement appropriate technical and organizational measures to protect your personal information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Secure authentication mechanisms and access controls</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Limited access to personal data by authorized personnel only</li>
              </ul>
              <p className="mt-4">However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing</h2>
            <div className="space-y-3 text-gray-700">
              <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>With service providers who perform services on our behalf (e.g., payment processors, cloud services)</li>
                <li>When required by law or to protect our rights, property, or safety</li>
                <li>With your consent for specific purposes</li>
                <li>In connection with a business transfer or merger</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
            <div className="space-y-3 text-gray-700">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and review your personal information</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your account and personal data</li>
                <li>Opt out of non-essential communications</li>
                <li>Withdraw consent where applicable</li>
              </ul>
              <p className="mt-4">To exercise these rights, please contact us through our customer support channels.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies and Tracking</h2>
            <div className="space-y-3 text-gray-700">
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Remember your preferences and login state</li>
                <li>Analyze website traffic and user behavior</li>
                <li>Improve our platform's functionality and performance</li>
              </ul>
              <p className="mt-4">You can control cookie settings through your browser preferences, though this may affect certain features of our platform.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Third-Party Services</h2>
            <div className="space-y-3 text-gray-700">
              <p>Our platform may integrate with third-party services such as:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payment processors for financial transactions</li>
                <li>Authentication services for secure login</li>
                <li>Analytics services to understand user behavior</li>
              </ul>
              <p className="mt-4">These third parties have their own privacy policies, and we encourage you to review them.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
            <div className="space-y-3 text-gray-700">
              <p>Our platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we discover that we have collected information from a minor, we will take steps to delete such information.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
            <div className="space-y-3 text-gray-700">
              <p>We may update this privacy policy from time to time. We will notify users of significant changes by posting the new policy on our platform and updating the "Last updated" date.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
            <div className="space-y-3 text-gray-700">
              <p>If you have questions about this privacy policy or our data practices, please contact us through:</p>
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