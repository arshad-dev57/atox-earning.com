"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  query,
  collection,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  LockClosedIcon,
  PlayIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);

// Product definitions — must match dashboard
const PRODUCTS: Record<string, { id: string; name: string; ads: number; dailyIncome: number; totalIncome: number; color: string }> = {
  vip1: { id: "vip1", name: "VIP 1", ads: 20, dailyIncome: 750, totalIncome: 22000, color: "from-emerald-500 to-green-600" },
  vip2: { id: "vip2", name: "VIP 2", ads: 35, dailyIncome: 1200, totalIncome: 36000, color: "from-blue-500 to-indigo-600" },
  vip3: { id: "vip3", name: "VIP 3", ads: 50, dailyIncome: 2200, totalIncome: 66000, color: "from-purple-500 to-pink-600" },
};

export default function PlanDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.productId as string;

  const [userId, setUserId] = useState<string | null>(null);
  const [purchase, setPurchase] = useState<any>(null);
  const [adsWatched, setAdsWatched] = useState(0);
  const [todayEarned, setTodayEarned] = useState(0);
  const [loading, setLoading] = useState(true);

  // Ad player state
  const [playingAd, setPlayingAd] = useState<number | null>(null); // slot number (1-based)
  const [adTimer, setAdTimer] = useState(30);
  const [adCompleted, setAdCompleted] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const timerRef = useRef<any>(null);

  const todayKey = new Date().toISOString().split("T")[0];

  const product = PRODUCTS[productId];

  // Auth check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) { router.push("/login"); return; }
      setUserId(user.uid);
    });
    return () => unsub();
  }, [router]);

  // Fetch purchase + progress
  useEffect(() => {
    if (!userId || !product) return;
    const fetchData = async () => {
      try {
        // Get purchase doc
        const q = query(
          collection(db, "purchases"),
          where("userId", "==", userId),
          where("productId", "==", productId)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          setPurchase({ id: snap.docs[0].id, ...snap.docs[0].data() });
        }

        // Get today's ad progress
        const progressRef = doc(db, "adProgress", `${userId}_${productId}_${todayKey}`);
        const progressDoc = await getDoc(progressRef);
        if (progressDoc.exists()) {
          setAdsWatched(progressDoc.data().adsWatched || 0);
          setTodayEarned(progressDoc.data().earned || 0);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, productId, todayKey, product]);

  // Cleanup timer
  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startAd = (slotIndex: number) => {
    // slotIndex is 1-based; only allow the next unwatched
    if (slotIndex !== adsWatched + 1) return;
    if (adsWatched >= (product?.ads || 0)) return;

    setPlayingAd(slotIndex);
    setAdTimer(30);
    setAdCompleted(false);

    timerRef.current = setInterval(() => {
      setAdTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setAdCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const claimReward = async () => {
    if (!userId || !product || claiming) return;
    setClaiming(true);
    try {
      const newWatched = adsWatched + 1;
      const earningPerAd = product.dailyIncome / product.ads;
      const progressRef = doc(db, "adProgress", `${userId}_${productId}_${todayKey}`);

      await setDoc(progressRef, {
        userId,
        productId,
        date: todayKey,
        adsWatched: newWatched,
        earned: todayEarned + earningPerAd,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      await updateDoc(doc(db, "users", userId), {
        balance: increment(earningPerAd),
        totalEarned: increment(earningPerAd),
      });

      setAdsWatched(newWatched);
      setTodayEarned((prev) => prev + earningPerAd);
      setPlayingAd(null);
      setAdCompleted(false);
    } catch (err) {
      console.error("Error claiming reward:", err);
      toast.error("Failed to claim reward. Please try again.");
    } finally {
      setClaiming(false);
    }
  };

  const closePlayer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPlayingAd(null);
    setAdTimer(30);
    setAdCompleted(false);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Plan not found.</p>
          <button onClick={() => router.push("/dashboard")} className="text-emerald-600 font-medium hover:underline">Return to Dashboard</button>
        </div>
      </div>
    );
  }

  const totalAds = product.ads;
  const earningPerAd = product.dailyIncome / totalAds;
  const progressPct = (adsWatched / totalAds) * 100;
  const allDone = adsWatched >= totalAds;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 pb-24">
      {/* Video Ad Player Modal */}
      {playingAd !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div>
                <p className="text-white font-semibold text-sm">Ad {playingAd} of {totalAds}</p>
                <p className="text-gray-400 text-xs">{product.name} · Earn {formatCurrency(earningPerAd)}</p>
              </div>
              {adCompleted && (
                <button onClick={closePlayer} className="text-gray-500 hover:text-gray-300 text-xs transition">
                  Close
                </button>
              )}
            </div>

            {/* Video Area */}
            <div className="relative bg-black" style={{ paddingTop: "56.25%" }}>
              {/* Replace this iframe src with your actual ad network embed URL */}
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0&disablekb=1&fs=0&rel=0&modestbranding=1"
                allow="autoplay; encrypted-media"
                allowFullScreen={false}
                title={`Ad ${playingAd}`}
              />
              {/* Overlay to block controls until done */}
              {!adCompleted && (
                <div className="absolute inset-0 bg-transparent cursor-not-allowed" />
              )}
              {/* Timer badge */}
              {!adCompleted && (
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-white text-sm font-bold">{adTimer}s</span>
                </div>
              )}
              {/* Completed overlay */}
              {adCompleted && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/40">
                      <CheckCircleIcon className="w-9 h-9 text-white" />
                    </div>
                    <p className="text-white font-bold text-lg">Ad Complete!</p>
                    <p className="text-emerald-400 text-sm">Claim your reward below</p>
                  </div>
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-gray-700">
              <div
                className="h-1 bg-emerald-500 transition-all duration-1000"
                style={{ width: `${((30 - adTimer) / 30) * 100}%` }}
              />
            </div>

            {/* Action */}
            <div className="p-5">
              {adCompleted ? (
                <button
                  onClick={claimReward}
                  disabled={claiming}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-bold text-base hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {claiming ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <TrophyIcon className="w-5 h-5" />
                      Claim {formatCurrency(earningPerAd)}
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-emerald-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{adTimer}</span>
                  </div>
                  <p className="text-gray-400 text-sm">Watch the full ad to claim your reward</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className={`bg-gradient-to-r ${product.color} text-white`}>
        <div className="max-w-2xl mx-auto px-4 py-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition text-sm font-medium"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-white/70 mt-1 text-sm">Watch {totalAds} ads daily to earn {formatCurrency(product.dailyIncome)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60">Daily Income</p>
              <p className="text-2xl font-bold">{formatCurrency(product.dailyIncome)}</p>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="mt-5 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/80">Today's Progress</span>
              <span className="font-bold text-white">{adsWatched}/{totalAds} ads</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full bg-white transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/70 mt-2">
              <span>Earned today: {formatCurrency(todayEarned)}</span>
              <span>Remaining: {formatCurrency((totalAds - adsWatched) * earningPerAd)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ads List */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !purchase ? (
          <div className="bg-white rounded-2xl p-10 text-center border-2 border-dashed border-gray-200">
            <LockClosedIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-semibold">You haven't purchased this plan</p>
            <p className="text-sm text-gray-400 mt-1">Go to Products to buy this plan</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-4 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition"
            >
              View Plans
            </button>
          </div>
        ) : allDone ? (
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-8 text-center mb-4">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/30">
              <TrophyIcon className="w-9 h-9 text-white" />
            </div>
            <p className="text-emerald-700 font-bold text-xl">All Done for Today! 🎉</p>
            <p className="text-emerald-600 text-sm mt-1">You earned {formatCurrency(product.dailyIncome)} today. Come back tomorrow!</p>
          </div>
        ) : (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3">
            <PlayIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="text-blue-700 text-sm font-medium">
              You can watch <strong>Ad #{adsWatched + 1}</strong> next. Ads unlock one by one after you claim each reward.
            </p>
          </div>
        )}

        {/* Ad Slots Grid */}
        <div className="grid grid-cols-1 gap-3">
          {Array.from({ length: totalAds }, (_, i) => {
            const slotNum = i + 1;
            const isWatched = slotNum <= adsWatched;
            const isNext = slotNum === adsWatched + 1;
            const isLocked = slotNum > adsWatched + 1;

            return (
              <div
                key={slotNum}
                onClick={() => !isLocked && !isWatched && startAd(slotNum)}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                  isWatched
                    ? "bg-emerald-50 border-emerald-200 cursor-default"
                    : isNext
                    ? "bg-white border-blue-400 shadow-md shadow-blue-100 cursor-pointer hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98]"
                    : "bg-gray-50 border-gray-100 cursor-not-allowed opacity-60"
                }`}
              >
                {/* Slot number / icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isWatched
                      ? "bg-emerald-500"
                      : isNext
                      ? "bg-blue-600"
                      : "bg-gray-200"
                  }`}
                >
                  {isWatched ? (
                    <CheckCircleIcon className="w-6 h-6 text-white" />
                  ) : isNext ? (
                    <PlayIcon className="w-6 h-6 text-white" />
                  ) : (
                    <LockClosedIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <p className={`font-semibold ${isWatched ? "text-emerald-700" : isNext ? "text-gray-900" : "text-gray-400"}`}>
                    Ad #{slotNum}
                  </p>
                  <p className={`text-xs mt-0.5 ${isWatched ? "text-emerald-500" : isNext ? "text-blue-600" : "text-gray-400"}`}>
                    {isWatched ? "Watched · Earned" : isNext ? "Tap to watch now" : "Locked — watch previous ads first"}
                  </p>
                </div>

                {/* Earning badge */}
                <div
                  className={`px-3 py-1.5 rounded-xl text-sm font-bold ${
                    isWatched
                      ? "bg-emerald-100 text-emerald-700"
                      : isNext
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {formatCurrency(earningPerAd)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

