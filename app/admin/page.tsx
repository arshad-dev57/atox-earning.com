"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  increment,
  addDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import {
  CheckCircleIcon,
  XCircleIcon,
  WalletIcon,
  ShoppingBagIcon,
  ArrowUpIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const PRODUCTS = [
  {
    id: "vip1",
    name: "VIP 1",
    ads: 20,
    price: 3000,
    term: "30 days",
    dailyIncome: 750,
    totalIncome: 22000,
  },
  {
    id: "vip2",
    name: "VIP 2",
    ads: 35,
    price: 5000,
    term: "30 days",
    dailyIncome: 1200,
    totalIncome: 36000,
  },
  {
    id: "vip3",
    name: "VIP 3",
    ads: 50,
    price: 10000,
    term: "30 days",
    dailyIncome: 2200,
    totalIncome: 66000,
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("recharges");
  const [recharges, setRecharges] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Strict authentication check checking for the admin flag
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/login");
      } else {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().isAdmin) {
          fetchData();
        } else {
          router.push("/dashboard");
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const qRecharges = query(collection(db, "recharges"), where("status", "==", "pending"));
      const snapRecharges = await getDocs(qRecharges);
      setRecharges(snapRecharges.docs.map(d => ({ id: d.id, ...d.data() })));

      const qWithdrawals = query(collection(db, "withdrawals"), where("status", "==", "pending"));
      const snapWithdrawals = await getDocs(qWithdrawals);
      setWithdrawals(snapWithdrawals.docs.map(d => ({ id: d.id, ...d.data() })));

      const qPayments = query(collection(db, "payments"), where("status", "==", "pending"));
      const snapPayments = await getDocs(qPayments);
      setPayments(snapPayments.docs.map(d => ({ id: d.id, ...d.data() })));

      const qUsers = query(collection(db, "users"));
      const snapUsers = await getDocs(qUsers);
      setUsers(snapUsers.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRecharge = async (id: string, userId: string, amount: number) => {
    try {
      const docRef = doc(db, "recharges", id);
      await updateDoc(docRef, { status: "approved" });

      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { balance: increment(amount) });

      await addDoc(collection(db, "notifications"), {
        userId,
        title: "Recharge Approved",
        message: `Your recharge of ${formatCurrency(amount)} has been approved and added to your balance.`,
        type: "success",
        createdAt: serverTimestamp(),
      });

      alert("Recharge approved!");
      fetchData();
    } catch (error) {
      console.error("Error approving recharge:", error);
      alert("Failed to approve recharge.");
    }
  };

  const handleRejectRecharge = async (id: string, userId: string, amount: number) => {
    try {
      const docRef = doc(db, "recharges", id);
      await updateDoc(docRef, { status: "rejected" });

      await addDoc(collection(db, "notifications"), {
        userId,
        title: "Recharge Rejected",
        message: `Your recharge request of ${formatCurrency(amount)} was rejected.`,
        type: "error",
        createdAt: serverTimestamp(),
      });

      alert("Recharge rejected!");
      fetchData();
    } catch (error) {
      console.error("Error rejecting recharge:", error);
      alert("Failed to reject recharge.");
    }
  };

  const handleApproveWithdrawal = async (id: string, userId: string, amount: number, balanceType?: string) => {
    try {
      const docRef = doc(db, "withdrawals", id);
      await updateDoc(docRef, { status: "approved" });


      await addDoc(collection(db, "notifications"), {
        userId,
        title: "Withdrawal Approved",
        message: `Your withdrawal of ${formatCurrency(amount)} has been approved and sent to your bank account.`,
        type: "success",
        createdAt: serverTimestamp(),
      });

      alert("Withdrawal approved!");
      fetchData();
    } catch (error) {
      console.error("Error approving withdrawal:", error);
      alert("Failed to approve withdrawal.");
    }
  };

  const handleRejectWithdrawal = async (id: string, userId: string, amount: number, balanceType?: string) => {
    try {
      const docRef = doc(db, "withdrawals", id);
      await updateDoc(docRef, { status: "rejected" });

      // Refund the user's specific balance
      const userRef = doc(db, "users", userId);
      const balanceField = balanceType === "referral" ? "referralBalance" : "balance";
      await updateDoc(userRef, { [balanceField]: increment(amount) });

      await addDoc(collection(db, "notifications"), {
        userId,
        title: "Withdrawal Rejected",
        message: `Your withdrawal of ${formatCurrency(amount)} was rejected and refunded to your balance.`,
        type: "error",
        createdAt: serverTimestamp(),
      });

      alert("Withdrawal rejected!");
      fetchData();
    } catch (error) {
      console.error("Error rejecting withdrawal:", error);
      alert("Failed to reject withdrawal.");
    }
  };

  const handleApprovePayment = async (id: string, userId: string, productId: string, productName: string, amount: number) => {
    try {
      const product = PRODUCTS.find((p) => p.id === productId);
      if (!product) {
        alert("Product not found!");
        return;
      }

      const docRef = doc(db, "payments", id);
      await updateDoc(docRef, { status: "approved" });

      await addDoc(collection(db, "purchases"), {
        userId,
        productId: product.id,
        name: product.name,
        ads: product.ads,
        price: product.price,
        dailyIncome: product.dailyIncome,
        totalIncome: product.totalIncome,
        purchasedAt: serverTimestamp(),
      });

      // Handle Referral Bonus (10% of price)
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.referredBy) {
          const referrerRef = doc(db, "users", userData.referredBy);
          const referrerDoc = await getDoc(referrerRef);
          if (referrerDoc.exists()) {
            const referralBonus = product.price * 0.10; // 10%
            await updateDoc(referrerRef, {
              referralBalance: increment(referralBonus),
              referralCount: increment(1)
            });
            await addDoc(collection(db, "notifications"), {
              userId: userData.referredBy,
              title: "Referral Bonus Received!",
              message: `You earned ${formatCurrency(referralBonus)} from a referral's purchase of ${productName}.`,
              type: "success",
              createdAt: serverTimestamp(),
            });
          }
        }
      }

      await addDoc(collection(db, "notifications"), {
        userId,
        title: "Purchase Approved",
        message: `Your purchase of ${productName} has been approved.`,
        type: "success",
        createdAt: serverTimestamp(),
      });

      alert("Payment approved!");
      fetchData();
    } catch (error) {
      console.error("Error approving payment:", error);
      alert("Failed to approve payment.");
    }
  };

  const handleRejectPayment = async (id: string, userId: string, productName: string) => {
    try {
      const docRef = doc(db, "payments", id);
      await updateDoc(docRef, { status: "rejected" });

      await addDoc(collection(db, "notifications"), {
        userId,
        title: "Purchase Rejected",
        message: `Your purchase of ${productName} was rejected.`,
        type: "error",
        createdAt: serverTimestamp(),
      });

      alert("Payment rejected!");
      fetchData();
    } catch (error) {
      console.error("Error rejecting payment:", error);
      alert("Failed to reject payment.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-900 text-white min-h-screen p-6">
        <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("recharges")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === "recharges" ? "bg-slate-800 text-emerald-400" : "hover:bg-slate-800/50"}`}
          >
            <WalletIcon className="w-5 h-5" />
            Recharges ({recharges.length})
          </button>
          <button
            onClick={() => setActiveTab("withdrawals")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === "withdrawals" ? "bg-slate-800 text-emerald-400" : "hover:bg-slate-800/50"}`}
          >
            <ArrowUpIcon className="w-5 h-5" />
            Withdrawals ({withdrawals.length})
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === "payments" ? "bg-slate-800 text-emerald-400" : "hover:bg-slate-800/50"}`}
          >
            <ShoppingBagIcon className="w-5 h-5" />
            Purchases ({payments.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === "users" ? "bg-slate-800 text-emerald-400" : "hover:bg-slate-800/50"}`}
          >
            <UsersIcon className="w-5 h-5" />
            Users ({users.length})
          </button>
        </nav>
        
        <div className="mt-8 border-t border-slate-800 pt-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-slate-800/50 transition"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 capitalize">Pending {activeTab}</h2>
          <button onClick={fetchData} className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 text-sm font-medium text-gray-700">
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === "recharges" && recharges.length === 0 && <p className="text-gray-500">No pending recharges.</p>}
            {activeTab === "recharges" && recharges.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(item.amount)}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.createdAt?.toDate?.()?.toLocaleString()}</p>
                  {(() => {
                    const user = users.find(u => u.id === item.userId);
                    return user ? (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-xs text-gray-500 font-semibold mb-1">User Details</p>
                        <p className="text-sm text-gray-900 font-medium">{user.fullName}</p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-600">{user.phone}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mt-2">User ID: {item.userId}</p>
                    );
                  })()}
                </div>
                {item.screenshotUrl && (
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-2">Proof of Payment</p>
                    <a href={item.screenshotUrl} target="_blank" rel="noopener noreferrer" className="block relative group w-32 h-32">
                      <img src={item.screenshotUrl} alt="Payment Screenshot" className="w-full h-full object-cover rounded-xl border-2 border-gray-100 group-hover:border-emerald-500 transition-colors shadow-sm" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">View Full</span>
                      </div>
                    </a>
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={() => handleApproveRecharge(item.id, item.userId, item.amount)} className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg font-semibold flex items-center gap-1 transition">
                    <CheckCircleIcon className="w-5 h-5" /> Approve
                  </button>
                  <button onClick={() => handleRejectRecharge(item.id, item.userId, item.amount)} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-semibold flex items-center gap-1 transition">
                    <XCircleIcon className="w-5 h-5" /> Reject
                  </button>
                </div>
              </div>
            ))}

            {activeTab === "withdrawals" && withdrawals.length === 0 && <p className="text-gray-500">No pending withdrawals.</p>}
            {activeTab === "withdrawals" && withdrawals.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(item.amount)}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.createdAt?.toDate?.()?.toLocaleString()}</p>
                  {(() => {
                    const user = users.find(u => u.id === item.userId);
                    return user ? (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-xs text-gray-500 font-semibold mb-1">User Details</p>
                        <p className="text-sm text-gray-900 font-medium">{user.fullName}</p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-600">{user.phone}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mt-2">User ID: {item.userId}</p>
                    );
                  })()}
                </div>
                <div className="flex-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Bank Details</p>
                  <p className="text-sm font-medium text-gray-900">{item.bankDetails?.bankName}</p>
                  <p className="text-sm font-medium text-gray-900">{item.bankDetails?.accountNumber}</p>
                  <p className="text-sm font-medium text-gray-900">{item.bankDetails?.accountName}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleApproveWithdrawal(item.id, item.userId, item.amount, item.balanceType)} className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg font-semibold flex items-center gap-1 transition">
                    <CheckCircleIcon className="w-5 h-5" /> Approve
                  </button>
                  <button onClick={() => handleRejectWithdrawal(item.id, item.userId, item.amount, item.balanceType)} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-semibold flex items-center gap-1 transition">
                    <XCircleIcon className="w-5 h-5" /> Reject
                  </button>
                </div>
              </div>
            ))}

            {activeTab === "payments" && payments.length === 0 && <p className="text-gray-500">No pending purchases.</p>}
            {activeTab === "payments" && payments.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-lg font-bold text-gray-900">{item.productName}</p>
                  <p className="text-sm font-medium text-emerald-600">{formatCurrency(item.amount)}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.submittedAt?.toDate?.()?.toLocaleString()}</p>
                  {(() => {
                    const user = users.find(u => u.id === item.userId);
                    return user ? (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-xs text-gray-500 font-semibold mb-1">User Details</p>
                        <p className="text-sm text-gray-900 font-medium">{user.fullName}</p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-600">{user.phone}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mt-2">User ID: {item.userId}</p>
                    );
                  })()}
                </div>
                {item.screenshotUrl && (
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-2">Proof of Payment</p>
                    <a href={item.screenshotUrl} target="_blank" rel="noopener noreferrer" className="block relative group w-32 h-32">
                      <img src={item.screenshotUrl} alt="Payment Screenshot" className="w-full h-full object-cover rounded-xl border-2 border-gray-100 group-hover:border-emerald-500 transition-colors shadow-sm" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">View Full</span>
                      </div>
                    </a>
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={() => handleApprovePayment(item.id, item.userId, item.productId, item.productName, item.amount)} className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg font-semibold flex items-center gap-1 transition">
                    <CheckCircleIcon className="w-5 h-5" /> Approve
                  </button>
                  <button onClick={() => handleRejectPayment(item.id, item.userId, item.productName)} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-semibold flex items-center gap-1 transition">
                    <XCircleIcon className="w-5 h-5" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && activeTab === "users" && (
          <div className="space-y-4">
            {users.length === 0 && <p className="text-gray-500">No users found.</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => (
                <div key={user.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-lg">
                      {user.fullName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{user.fullName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mt-2 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-gray-500 text-xs">Phone</p>
                      <p className="font-medium text-gray-900">{user.phone || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Balance</p>
                      <p className="font-medium text-emerald-600">{formatCurrency(user.balance || 0)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Referrals</p>
                      <p className="font-medium text-gray-900">{user.referralCount || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Joined</p>
                      <p className="font-medium text-gray-900">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
