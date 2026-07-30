"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, ShieldCheckIcon, LightBulbIcon, UserGroupIcon, ChartBarIcon, ScaleIcon } from "@heroicons/react/24/outline";

export default function AboutPage() {
  const router = useRouter();

  const coreValues = [
    {
      title: "Integrity",
      description: "We believe trust is earned through honesty and transparency.",
      icon: ScaleIcon,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Innovation",
      description: "We continuously improve our technology to provide better financial solutions.",
      icon: LightBulbIcon,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Security",
      description: "Protecting our users and their data is our highest priority.",
      icon: ShieldCheckIcon,
      color: "from-red-500 to-rose-600",
    },
    {
      title: "Customer First",
      description: "Every decision we make is focused on delivering value to our community.",
      icon: UserGroupIcon,
      color: "from-purple-500 to-purple-700",
    },
    {
      title: "Growth",
      description: "We are committed to creating opportunities that help our users achieve their financial goals.",
      icon: ChartBarIcon,
      color: "from-amber-500 to-orange-600",
    },
  ];

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

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
            About ATOX Investment Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Empowering Smarter Financial Growth
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ATOX Investment Platform is a modern digital investment platform designed to provide individuals with secure, transparent, and accessible investment opportunities.
          </p>
        </section>

        {/* Card Intro */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <p className="text-gray-700 leading-relaxed text-center text-lg">
              At ATOX, we combine innovative technology with a user-friendly experience to help our members grow their financial future with confidence. Whether you are just beginning your investment journey or looking to expand your portfolio, our platform is built to support your goals through reliable services and continuous innovation.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 border border-emerald-100 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">🎯</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To empower individuals by providing a secure, transparent, and innovative investment platform that creates opportunities for sustainable financial growth while maintaining the highest standards of integrity and customer satisfaction.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">👁️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To become one of Africa's most trusted digital investment platforms, connecting millions of people with innovative financial opportunities and helping them build long-term wealth responsibly.
            </p>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">Why Choose ATOX?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Secure and reliable platform designed with user safety in mind.",
              "Fast and easy account registration.",
              "Transparent investment process with clear information.",
              "User-friendly dashboard for tracking investments and earnings.",
              "Dedicated customer support team.",
              "Continuous innovation to improve the investment experience."
            ].map((point, index) => (
              <div key={index} className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
                <span className="text-emerald-600 text-lg flex-shrink-0 mt-0.5">✓</span>
                <p className="text-gray-700 font-medium">{point}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {coreValues.map((value, idx) => {
              const Icon = value.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow flex flex-col items-center text-center">
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

        {/* Our Commitment & Join Call-to-Action */}
        <section>
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden shadow-xl">
            <h2 className="text-3xl font-bold text-white mb-4">Our Commitment</h2>
            <p className="text-emerald-100 max-w-2xl mx-auto mb-8 leading-relaxed">
              At ATOX Investment Platform, we are committed to building a trusted financial ecosystem where technology, transparency, and customer satisfaction come together. We strive to provide a reliable investment experience while continuously improving our services to meet the evolving needs of our growing community.
            </p>
            <button
              onClick={() => router.push("/register")}
              className="px-8 py-4 bg-white text-emerald-600 hover:bg-gray-100 transition-all font-bold rounded-2xl shadow-lg text-lg"
            >
              Join ATOX Today
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
