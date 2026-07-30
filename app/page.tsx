"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().isAdmin) {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md py-4 px-6 shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg?v=2" alt="Atox Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold text-gray-900">ATOX</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-emerald-600 transition">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-emerald-600 transition">How It Works</a>
            <a href="#testimonials" className="text-gray-600 hover:text-emerald-600 transition">Testimonials</a>
            <a href="#pricing" className="text-gray-600 hover:text-emerald-600 transition">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/login")}
              className="px-5 py-2 text-emerald-600 font-semibold hover:bg-emerald-50 rounded-xl transition"
            >
              Login
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

      {/* Hero Section */}
      <main>
        <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-6">
              🚀 Trusted by 10,000+ users
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Start Earning Today
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of users earning daily through our secure investment platform. Build your wealth with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/register")}
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl font-semibold text-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
              >
                Get Started Now
              </button>
              <button
                onClick={() => router.push("/plan")}
                className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-2xl font-semibold text-lg hover:border-emerald-600 hover:text-emerald-600 transition-all"
              >
                View Plans
              </button>
            </div>
            
            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-gray-900">$2M+</div>
                <div className="text-gray-600">Total Invested</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">10K+</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">99.9%</div>
                <div className="text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose ATOX?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experience the future of investing with our cutting-edge platform
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-100 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Bank-Level Security</h3>
                <p className="text-gray-600">Your investments are protected with military-grade encryption and multi-factor authentication.</p>
              </div>
              <div className="p-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Daily Returns</h3>
                <p className="text-gray-600">Watch your investment grow with competitive daily returns and transparent earnings.</p>
              </div>
              <div className="p-8 bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-100 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Withdrawals</h3>
                <p className="text-gray-600">Access your earnings anytime with our fast and secure withdrawal process.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How它 Works Section */}
        <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Start earning in just 3 simple steps
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Create Account</h3>
                <p className="text-gray-600">Sign up in seconds with just your email. No complex verification required.</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Choose Plan</h3>
                <p className="text-gray-600">Select from our flexible investment plans that suit your budget and goals.</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Start Earning</h3>
                <p className="text-gray-600">Watch your investment grow daily with automatic returns to your account.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join thousands of satisfied investors
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"ATOX has changed my financial life. The daily returns are consistent and withdrawals are instant. Highly recommended!"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center text-emerald-700 font-bold">AO</div>
                  <div>
                    <div className="font-semibold text-gray-900">Adebayo O.</div>
                    <div className="text-sm text-gray-600">Lagos, Nigeria</div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"I was skeptical at first, but ATOX proved me wrong. The platform is secure and the support team is excellent. Best decision ever!"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold">CI</div>
                  <div>
                    <div className="font-semibold text-gray-900">Chinedu I.</div>
                    <div className="text-sm text-gray-600">Abuja, Nigeria</div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"The flexibility of investment plans is amazing. I started small and now I'm earning significant daily returns. Thank you ATOX!"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-bold">FA</div>
                  <div>
                    <div className="font-semibold text-gray-900">Fatima A.</div>
                    <div className="text-sm text-gray-600">Kano, Nigeria</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Preview Section */}
        <section id="pricing" className="py-20 bg-gradient-to-br from-emerald-50 to-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Investment Plans</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose the plan that fits your investment goals
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">₦5,000</div>
                <p className="text-gray-600 mb-6">Minimum investment</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    2% daily returns
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    24/7 support
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Instant withdrawals
                  </li>
                </ul>
                <button
                  onClick={() => router.push("/register")}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
                >
                  Get Started
                </button>
              </div>
              <div className="p-8 bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl text-white relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                  POPULAR
                </div>
                <h3 className="text-xl font-bold mb-2">Professional</h3>
                <div className="text-4xl font-bold mb-1">₦25,000</div>
                <p className="text-emerald-100 mb-6">Minimum investment</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    3% daily returns
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Priority support
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Instant withdrawals
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Bonus earnings
                  </li>
                </ul>
                <button
                  onClick={() => router.push("/register")}
                  className="w-full py-3 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-gray-100 transition"
                >
                  Get Started
                </button>
              </div>
              <div className="p-8 bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">₦100,000</div>
                <p className="text-gray-600 mb-6">Minimum investment</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    5% daily returns
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Dedicated manager
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Instant withdrawals
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    VIP benefits
                  </li>
                </ul>
                <button
                  onClick={() => router.push("/register")}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-600 to-green-600">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Earning?</h2>
            <p className="text-xl text-emerald-100 mb-8">
              Join thousands of users who are already building their wealth with ATOX
            </p>
            <button
              onClick={() => router.push("/register")}
              className="px-8 py-4 bg-white text-emerald-600 rounded-2xl font-semibold text-lg hover:shadow-lg transition-all"
            >
              Create Free Account
            </button>
          </div>
        </section>

        {/* Adsterra Banner 468x60 */}
        <div className="py-12 flex justify-center bg-gray-50">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <Script id="ad-banner-468x60" strategy="afterInteractive">
              {`
                atOptions = {
                  'key' : 'c0886ae1b3dd9ed31af9c5b36c6abf2f',
                  'format' : 'iframe',
                  'height' : 60,
                  'width' : 468,
                  'params' : {}
                };
              `}
            </Script>
            <Script
              src="https://www.highperformanceformat.com/c0886ae1b3dd9ed31af9c5b36c6abf2f/invoke.js"
              strategy="afterInteractive"
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img src="/logo.jpg?v=2" alt="Atox Logo" className="h-8 w-auto" />
                  <span className="text-xl font-bold">ATOX</span>
                </div>
                <p className="text-gray-400">Your trusted partner for secure and profitable investments.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#features" className="hover:text-white transition">Features</a></li>
                  <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
                  <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                  <li><a href="#testimonials" className="hover:text-white transition">Testimonials</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition">Refund Policy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>support@atox-earning.com</li>
                  <li>+234 XXX XXX XXXX</li>
                  <li>Lagos, Nigeria</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
              <p>&copy; 2024 ATOX Investment Platform. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}