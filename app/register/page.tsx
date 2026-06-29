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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-5 py-10">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <img
              src="/logo.jpg"
              alt="ATOX Investment Platform Logo"
              width={180}
              height={60}
              className="object-contain rounded-xl"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Join ATOX Platform</h1>
          <p className="text-gray-600 mt-2">Start earning in Naira (₦) today!</p>
          <div className="inline-flex items-center gap-1 mt-2 bg-green-100 px-3 py-1 rounded-full">
            <span className="text-sm font-semibold text-green-700">🇳🇬 Nigeria Only</span>
          </div>
        </div>

        {/* Register Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
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
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                required
              />
            </div>

            {/* Phone Number with Nigeria Code */}
            <div>
              <label className="block mb-2 font-semibold text-gray-800">
                Phone Number
              </label>
              <div className="flex gap-2">
                <div className="w-24 flex items-center bg-gray-100 border border-gray-300 rounded-lg px-3">
                  <span className="text-gray-800 font-semibold">+234</span>
                </div>
                <input
                  type="tel"
                  placeholder="Enter 11 digits"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={11}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all uppercase"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional field. Get from your referrer
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 shadow-md mt-2"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold">
              Go to login →
            </Link>
          </div>
        </div>

        {/* Benefits Section - Nigeria Naira */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-3 bg-white/50 rounded-lg p-3">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-gray-700">Earn up to ₦50,000 per referral</span>
          </div>
          <div className="flex items-center gap-3 bg-white/50 rounded-lg p-3">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-gray-700">Instant withdrawals to Nigerian bank account</span>
          </div>
          <div className="flex items-center gap-3 bg-white/50 rounded-lg p-3">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-gray-700">Daily earning tasks available</span>
          </div>
        </div>
      </div>
    </div>
  );
}