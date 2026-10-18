"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch {
      // Firebase may reveal whether an email is registered; treat every outcome
      // the same way so this page cannot be used to enumerate accounts.
    } finally {
      setSent(true);
      toast.success("If that email is registered, a reset link has been sent.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30">
      <header className="bg-white/80 backdrop-blur-md py-4 px-6 shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg?v=2" alt="ATOX Investment Platform logo" className="h-10 w-auto" />
            <span className="text-xl font-bold text-gray-900">ATOX</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-5 py-2 text-emerald-600 font-semibold hover:bg-emerald-50 rounded-xl transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <main className="flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Your Password</h1>
            <p className="text-gray-600">
              Enter the email you registered with and we&apos;ll send you a reset link.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {sent ? (
              <div className="text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
                  <span className="text-2xl">✉️</span>
                </div>
                <p className="text-gray-700">
                  If that email is registered on ATOX, a password reset message is on
                  its way. Check your inbox (and spam folder) and follow the link to
                  set a new password.
                </p>
                <Link
                  href="/login"
                  className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
                >
                  Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block mb-2 font-semibold text-gray-800">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
                <p className="text-center text-sm text-gray-600">
                  Remembered it?{" "}
                  <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                    Back to login →
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}