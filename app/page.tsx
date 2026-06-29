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
      {/* Header with Code */}
      <header className="bg-white py-4 px-6 shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg?v=2" alt="Atox Logo" className="h-10 w-auto" />
          </div>
          <div className="flex items-center gap-6">
            <p className="text-2xl font-bold text-gray-900 tracking-wider">NIGERIA</p>
            <button
              onClick={() => router.push("/login")}
              className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/register")}
              className="px-6 py-2 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Start Earning Today
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users earning daily through our secure investment platform
          </p>
          <button
            onClick={() => router.push("/register")}
            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl font-semibold text-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
          >
            Get Started Now
          </button>
        </div>
        
        {/* Adsterra Banner 468x60 */}
        <div className="mt-12 flex justify-center">
          <div className="bg-gray-100 rounded-lg p-4">
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
      </main>
    </div>
  );
}