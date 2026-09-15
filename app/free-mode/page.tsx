"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  PlayIcon,
  TrophyIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { settleExpiredPlansForUser } from "@/lib/settle-expired-plans";
import { AD_VIDEO_MODE, openAdsterraSmartlink } from "@/lib/ads";
import { FREE_MODE_EARNING_PER_AD, FREE_MODE_ID } from "@/lib/free-mode";
import PlanVideoAd from "@/components/PlanVideoAd";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);

export default function FreeModePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [adsWatched, setAdsWatched] = useState(0);
  const [todayEarned, setTodayEarned] = useState(0);
  const [loading, setLoading] = useState(true);

  const [playingAd, setPlayingAd] = useState(false);
  const [adCompleted, setAdCompleted] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [slotKey, setSlotKey] = useState(0);

  const todayKey = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.uid);
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      try {
        const settled = await settleExpiredPlansForUser(userId);
        const active = settled.hasActivePlan;
        setHasActivePlan(active);

        if (!active) {
          const progressRef = doc(db, "adProgress", `${userId}_${FREE_MODE_ID}_${todayKey}`);
          const progressDoc = await getDoc(progressRef);
          if (progressDoc.exists()) {
            setAdsWatched(progressDoc.data().adsWatched || 0);
            setTodayEarned(progressDoc.data().earned || 0);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, todayKey]);

  const startAd = () => {
    if (hasActivePlan || claiming) return;
    openAdsterraSmartlink();
    setSlotKey((k) => k + 1);
    setPlayingAd(true);
    setAdCompleted(false);
    setAdError(null);
  };

  const claimReward = async () => {
    if (!userId || claiming || !adCompleted || hasActivePlan) return;
    setClaiming(true);
    try {
      const earning = FREE_MODE_EARNING_PER_AD;
      const newWatched = adsWatched + 1;
      const progressRef = doc(db, "adProgress", `${userId}_${FREE_MODE_ID}_${todayKey}`);

      await setDoc(
        progressRef,
        {
          userId,
          productId: FREE_MODE_ID,
          date: todayKey,
          adsWatched: newWatched,
          earned: todayEarned + earning,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await updateDoc(doc(db, "users", userId), {
        balance: increment(earning),
        totalEarned: increment(earning),
      });

      setAdsWatched(newWatched);
      setTodayEarned((prev) => prev + earning);
      setPlayingAd(false);
      setAdCompleted(false);
      setAdError(null);
      toast.success(`You earned ${formatCurrency(earning)}!`);
    } catch (err) {
      console.error("Error claiming free mode reward:", err);
      toast.error("Failed to claim reward. Please try again.");
    } finally {
      setClaiming(false);
    }
  };

  const closePlayer = () => {
    setPlayingAd(false);
    setAdCompleted(false);
    setAdError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (hasActivePlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm max-w-md w-full">
          <LockClosedIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-800 font-semibold text-lg">Free Mode is locked</p>
          <p className="text-sm text-gray-500 mt-2">
            You already have an active VIP plan. Use your plan tasks to earn instead.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-5 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/40 pb-24">
      {playingAd && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div>
                <p className="text-white font-semibold text-sm">Free Mode Ad</p>
                <p className="text-gray-400 text-xs">
                  Earn {formatCurrency(FREE_MODE_EARNING_PER_AD)} · Ad #{adsWatched + 1}
                </p>
              </div>
              {adCompleted && (
                <button
                  onClick={closePlayer}
                  className="text-gray-500 hover:text-gray-300 text-xs transition"
                >
                  Close
                </button>
              )}
            </div>

            <div className="relative bg-black overflow-hidden" style={{ paddingTop: "56.25%" }}>
              <div className="absolute inset-0">
                {!adCompleted && !adError && (
                  <PlanVideoAd
                    slotKey={slotKey}
                    onCompleted={() => {
                      setAdCompleted(true);
                      setAdError(null);
                    }}
                    onError={(message) => {
                      setAdError(message);
                      setAdCompleted(false);
                      toast.error(message);
                    }}
                  />
                )}
                {adCompleted && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/40">
                        <CheckCircleIcon className="w-9 h-9 text-white" />
                      </div>
                      <p className="text-white font-bold text-lg">Ad Complete!</p>
                      <p className="text-emerald-400 text-sm">Claim your reward below</p>
                    </div>
                  </div>
                )}
                {adError && !adCompleted && (
                  <div className="absolute inset-0 bg-black flex items-center justify-center p-6 text-center z-10">
                    <div>
                      <p className="text-red-400 font-semibold mb-2">Ad did not complete</p>
                      <p className="text-gray-400 text-sm mb-4">{adError}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setAdError(null);
                          setAdCompleted(false);
                          setSlotKey((k) => k + 1);
                        }}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

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
                      Claim {formatCurrency(FREE_MODE_EARNING_PER_AD)}
                    </>
                  )}
                </button>
              ) : (
                <p className="text-center text-gray-400 text-sm">
                  {AD_VIDEO_MODE === "vast"
                    ? "Watch the full Adsterra video ad to unlock your reward"
                    : "Watch the full video to unlock your reward"}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
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
              <h1 className="text-3xl font-bold">Free Mode</h1>
              <p className="text-white/70 mt-1 text-sm">
                Watch unlimited ads · {formatCurrency(FREE_MODE_EARNING_PER_AD)} per video
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60">Per Ad</p>
              <p className="text-2xl font-bold">{formatCurrency(FREE_MODE_EARNING_PER_AD)}</p>
            </div>
          </div>

          <div className="mt-5 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white/80">Today&apos;s Free Mode</span>
              <span className="font-bold text-white">{adsWatched} ads</span>
            </div>
            <p className="text-xs text-white/70">
              Earned today: {formatCurrency(todayEarned)} · Unlimited ads available
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-start gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
              <PlayIcon className="w-6 h-6 text-teal-700" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">How Free Mode works</p>
              <p className="text-sm text-gray-500 mt-1">
                Tap watch → an ad opens → then watch the video → claim{" "}
                {formatCurrency(FREE_MODE_EARNING_PER_AD)}. Repeat as many times as you want.
              </p>
            </div>
          </div>

          <button
            onClick={startAd}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-base hover:shadow-lg hover:shadow-teal-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <PlayIcon className="w-6 h-6" />
            Watch Ad &amp; Earn {formatCurrency(FREE_MODE_EARNING_PER_AD)}
          </button>

          <p className="text-xs text-gray-400 text-center mt-3">
            Example: 1,000 ads ≈ {formatCurrency(1000 * FREE_MODE_EARNING_PER_AD)}
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
          Free Mode is for users without a VIP plan. Buy any plan from Products for higher daily
          income.
        </div>
      </div>
    </div>
  );
}
