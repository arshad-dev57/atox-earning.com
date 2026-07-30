"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

  export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists() && userDoc.data().isAdmin) {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        }
      });
      return () => unsubscribe();
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().isAdmin) {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } catch (error: any) {
        console.error("Login error:", error);
        if (error.code === "auth/user-not-found") {
          setError("User not found. Please register first.");
        } else if (error.code === "auth/wrong-password") {
          setError("Wrong password. Please try again.");
        } else {
          setError("Login failed. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md py-4 px-6 shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg?v=2" alt="Atox Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold text-gray-900">ATOX</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/register"
              className="px-5 py-2 text-emerald-600 font-semibold hover:bg-emerald-50 rounded-xl transition"
            >
              Register
            </Link>
            <Link
              href="/"
              className="px-5 py-2 text-gray-600 font-semibold hover:bg-gray-50 rounded-xl transition"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-md">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
              👋 Welcome back
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Login to Your Account</h1>
            <p className="text-lg text-gray-600">Continue your earning journey</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block mb-2 font-semibold text-gray-800">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-800">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login to Dashboard"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                  Create free account →
                </Link>
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="text-emerald-600 font-bold text-xl">₦0</div>
              <div className="text-xs text-gray-600 mt-1">Min Withdraw</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="text-emerald-600 font-bold text-xl">24/7</div>
              <div className="text-xs text-gray-600 mt-1">Support</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="text-emerald-600 font-bold text-xl">Instant</div>
              <div className="text-xs text-gray-600 mt-1">Payments</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
  }