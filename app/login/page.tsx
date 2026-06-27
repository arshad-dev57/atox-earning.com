  "use client";

  import { useState, useEffect } from "react";
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-5">
        <div className="w-full max-w-md">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Atox Earnings</h1>
            <p className="text-gray-600 mt-2">Welcome back! Login to your account</p>
            <div className="inline-flex items-center gap-1 mt-2 bg-green-100 px-3 py-1 rounded-full">
              <span className="text-sm font-semibold text-green-700">🇳🇬 Nigeria</span>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 shadow-md"
              >
                {loading ? "Logging in..." : "Login to Dashboard"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="text-green-600 hover:text-green-700 font-semibold">
                  Create free account
                </Link>
              </p>
            </div>
          </div>

          {/* Features Section - Nigeria Naira */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/50 rounded-lg p-3">
              <div className="text-green-600 font-bold text-xl">₦0</div>
              <div className="text-xs text-gray-600">Min Withdraw</div>
            </div>
            <div className="bg-white/50 rounded-lg p-3">
              <div className="text-green-600 font-bold text-xl">24/7</div>
              <div className="text-xs text-gray-600">Support</div>
            </div>
            <div className="bg-white/50 rounded-lg p-3">
              <div className="text-green-600 font-bold text-xl">Instant</div>
              <div className="text-xs text-gray-600">Payments</div>
            </div>
          </div>
        </div>
      </div>
    );
  }