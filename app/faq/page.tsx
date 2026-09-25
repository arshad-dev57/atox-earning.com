"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function FAQPage() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is ATOX Investment Platform?",
      answer: "ATOX Investment Platform is a modern digital investment platform that allows users to earn daily returns by watching advertisements and completing simple tasks. We offer various investment plans with different return rates and terms to suit different budgets and goals."
    },
    {
      question: "How do I get started?",
      answer: "Getting started is easy: 1) Create a free account by registering with your email and phone number. 2) Choose an investment plan that suits your budget. 3) Complete your payment through our approved payment methods. 4) Start watching ads daily to earn your returns."
    },
    {
      question: "What are the investment plans available?",
      answer: "We offer multiple investment plans including VIP 1, VIP 2, VIP 3, and higher tiers. Each plan has different investment amounts, daily returns, and task requirements. Higher-tier plans offer better returns and more features. Visit the Products section in your dashboard to see all available plans."
    },
    {
      question: "How do I earn daily returns?",
      answer: "After purchasing an investment plan, you need to complete daily tasks by watching a specified number of advertisements. Each ad watched earns you a portion of your daily return. Complete all required ads for the day to maximize your earnings."
    },
    {
      question: "What are the deposit and withdrawal methods?",
      answer: "We accept deposits through bank transfer to our approved Opay account. For withdrawals, you can withdraw your earnings to your registered bank account. Minimum deposit and withdrawal amounts apply, and withdrawals are processed according to our schedule (typically on Fridays)."
    },
    {
      question: "How long does it take to process withdrawals?",
      answer: "Withdrawal requests are typically processed within 24-48 hours during business days. However, processing times may vary depending on bank processing times and verification requirements. You can track your withdrawal status in the dashboard."
    },
    {
      question: "Is my investment secure?",
      answer: "We take security seriously and implement multiple layers of protection including encryption, secure authentication, and regular security audits. However, all investments carry inherent risks, and we recommend investing only what you can afford to lose."
    },
    {
      question: "What is the referral program?",
      answer: "Our referral program allows you to earn bonuses by inviting new users to the platform. When someone registers using your referral code and becomes an active user, you receive a referral bonus. The more active users you refer, the more you can earn."
    },
    {
      question: "Can I have multiple accounts?",
      answer: "No, each user is allowed only one account. Creating multiple accounts to exploit the referral system or bonuses is strictly prohibited and may result in account suspension and forfeiture of earnings."
    },
    {
      question: "What happens if I miss a day of watching ads?",
      answer: "If you miss a day, you simply won't earn the daily return for that day. Your investment plan continues, and you can resume watching ads the next day. Some plans may have requirements about maintaining activity, so check your specific plan details."
    },
    {
      question: "How does the data and airtime service work?",
      answer: "We offer instant data and airtime recharge for all major Nigerian networks (MTN, Airtel, Glo, 9mobile). Simply select your network, enter the phone number, choose the amount, and complete payment. The recharge is processed instantly."
    },
    {
      question: "What should I do if I encounter technical issues?",
      answer: "If you experience any technical issues, first try clearing your browser cache and refreshing the page. If the problem persists, contact our customer support through the dashboard or email us at support@atoxinvestmentplatform.com with details of the issue."
    },
    {
      question: "Are there any fees for using the platform?",
      answer: "Registration is free. Investment plans have their own costs. Withdrawals may incur a processing fee (typically 10%). There are no hidden fees for using the platform features, but always check the specific terms of each service."
    },
    {
      question: "Can I cancel my investment plan?",
      answer: "Investment plans are generally non-refundable once purchased. However, you can choose not to continue with daily tasks, though this means you won't earn daily returns. For special circumstances, contact customer support for assistance."
    },
    {
      question: "How do I update my account information?",
      answer: "You can update your profile information, including bank details for withdrawals, through the Profile section in your dashboard. For security reasons, some changes may require verification."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
          <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
            <QuestionMarkCircleIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about ATOX Investment Platform
          </p>
        </div>

        {/* FAQ Content */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  openIndex === index ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"
                }`}>
                  <svg
                    className={`w-5 h-5 transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 pt-0">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-8 md:p-12 text-center shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Still Have Questions?</h2>
          <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our customer support team is here to help you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/contact")}
              className="px-8 py-4 bg-white text-emerald-600 hover:bg-gray-100 transition-all font-bold rounded-2xl shadow-lg text-lg"
            >
              Contact Support
            </button>
            <button
              onClick={() => router.push("/register")}
              className="px-8 py-4 bg-emerald-700 text-white hover:bg-emerald-800 transition-all font-bold rounded-2xl shadow-lg text-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}