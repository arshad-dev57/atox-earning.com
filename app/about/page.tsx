"use client";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-950 text-white pb-16 font-sans">
      {/* Header / Nav */}
      <header className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between border-b border-white/10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/80 hover:text-white transition bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-medium border border-white/5"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
            <span className="text-xl font-bold text-emerald-400">₦</span>
          </div>
          <span className="font-bold text-lg tracking-tight">ATOX</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
          About ATOX Investment Platform
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mt-6 bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
          Empowering Smarter Financial Growth
        </h1>
        <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
          ATOX Investment Platform is a modern digital investment platform designed to provide individuals with secure, transparent, and accessible investment opportunities. Our mission is to make investing simple, rewarding, and available to everyone, regardless of their level of experience.
        </p>
      </section>

      {/* Card Intro */}
      <section className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <p className="text-gray-300 leading-relaxed text-center text-lg">
            At ATOX, we combine innovative technology with a user-friendly experience to help our members grow their financial future with confidence. Whether you are just beginning your investment journey or looking to expand your portfolio, our platform is built to support your goals through reliable services and continuous innovation.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-8 hover:border-emerald-500/30 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/30 group-hover:scale-110 transition-transform">
            <span className="text-2xl">🎯</span>
          </div>
          <h2 className="text-2xl font-bold text-emerald-400">Our Mission</h2>
          <p className="mt-4 text-gray-300 leading-relaxed">
            To empower individuals by providing a secure, transparent, and innovative investment platform that creates opportunities for sustainable financial growth while maintaining the highest standards of integrity and customer satisfaction.
          </p>
        </div>

        <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-8 hover:border-emerald-500/30 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 border border-blue-500/30 group-hover:scale-110 transition-transform">
            <span className="text-2xl">👁️</span>
          </div>
          <h2 className="text-2xl font-bold text-blue-400">Our Vision</h2>
          <p className="mt-4 text-gray-300 leading-relaxed">
            To become one of Africa's most trusted digital investment platforms, connecting millions of people with innovative financial opportunities and helping them build long-term wealth responsibly.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-10">Why Choose ATOX?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            "Secure and reliable platform designed with user safety in mind.",
            "Fast and easy account registration.",
            "Transparent investment process with clear information.",
            "User-friendly dashboard for tracking investments and earnings.",
            "Dedicated customer support team.",
            "Continuous innovation to improve the investment experience."
          ].map((point, index) => (
            <div key={index} className="flex items-start gap-4 p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition">
              <span className="text-emerald-400 text-lg flex-shrink-0 mt-0.5">✓</span>
              <p className="text-gray-300 text-sm font-medium">{point}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-6 justify-center">
          {coreValues.map((value, idx) => {
            const Icon = value.icon;
            return (
              <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 hover:bg-white/[0.05] hover:border-white/10 transition-all flex flex-col items-center text-center">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center shadow-lg mb-5`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">{value.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Our Commitment & Join Call-to-Action */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-emerald-900/40 via-emerald-850/20 to-transparent border border-emerald-500/20 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-4">Our Commitment</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            At ATOX Investment Platform, we are committed to building a trusted financial ecosystem where technology, transparency, and customer satisfaction come together. We strive to provide a reliable investment experience while continuously improving our services to meet the evolving needs of our growing community.
          </p>
          <button
            onClick={() => router.push("/register")}
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 text-lg"
          >
            Join ATOX Today
          </button>
        </div>
      </section>
    </div>
  );
}
