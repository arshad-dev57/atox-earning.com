"use client";

<<<<<<< HEAD
import { useState, useEffect } from "react";
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
import { getPlan } from "@/lib/plans";
import { isPurchaseActive } from "@/lib/purchases";
import { AD_VIDEO_MODE } from "@/lib/ads";
import PlanVideoAd from "@/components/PlanVideoAd";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);

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
  const [adCompleted, setAdCompleted] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);

  const todayKey = new Date().toISOString().split("T")[0];

  const product = getPlan(productId);
=======
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PlanDetailPage() {
  const router = useRouter();
>>>>>>> f8e1e16 (worked on withdrawl of 2k)

  // Auth check
  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

<<<<<<< HEAD
  // Fetch purchase + progress
  useEffect(() => {
    if (!userId || !product) return;
    const fetchData = async () => {
      try {
        // Get active purchase doc
        const q = query(
          collection(db, "purchases"),
          where("userId", "==", userId),
          where("productId", "==", productId)
        );
        const snap = await getDocs(q);
        const active = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as any))
          .find((p) => isPurchaseActive(p));
        if (active) {
          setPurchase(active);
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

  const startAd = (slotIndex: number) => {
    // slotIndex is 1-based; only allow the next unwatched
    if (slotIndex !== adsWatched + 1) return;
    if (adsWatched >= (product?.ads || 0)) return;

    setPlayingAd(slotIndex);
    setAdCompleted(false);
    setAdError(null);
  };

  const claimReward = async () => {
    if (!userId || !product || claiming || !adCompleted) return;
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
      setAdError(null);
    } catch (err) {
      console.error("Error claiming reward:", err);
      toast.error("Failed to claim reward. Please try again.");
    } finally {
      setClaiming(false);
    }
  };

  const closePlayer = () => {
    setPlayingAd(null);
    setAdCompleted(false);
    setAdError(null);
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

=======
>>>>>>> f8e1e16 (worked on withdrawl of 2k)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}

