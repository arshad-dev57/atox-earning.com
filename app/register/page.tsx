"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
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

  // Phone number input handler with 11 digits limit
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Only numbers
    if (value.length <= 11) {
      setPhone(value);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!fullName.trim()) {
      setError("Please enter your full name");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (!phone.trim()) {
      setError("Please enter your phone number");
      return;
    }

    if (phone.length !== 11) {
      setError("Phone number must be exactly 11 digits");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // 1. Look up referral code FIRST (before creating auth user)
      let referredBy: string | null = null;
      if (invitationCode.trim()) {
        const codeToLookup = invitationCode.trim().toUpperCase();
        console.log("[Register] Looking up referral code:", codeToLookup);
        const q = query(collection(db, "users"), where("myInvitationCode", "==", codeToLookup));
        const snapshot = await getDocs(q);
        console.log("[Register] Referral query result count:", snapshot.size);
        if (!snapshot.empty) {
          referredBy = snapshot.docs[0].id;
          console.log("[Register] Found referrer UID:", referredBy);
        } else {
          console.log("[Register] No referrer found for code:", codeToLookup);
        }
      }

      // 2. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const myInvitationCode = `ATOX-${user.uid.slice(0, 6).toUpperCase()}`;

      // 3. Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: fullName,
        phone: `+234${phone}`,
        phoneRaw: phone,
        email: email,
        invitationCode: invitationCode.toUpperCase(),
        myInvitationCode: myInvitationCode,
        referredBy: referredBy,
        balance: 0,
        referralBalance: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
        referralCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        accountStatus: "active",
        isAdmin: false,
      });

      console.log("[Register] User created with referredBy:", referredBy);
      toast.success("Registration successful! Please login.");
      router.push("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.code === "auth/email-already-in-use") {
        setError("Phone number already registered. Please login.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid phone number");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak. Please use a stronger password.");
      } else {
        setError("Registration failed. Please try again.");
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
              href="/login"
              className="px-5 py-2 text-emerald-600 font-semibold hover:bg-emerald-50 rounded-xl transition"
            >
              Login
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
              🚀 Join 10,000+ users
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Create Your Account</h1>
            <p className="text-lg text-gray-600">Start earning in Naira (₦) today!</p>
          </div>

          {/* Register Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block mb-2 font-semibold text-gray-800">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  required
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block mb-2 font-semibold text-gray-800">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  required
                />
              </div>

              {/* Phone Number with Nigeria Code */}
              <div>
                <label className="block mb-2 font-semibold text-gray-800">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <div className="w-28 flex items-center bg-gray-100 border border-gray-300 rounded-xl px-4">
                    <span className="text-gray-800 font-semibold">+234</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="Enter 11 digits"
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={11}
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter 11 digits (e.g., 80123456789) - {phone.length}/11 digits
                </p>
              </div>

              {/* Password */}
              <div>
                <label className="block mb-2 font-semibold text-gray-800">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block mb-2 font-semibold text-gray-800">
                  Re-enter Password
                </label>
                <input
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  required
                />
              </div>

              {/* Invitation Code */}
              <div>
                <label className="block mb-2 font-semibold text-gray-800">
                  Invitation Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter invitation code"
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all uppercase"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optional field. Get from your referrer
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                  Login →
                </Link>
              </p>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm text-gray-700 font-medium">Earn up to ₦50,000 per referral</span>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-sm text-gray-700 font-medium">Instant withdrawals to Nigerian bank</span>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-sm text-gray-700 font-medium">Bank-level security for your funds</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}