"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  increment,
  query,
  where,
  getDocs,
  setDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";
import {
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  WalletIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  MinusIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon,
  ClockIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

// --- Sidebar Component ---
const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => {
  const menuItems = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "products", label: "Products", icon: ShoppingBagIcon },
    { id: "team", label: "Team", icon: UsersIcon },
    { id: "notifications", label: "Notifications", icon: BellIcon },
    { id: "profile", label: "Profile", icon: UserIcon },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 h-screen sticky top-0 bg-gradient-to-b from-emerald-900 to-emerald-800 text-white shadow-2xl">
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl font-bold">₦</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Atox</h1>
                <p className="text-sm text-white/60 font-medium">Earnings Platform</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                    activeTab === item.id
                      ? "bg-white/20 text-white shadow-lg shadow-black/20"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className={`w-6 h-6 ${
                    activeTab === item.id ? "text-white" : "text-white/50 group-hover:text-white/70"
                  }`} />
                  <span className="font-medium">{item.label}</span>
                  {activeTab === item.id && (
                    <span className="ml-auto w-1.5 h-8 bg-white rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={async () => {
                await signOut(auth);
                window.location.href = "/login";
              }}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/70 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 group"
            >
              <ArrowRightOnRectangleIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
        <div className="flex justify-around items-center px-2 py-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all ${
                  activeTab === item.id
                    ? "text-emerald-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-[10px] font-medium">{item.label}</span>
                {activeTab === item.id && (
                  <span className="w-4 h-0.5 bg-emerald-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

// --- Recharge Modal ---
const RechargeModal = ({ isOpen, onClose, onRecharge, userId }: { isOpen: boolean; onClose: () => void; onRecharge: (amount: number) => void; userId: string | null }) => {
  const [amount, setAmount] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState("");
  const [loading, setLoading] = useState(false);

  // Bank details - you can move this to environment variables or database
  const bankDetails = {
    bankName: process.env.NEXT_PUBLIC_BANK_NAME || "Access Bank",
    accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT || "1234567890",
    accountName: process.env.NEXT_PUBLIC_ACCOUNT_NAME || "Atox Earnings Platform",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert("User not authenticated");
      return;
    }
    const uid = userId;
    if (!amount || amount < 100) {
      alert("Minimum recharge amount is ₦100");
      return;
    }
    if (!paymentScreenshot) {
      alert("Please upload a payment screenshot");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "recharges"), {
        userId,
        amount: parseInt(amount),
        screenshotUrl: paymentScreenshot,
        status: "pending",
        bankDetails,
        createdAt: serverTimestamp(),
      });
      
      onClose();
      alert(`Recharge request of ₦${amount} submitted! It will reflect in your balance upon approval.`);
    } catch (error) {
      console.error("Error processing recharge:", error);
      alert("Failed to process recharge. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl transform transition-all scale-100 animate-in slide-in-from-bottom-4 duration-300">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
            <WalletIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-3">Recharge Wallet</h2>
          <p className="text-sm text-gray-500">Add funds to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Amount (₦)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount (min ₦100)"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              required
              min="100"
            />
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
            <p className="font-semibold text-gray-900 mb-3">💳 Bank Details</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Bank Name:</span>
                <span className="font-medium text-gray-900">{bankDetails.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Number:</span>
                <span className="font-medium text-gray-900">{bankDetails.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Name:</span>
                <span className="font-medium text-gray-900">{bankDetails.accountName}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Payment Screenshot
            </label>
            <ImageUpload
              onUploadSuccess={setPaymentScreenshot}
              folder="recharge-screenshots"
              buttonText="Upload Screenshot"
              acceptedFormats={["image/jpeg", "image/png", "image/jpg"]}
            />
            {paymentScreenshot && (
              <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Uploaded!</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50"
            >
              {loading ? "Processing..." : "Recharge"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Withdraw Modal ---
const WithdrawModal = ({ isOpen, onClose, onWithdraw, userId, balance, referralBalance }: { isOpen: boolean; onClose: () => void; onWithdraw: (amount: number, type: string) => void; userId: string | null; balance: number; referralBalance: number }) => {
  const [amount, setAmount] = useState("");
  const [balanceType, setBalanceType] = useState("referral");
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
  });
  const [loading, setLoading] = useState(false);

  // Check if Task withdrawal is allowed: Friday 8 AM - 8 PM Nigerian Time (UTC+1)
  const isTaskAllowed = (() => {
    const now = new Date();
    const nigeriaTime = new Date(now.getTime() + (1 * 60 * 60 * 1000) - (now.getTimezoneOffset() * 60 * 1000));
    const isFriday = nigeriaTime.getUTCDay() === 5;
    const hour = nigeriaTime.getUTCHours();
    return isFriday && hour >= 8 && hour < 20;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseInt(amount);
    
    if (!userId) {
      alert("User not authenticated");
      return;
    }
    const uid = userId;
    if (!amount || withdrawAmount < 5000) {
      alert("Minimum withdrawal is ₦5,000");
      return;
    }
    const isTask = balanceType === "task";
    const availableBalance = isTask ? balance : referralBalance;

    if (withdrawAmount > availableBalance) {
      alert(`Insufficient ${isTask ? "Task" : "Referral"} balance`);
      return;
    }

    if (isTask && !isTaskAllowed) {
      alert("Task Balance can only be withdrawn on Fridays between 8:00 AM and 8:00 PM (Nigerian Time).");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "withdrawals"), {
        userId,
        amount: withdrawAmount,
        bankDetails,
        status: "pending",
        balanceType: balanceType,
        createdAt: serverTimestamp(),
      });
      
      const userRef = doc(db, "users", uid);
      const balanceField = isTask ? "balance" : "referralBalance";
      await updateDoc(userRef, {
        [balanceField]: increment(-withdrawAmount),
      });
      
      onWithdraw(withdrawAmount, balanceType);
      onClose();
      alert(`Withdrawal of ₦${withdrawAmount} submitted successfully!`);
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      alert("Failed to process withdrawal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl transform transition-all scale-100 animate-in slide-in-from-bottom-4 duration-300">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-yellow-500/30">
            <ArrowUpIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-3">Withdraw Funds</h2>
          <p className="text-sm text-gray-500">Withdraw your earnings</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <ClockIcon className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-yellow-800">Withdrawal Schedule</p>
              <p className="text-xs text-yellow-700">Every Friday (8 AM - 8 PM) • Minimum ₦5,000</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Select Balance to Withdraw
            </label>
            <select
              value={balanceType}
              onChange={(e) => setBalanceType(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all mb-3"
            >
              <option value="referral">Referral Balance — {formatCurrency(referralBalance)} (Available anytime)</option>
              <option value="task" disabled={!isTaskAllowed}>Task Balance — {formatCurrency(balance)}{!isTaskAllowed ? " 🔒 (Fridays 8AM–8PM only)" : ""}</option>
            </select>

            {/* Lock notice when task is not available */}
            {!isTaskAllowed && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3 flex items-start gap-2">
                <span className="text-red-500 text-lg leading-none">🔒</span>
                <div>
                  <p className="text-sm font-semibold text-red-700">Task Balance Locked</p>
                  <p className="text-xs text-red-600">Task withdrawals are only available every <strong>Friday from 8:00 AM to 8:00 PM</strong> (Nigerian Time). You can still withdraw your Referral Balance now.</p>
                </div>
              </div>
            )}

            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Amount (₦)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount (min ₦5,000)"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
              required
              min="5000"
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Available: {formatCurrency(balanceType === "task" ? balance : referralBalance)}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700">Bank Details</p>
            <input
              type="text"
              value={bankDetails.bankName}
              onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
              placeholder="Bank Name"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
              required
            />
            <input
              type="text"
              value={bankDetails.accountNumber}
              onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
              placeholder="Account Number"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
              required
            />
            <input
              type="text"
              value={bankDetails.accountName}
              onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})}
              placeholder="Account Name"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
              required
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-500/30 transition-all disabled:opacity-50"
            >
              {loading ? "Processing..." : "Withdraw"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Home Tab ---
const HomeTab = ({ userData, userId }: { userData: any; userId: string | null }) => {
  const [balance, setBalance] = useState(userData?.balance || 0);
  const [referralBalance, setReferralBalance] = useState(userData?.referralBalance || 0);
  const [totalEarned, setTotalEarned] = useState(userData?.totalEarned || 0);
  const [purchasedProducts, setPurchasedProducts] = useState<any[]>([]);
  const [adProgress, setAdProgress] = useState<Record<string, number>>({}); // productId -> adsWatchedToday
  const [todayEarned, setTodayEarned] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showRecharge, setShowRecharge] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const router = useRouter();

  const todayKey = new Date().toISOString().split("T")[0]; // e.g. "2024-06-28"

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      try {
        // Fetch purchased plans
        const q = query(collection(db, "purchases"), where("userId", "==", userId));
        const snapshot = await getDocs(q);
        const purchases = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setPurchasedProducts(purchases);

        // Fetch today's ad progress for each plan
        const progressMap: Record<string, number> = {};
        let todayTotal = 0;
        for (const plan of purchases) {
          const progressRef = doc(db, "adProgress", `${userId}_${plan.productId}_${todayKey}`);
          const progressDoc = await getDoc(progressRef);
          if (progressDoc.exists()) {
            const data = progressDoc.data();
            progressMap[plan.productId] = data.adsWatched || 0;
            todayTotal += data.earned || 0;
          } else {
            progressMap[plan.productId] = 0;
          }
        }
        setAdProgress(progressMap);
        setTodayEarned(todayTotal);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleRecharge = (amount: number) => { setBalance(prev => prev + amount); };
  const handleWithdraw = (amount: number, type: string) => {
    if (type === "task") setBalance(prev => prev - amount);
    else setReferralBalance(prev => prev - amount);
  };

  return (
    <div className="p-6 pb-24 lg:pb-6 space-y-6 bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 min-h-screen">
      {/* Recharge Modal */}
      <RechargeModal
        isOpen={showRecharge}
        onClose={() => setShowRecharge(false)}
        onRecharge={handleRecharge}
        userId={userId}
      />

      {/* Withdraw Modal */}
      <WithdrawModal
        isOpen={showWithdraw}
        onClose={() => setShowWithdraw(false)}
        onWithdraw={handleWithdraw}
        userId={userId}
        balance={balance}
        referralBalance={referralBalance}
      />

      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, <span className="text-emerald-600">👋</span>
          </h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your earnings</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <span className="text-sm font-medium text-gray-600">🇳🇬 Nigeria</span>
          <span className="w-px h-6 bg-gray-200" />
          <span className="text-sm font-semibold text-gray-900">NGN</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Balance</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(balance)}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <WalletIcon className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Available</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Referral Balance</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(referralBalance)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ArrowUpIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">All Time</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Plans</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{purchasedProducts.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <ShoppingBagIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Active</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Today's Earnings</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(todayEarned)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Today</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setShowRecharge(true)}
          className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Recharge
        </button>
        <button
          onClick={() => setShowWithdraw(true)}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-500/30 transition-all flex items-center gap-2"
        >
          <ArrowUpIcon className="w-5 h-5" />
          Withdraw
        </button>
      </div>

      {/* Withdraw Info Banner */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <ClockIcon className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="font-semibold text-yellow-800">📌 Withdrawal Schedule</p>
            <p className="text-sm text-yellow-700">
              Every Friday from 8 AM to 8 PM (Minimum ₦5,000)
            </p>
          </div>
        </div>
      </div>

      {/* Purchased Products - Now redirects to plan page */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Your Plans</h2>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : purchasedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShoppingBagIcon className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No products purchased yet</p>
            <p className="text-sm text-gray-400 mt-1">Visit the Products page to buy packages and start earning</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {purchasedProducts.map((product) => {
              const watched = adProgress[product.productId] || 0;
              const totalAds = product.ads || 20;
              const earningPerAd = (product.dailyIncome || 750) / totalAds;
              const isDone = watched >= totalAds;
              const progressPct = (watched / totalAds) * 100;

              return (
                <div key={product.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{product.name}</h4>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full mt-1 inline-block ${isDone ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                        {isDone ? "✅ Completed Today" : "📺 Active"}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Daily Income</p>
                      <p className="text-lg font-bold text-emerald-600">{formatCurrency(product.dailyIncome)}</p>
                    </div>
                  </div>

                  {/* Ad Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 font-medium">Ads Watched Today</span>
                      <span className="font-bold text-gray-900">{watched} / {totalAds}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${isDone ? "bg-emerald-500" : "bg-blue-500"}`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Earned: {formatCurrency(watched * earningPerAd)}</span>
                      <span>Remaining: {formatCurrency((totalAds - watched) * earningPerAd)}</span>
                    </div>
                  </div>

                  {/* Watch Ad Button */}
                  <button
                    onClick={() => router.push(`/plan/${product.productId}`)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      isDone
                        ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
                    }`}
                  >
                    {isDone ? (
                      "✅ Completed (View Details)"
                    ) : (
                      <>
                        <span>📺</span>
                        <span>Watch Ads to Earn {formatCurrency(product.dailyIncome)}</span>
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-400 text-center mt-2">
                    Purchased: {new Date(product.purchasedAt?.toDate?.() || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Products Tab ---
const ProductsTab = ({ userId }: { userId: string | null }) => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const products = [
    {
      id: "vip1",
      name: "VIP 1",
      ads: 20,
      price: 3000,
      term: "30 days",
      dailyIncome: 750,
      totalIncome: 22000,
      color: "from-emerald-500 to-green-600",
      badge: "Popular",
    },
    {
      id: "vip2",
      name: "VIP 2",
      ads: 35,
      price: 5000,
      term: "30 days",
      dailyIncome: 1200,
      totalIncome: 36000,
      color: "from-blue-500 to-indigo-600",
      badge: "Pro",
    },
    {
      id: "vip3",
      name: "VIP 3",
      ads: 50,
      price: 10000,
      term: "30 days",
      dailyIncome: 2200,
      totalIncome: 66000,
      color: "from-purple-500 to-pink-600",
      badge: "Premium",
    },
  ];

  // Bank details - you can move this to environment variables or database
  const bankDetails = {
    bankName: process.env.NEXT_PUBLIC_BANK_NAME || "Access Bank",
    accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT || "1234567890",
    accountName: process.env.NEXT_PUBLIC_ACCOUNT_NAME || "Atox Earnings Platform",
  };

  useEffect(() => {
    const fetchPayments = async () => {
      if (!userId) return;
      try {
        const q = query(
          collection(db, "payments"),
          where("userId", "==", userId)
        );
        const snapshot = await getDocs(q);
        const paymentData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPayments(paymentData);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [userId]);

  const handleBuyNow = async (product: any) => {
    if (!userId) {
      alert("Please login first");
      return;
    }

    // 1. Check if they already have a pending payment for this plan
    const hasPending = payments.some(p => p.productId === product.id && p.status === "pending");
    if (hasPending) {
      alert("You already have a pending payment for this plan. Please wait for admin approval.");
      return;
    }

    // 2. Check if they already own this plan (active purchase)
    try {
      const q = query(
        collection(db, "purchases"),
        where("userId", "==", userId),
        where("productId", "==", product.id)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        alert("You already have an active subscription for this plan! You cannot purchase it again until your current plan expires.");
        return;
      }
    } catch (error) {
      console.error("Error checking active purchases:", error);
      alert("Failed to verify plan status. Please try again.");
      return;
    }

    setSelectedProduct(product);
    setShowPaymentModal(true);
    setPaymentScreenshot("");
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !selectedProduct || !paymentScreenshot) {
      alert("Please upload payment screenshot");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "payments"), {
        userId,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        amount: selectedProduct.price,
        screenshotUrl: paymentScreenshot,
        status: "pending",
        bankDetails,
        submittedAt: serverTimestamp(),
      });

      alert("Payment submitted successfully! Your purchase will be processed after verification.");
      setShowPaymentModal(false);
      setSelectedProduct(null);
      setPaymentScreenshot("");
      
      // Refresh payments
      const q = query(collection(db, "payments"), where("userId", "==", userId));
      const snapshot = await getDocs(q);
      setPayments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error submitting payment:", error);
      alert("Failed to submit payment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 pb-24 lg:pb-6 bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Investment Plans</h1>
        <p className="text-gray-500 mt-1">Choose a plan that fits your goals</p>
      </div>

      {/* Payment History */}
      {!loading && payments.length > 0 && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Payment History</h3>
          <div className="space-y-2">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    payment.status === "approved" ? "bg-emerald-100" : 
                    payment.status === "rejected" ? "bg-red-100" : "bg-yellow-100"
                  }`}>
                    {payment.status === "approved" ? (
                      <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                    ) : payment.status === "rejected" ? (
                      <ClockIcon className="w-5 h-5 text-red-600" />
                    ) : (
                      <ClockIcon className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{payment.productName}</p>
                    <p className="text-xs text-gray-400">{formatCurrency(payment.amount)}</p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  payment.status === "approved" ? "bg-emerald-50 text-emerald-600" :
                  payment.status === "rejected" ? "bg-red-50 text-red-600" :
                  "bg-yellow-50 text-yellow-600"
                }`}>
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden"
          >
            <div className={`bg-gradient-to-r ${product.color} p-6 text-white`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{product.name}</h3>
                  <p className="text-white/80 text-sm mt-0.5">{product.badge} Plan</p>
                </div>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                  {product.ads} ads
                </span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold">{formatCurrency(product.price)}</span>
                <span className="text-white/70 text-sm ml-1">one-time</span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Daily Ads</span>
                  <span className="font-medium text-gray-700">{product.ads} ads</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium text-gray-700">30 days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Daily Income</span>
                  <span className="font-medium text-emerald-600">{formatCurrency(product.dailyIncome)}</span>
                </div>
                <div className="flex justify-between text-sm pb-2 border-b border-gray-100">
                  <span className="text-gray-500">Total Return</span>
                  <span className="font-bold text-gray-900">{formatCurrency(product.totalIncome)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">ROI</span>
                  <span className="font-semibold text-emerald-600">+{Math.round((product.totalIncome / product.price) * 100)}%</span>
                </div>
              </div>

              <button
                onClick={() => handleBuyNow(product)}
                className={`w-full py-3.5 bg-gradient-to-r ${product.color} text-white rounded-xl font-semibold hover:shadow-lg transition-all`}
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                <WalletIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mt-3">Complete Payment</h2>
              <p className="text-sm text-gray-500">Pay for {selectedProduct.name}</p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
              <p className="font-semibold text-gray-900 mb-3">💳 Bank Details</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank Name:</span>
                  <span className="font-medium text-gray-900">{bankDetails.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Number:</span>
                  <span className="font-medium text-gray-900">{bankDetails.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Name:</span>
                  <span className="font-medium text-gray-900">{bankDetails.accountName}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-emerald-200">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold text-emerald-600">{formatCurrency(selectedProduct.price)}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Screenshot
                </label>
                <ImageUpload
                  onUploadSuccess={setPaymentScreenshot}
                  folder="payment-screenshots"
                  buttonText="Upload Screenshot"
                  acceptedFormats={["image/jpeg", "image/png", "image/jpg"]}
                />
                {paymentScreenshot && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Image URL:</p>
                    <p className="text-xs text-emerald-600 break-all">{paymentScreenshot}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedProduct(null);
                    setPaymentScreenshot("");
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !paymentScreenshot}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Team Tab ---
const TeamTab = ({ userId }: { userId: string | null }) => {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!userId) return;
      try {
        // Step 1: Get this user's own document to find their myInvitationCode
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        let code = "";
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.myInvitationCode) {
            // Use the stored code
            code = userData.myInvitationCode;
          } else {
            // Old account — generate the code and save it to Firestore
            code = `ATOX-${userId.slice(0, 6).toUpperCase()}`;
            await updateDoc(userDocRef, { myInvitationCode: code, referralBalance: userData.referralBalance ?? 0 });
          }
        }
        setReferralCode(code);

        // Step 2: Query users who were referred by this userId
        const q = query(
          collection(db, "users"),
          where("referredBy", "==", userId)
        );
        const snapshot = await getDocs(q);
        const refs = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setReferrals(refs);
      } catch (error) {
        console.error("Error fetching referrals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, [userId]);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    alert("Referral code copied! Share it with friends so they can enter it when registering.");
  };

  return (
    <div className="p-6 pb-24 lg:pb-6 bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Team & Referrals</h1>
        <p className="text-gray-500 mt-1">Invite friends and earn commissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Referrals</p>
              <p className="text-2xl font-bold text-gray-900">{referrals.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ArrowUpIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Level 1 Commission</p>
              <p className="text-2xl font-bold text-gray-900">20%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <ArrowDownIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Level 2 Commission</p>
              <p className="text-2xl font-bold text-gray-900">3%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200 mb-6">
        <div className="flex flex-col gap-3">
          <div>
            <p className="font-semibold text-gray-900 text-lg">🎁 Your Referral Code</p>
            <p className="text-sm text-gray-600 mt-1">Share this code with friends. When they register and enter your code, you earn <strong>10%</strong> of their first product purchase!</p>
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex-1 px-5 py-3 border-2 border-emerald-300 rounded-xl bg-white text-lg font-bold text-emerald-700 tracking-widest text-center select-all">
              {referralCode}
            </div>
            <button
              onClick={copyReferralCode}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition flex items-center gap-2 whitespace-nowrap"
            >
              <ClipboardDocumentIcon className="w-5 h-5" />
              Copy Code
            </button>
          </div>
          <p className="text-xs text-gray-500">💡 Ask your friend to enter this code in the <strong>"Invitation Code"</strong> field on the Register page.</p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Your Referrals</h3>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : referrals.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <UsersIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No referrals yet</p>
            <p className="text-sm text-gray-400 mt-1">Share your code and start earning</p>
          </div>
        ) : (
          <div className="space-y-2">
            {referrals.map((ref) => (
              <div
                key={ref.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{ref.email || "User"}</p>
                    <p className="text-xs text-gray-400">ID: {ref.id?.slice(0, 8)}</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-medium">Joined</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Notifications Tab ---
const NotificationsTab = ({ userId }: { userId: string | null }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) return;
      try {
        const q = query(
          collection(db, "notifications"),
          where("userId", "==", userId)
        );
        const snapshot = await getDocs(q);
        const notifs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Sort by createdAt descending locally since we don't have a composite index set up yet
        notifs.sort((a: any, b: any) => {
          const timeA = a.createdAt?.toMillis?.() || 0;
          const timeB = b.createdAt?.toMillis?.() || 0;
          return timeB - timeA;
        });
        setNotifications(notifs);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [userId]);

  return (
    <div className="p-6 pb-24 lg:pb-6 bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-500 mt-1">Updates on your requests and account</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BellIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No notifications yet</p>
            <p className="text-sm text-gray-400 mt-1">When your requests are approved, they will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  notif.type === "success" ? "bg-emerald-100 text-emerald-600" :
                  notif.type === "error" ? "bg-red-100 text-red-600" :
                  "bg-blue-100 text-blue-600"
                }`}>
                  <BellIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{notif.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {notif.createdAt?.toDate?.()?.toLocaleString() || "Just now"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Profile Tab ---
const ProfileTab = ({ userData, userId }: { userData: { email?: string; balance?: number; totalEarned?: number } | null; userId: string | null }) => {
  const [withdrawHistory, setWithdrawHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      if (!userId) return;
      try {
        const q = query(
          collection(db, "withdrawals"),
          where("userId", "==", userId)
        );
        const snapshot = await getDocs(q);
        const history = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWithdrawHistory(history);
      } catch (error) {
        console.error("Error fetching withdrawals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWithdrawals();
  }, [userId]);

  return (
    <div className="p-6 pb-24 lg:pb-6 bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-500 mt-1">Manage your account settings</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-3xl text-white shadow-lg shadow-emerald-500/30">
            {userData?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{userData?.email || "User"}</p>
            <p className="text-sm text-gray-500">User ID: {userId?.slice(0, 12)}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-medium">Verified</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div>
            <p className="text-sm text-gray-500">Balance</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(userData?.balance || 0)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Earned</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(userData?.totalEarned || 0)}</p>
          </div>
        </div>
      </div>

      {/* Withdraw History */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Withdraw History</h3>
          <span className="text-xs text-gray-400">{withdrawHistory.length} transactions</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : withdrawHistory.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <ClockIcon className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No withdrawals yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {withdrawHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <ArrowUpIcon className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{formatCurrency(item.amount)}</p>
                    <p className="text-xs text-gray-400">{item.status || "Pending"}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {item.createdAt?.toDate?.()?.toLocaleDateString() || "N/A"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Account Settings</h3>
        <div className="space-y-2">
          <Link href="/about" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition group">
            <span className="text-gray-700 group-hover:text-emerald-600">ℹ️ About Us</span>
            <span className="text-gray-400 group-hover:translate-x-1 transition">→</span>
          </Link>
          <Link href="/change-password" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition group">
            <span className="text-gray-700 group-hover:text-emerald-600">🔑 Change Password</span>
            <span className="text-gray-400 group-hover:translate-x-1 transition">→</span>
          </Link>
          <button
            onClick={async () => {
              await signOut(auth);
              window.location.href = "/login";
            }}
            className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-red-50 transition group"
          >
            <span className="text-red-600 group-hover:text-red-700">🚪 Logout</span>
            <span className="text-gray-400 group-hover:translate-x-1 transition">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [userData, setUserData] = useState<{ email?: string; balance?: number; totalEarned?: number } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.uid);
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          await setDoc(userRef, {
            email: user.email,
            balance: 0,
            totalEarned: 0,
            referredBy: null,
            createdAt: serverTimestamp(),
          });
          setUserData({ email: user.email || "", balance: 0, totalEarned: 0 });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-y-auto">
        {activeTab === "home" && (
          <HomeTab userData={userData} userId={userId} />
        )}
        {activeTab === "products" && <ProductsTab userId={userId} />}
        {activeTab === "team" && <TeamTab userId={userId} />}
        {activeTab === "notifications" && <NotificationsTab userId={userId} />}
        {activeTab === "profile" && (
          <ProfileTab userData={userData} userId={userId} />
        )}
      </div>
    </div>
  );
}