"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  increment,
  addDoc,
  serverTimestamp,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  CheckCircleIcon,
  XCircleIcon,
  WalletIcon,
  ShoppingBagIcon,
  ArrowUpIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const PAGE_SIZE = 10;

const paginate = <T,>(items: T[], page: number) => {
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  return {
    items: items.slice(startIndex, startIndex + PAGE_SIZE),
    currentPage,
    totalPages,
    totalItems: items.length,
    rangeStart: items.length ? startIndex + 1 : 0,
    rangeEnd: Math.min(startIndex + PAGE_SIZE, items.length),
  };
};

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  rangeStart,
  rangeEnd,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  rangeStart: number;
  rangeEnd: number;
  onPageChange: (page: number) => void;
}) => {
  if (totalItems <= PAGE_SIZE) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100">
      <p className="text-sm text-gray-500">
        Showing {rangeStart}–{rangeEnd} of {totalItems}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          Previous
        </button>
        <span className="text-sm text-gray-600 px-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          Next
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

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

const getTimestamp = (item: Record<string, unknown>, field = "createdAt") => {
  const ts = item[field];
  if (!ts) return 0;
  if (typeof (ts as { toDate?: () => Date }).toDate === "function") {
    return (ts as { toDate: () => Date }).toDate().getTime();
  }
  if (ts instanceof Date) return ts.getTime();
  return new Date(ts as string | number).getTime();
};

const sortByDateDesc = (items: Record<string, unknown>[], field = "createdAt") =>
  [...items].sort((a, b) => getTimestamp(b, field) - getTimestamp(a, field));

const formatDate = (item: Record<string, unknown>, field = "createdAt") => {
  const ts = getTimestamp(item, field);
  return ts ? new Date(ts).toLocaleString() : "N/A";
};

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    approved: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-700",
    pending: "bg-yellow-50 text-yellow-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${colors[status] || "bg-gray-50 text-gray-700"}`}>
      {status}
    </span>
  );
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("recharges");
  const [recharges, setRecharges] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [rechargeHistory, setRechargeHistory] = useState<any[]>([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState<any[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [pages, setPages] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const router = useRouter();

  const getPage = (key: string) => pages[key] || 1;
  const setPage = (key: string, page: number) =>
    setPages((prev) => ({ ...prev, [key]: page }));

  const rechargesPendingPage = paginate(recharges, getPage("rechargesPending"));
  const rechargesHistoryPage = paginate(rechargeHistory, getPage("rechargesHistory"));
  const withdrawalsPendingPage = paginate(withdrawals, getPage("withdrawalsPending"));
  const withdrawalsHistoryPage = paginate(withdrawalHistory, getPage("withdrawalsHistory"));
  const paymentsPendingPage = paginate(payments, getPage("paymentsPending"));
  const paymentsHistoryPage = paginate(paymentHistory, getPage("paymentsHistory"));
  const purchasesPage = paginate(purchases, getPage("purchases"));
  const usersPage = paginate(users, getPage("users"));
  const filteredUsers = users.filter(user => 
    user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone?.includes(searchQuery)
  );
  const messagesPage = paginate(filteredUsers, getPage("messages"));

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
      const snapAllRecharges = await getDocs(collection(db, "recharges"));
      const allRecharges = snapAllRecharges.docs.map(d => ({ id: d.id, ...d.data() }));
      setRecharges(allRecharges.filter((r: any) => r.status === "pending"));
      setRechargeHistory(sortByDateDesc(allRecharges.filter((r: any) => r.status !== "pending")));

      const snapAllWithdrawals = await getDocs(collection(db, "withdrawals"));
      const allWithdrawals = snapAllWithdrawals.docs.map(d => ({ id: d.id, ...d.data() }));
      setWithdrawals(allWithdrawals.filter((w: any) => w.status === "pending"));
      setWithdrawalHistory(sortByDateDesc(allWithdrawals.filter((w: any) => w.status !== "pending")));

      const snapAllPayments = await getDocs(collection(db, "payments"));
      const allPayments = snapAllPayments.docs.map(d => ({ id: d.id, ...d.data() }));
      setPayments(allPayments.filter((p: any) => p.status === "pending"));
      setPaymentHistory(sortByDateDesc(allPayments.filter((p: any) => p.status !== "pending"), "submittedAt"));

      const snapPurchases = await getDocs(collection(db, "purchases"));
      setPurchases(sortByDateDesc(snapPurchases.docs.map(d => ({ id: d.id, ...d.data() })), "purchasedAt"));

      const snapUsers = await getDocs(collection(db, "users"));
      setUsers(snapUsers.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  const renderUserDetails = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      return (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-xs text-gray-500 font-semibold mb-1">User Details</p>
          <p className="text-sm text-gray-900 font-medium">{user.fullName}</p>
          <p className="text-xs text-gray-600">{user.email}</p>
          <p className="text-xs text-gray-600">{user.phone}</p>
        </div>
      );
    }
    return <p className="text-sm text-gray-500 mt-2">User ID: {userId}</p>;
  };

  const isActionLoading = (action: string, id: string) => actionLoading === `${action}-${id}`;

  const handleApproveRecharge = async (id: string, userId: string, amount: number) => {
    setActionLoading(`approve-recharge-${id}`);
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

      toast.success("Recharge approved!");
      fetchData();
    } catch (error) {
      console.error("Error approving recharge:", error);
      toast.error("Failed to approve recharge.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectRecharge = async (id: string, userId: string, amount: number) => {
    setActionLoading(`reject-recharge-${id}`);
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

      toast("Recharge rejected!");
      fetchData();
    } catch (error) {
      console.error("Error rejecting recharge:", error);
      toast.error("Failed to reject recharge.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveWithdrawal = async (id: string, userId: string, amount: number, balanceType?: string) => {
    setActionLoading(`approve-withdrawal-${id}`);
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

      toast.success("Withdrawal approved!");
      fetchData();
    } catch (error) {
      console.error("Error approving withdrawal:", error);
      toast.error("Failed to approve withdrawal.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectWithdrawal = async (id: string, userId: string, amount: number, balanceType?: string) => {
    setActionLoading(`reject-withdrawal-${id}`);
    try {
      const docRef = doc(db, "withdrawals", id);
      await updateDoc(docRef, { status: "rejected" });

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

      toast("Withdrawal rejected!");
      fetchData();
    } catch (error) {
      console.error("Error rejecting withdrawal:", error);
      toast.error("Failed to reject withdrawal.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleApprovePayment = async (id: string, userId: string, productId: string, productName: string, amount: number) => {
    setActionLoading(`approve-payment-${id}`);
    try {
      const product = PRODUCTS.find((p) => p.id === productId);
      if (!product) {
        toast.error("Product not found!");
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

      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.referredBy) {
          const referrerRef = doc(db, "users", userData.referredBy);
          const referrerDoc = await getDoc(referrerRef);
          if (referrerDoc.exists()) {
            const referralBonus = product.price * 0.10;
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

      toast.success("Payment approved!");
      fetchData();
    } catch (error) {
      console.error("Error approving payment:", error);
      toast.error("Failed to approve payment.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectPayment = async (id: string, userId: string, productName: string) => {
    setActionLoading(`reject-payment-${id}`);
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

      toast("Payment rejected!");
      fetchData();
    } catch (error) {
      console.error("Error rejecting payment:", error);
      toast.error("Failed to reject payment.");
    } finally {
      setActionLoading(null);
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

  const handleSendMessage = async () => {
    if (!selectedUser || !messageText.trim()) {
      toast.error("Please select a user and enter a message");
      return;
    }
    setSendingMessage(true);
    try {
      await addDoc(collection(db, "notifications"), {
        userId: selectedUser.id,
        title: "New Message from Admin",
        message: messageText,
        type: "message",
        createdAt: serverTimestamp(),
      });
      toast.success("Message sent successfully!");
      setMessageText("");
      setSelectedUser(null);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleCancelPlan = async (purchaseId: string, userId: string, planName: string) => {
    if (!confirm(`Are you sure you want to cancel ${planName} for this user? This action cannot be undone.`)) {
      return;
    }
    setActionLoading(purchaseId);
    try {
      // Delete the purchase document
      await deleteDoc(doc(db, "purchases", purchaseId));
      
      // Send notification to user
      await addDoc(collection(db, "notifications"), {
        userId: userId,
        title: "Plan Cancelled",
        message: `Your plan "${planName}" has been cancelled by the admin.`,
        type: "error",
        createdAt: serverTimestamp(),
      });
      
      toast.success("Plan cancelled successfully!");
      
      // Refresh purchases list
      const q = query(collection(db, "purchases"), where("status", "==", "approved"));
      const snapshot = await getDocs(q);
      const purchaseData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPurchases(purchaseData);
    } catch (error) {
      console.error("Error cancelling plan:", error);
      toast.error("Failed to cancel plan");
    } finally {
      setActionLoading(null);
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
            onClick={() => setActiveTab("purchaseHistory")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === "purchaseHistory" ? "bg-slate-800 text-emerald-400" : "hover:bg-slate-800/50"}`}
          >
            <ShoppingBagIcon className="w-5 h-5" />
            Completed ({purchases.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === "users" ? "bg-slate-800 text-emerald-400" : "hover:bg-slate-800/50"}`}
          >
            <UsersIcon className="w-5 h-5" />
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === "messages" ? "bg-slate-800 text-emerald-400" : "hover:bg-slate-800/50"}`}
          >
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
            Messages
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
          <h2 className="text-3xl font-bold text-gray-900 capitalize">
            {activeTab === "users"
              ? "Users"
              : activeTab === "messages"
                ? "Send Messages"
                : activeTab === "payments"
                  ? "Pending Purchases"
                  : activeTab === "purchaseHistory"
                    ? "Completed Purchases"
                    : `Pending ${activeTab}`}
          </h2>
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 text-sm font-medium text-gray-700 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === "recharges" && recharges.length === 0 && <p className="text-gray-500">No pending recharges.</p>}
            {activeTab === "recharges" && rechargesPendingPage.items.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(item.amount)}</p>
                    <StatusBadge status="pending" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(item)}</p>
                  {renderUserDetails(item.userId)}
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
                  <button
                    onClick={() => handleApproveRecharge(item.id, item.userId, item.amount)}
                    disabled={actionLoading !== null}
                    className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg font-semibold flex items-center gap-1 transition disabled:opacity-50"
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                    {isActionLoading("approve-recharge", item.id) ? "Processing..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handleRejectRecharge(item.id, item.userId, item.amount)}
                    disabled={actionLoading !== null}
                    className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-semibold flex items-center gap-1 transition disabled:opacity-50"
                  >
                    <XCircleIcon className="w-5 h-5" />
                    {isActionLoading("reject-recharge", item.id) ? "Processing..." : "Reject"}
                  </button>
                </div>
              </div>
            ))}

            {activeTab === "recharges" && recharges.length > 0 && (
              <Pagination
                currentPage={rechargesPendingPage.currentPage}
                totalPages={rechargesPendingPage.totalPages}
                totalItems={rechargesPendingPage.totalItems}
                rangeStart={rechargesPendingPage.rangeStart}
                rangeEnd={rechargesPendingPage.rangeEnd}
                onPageChange={(p) => setPage("rechargesPending", p)}
              />
            )}

            {activeTab === "recharges" && rechargeHistory.length > 0 && (
              <div className="mt-10 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recharge History ({rechargeHistory.length})</h3>
                <div className="space-y-3">
                  {rechargesHistoryPage.items.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900">{formatCurrency(item.amount)}</p>
                          <StatusBadge status={item.status} />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(item)}</p>
                        {renderUserDetails(item.userId)}
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination
                  currentPage={rechargesHistoryPage.currentPage}
                  totalPages={rechargesHistoryPage.totalPages}
                  totalItems={rechargesHistoryPage.totalItems}
                  rangeStart={rechargesHistoryPage.rangeStart}
                  rangeEnd={rechargesHistoryPage.rangeEnd}
                  onPageChange={(p) => setPage("rechargesHistory", p)}
                />
              </div>
            )}

            {activeTab === "withdrawals" && withdrawals.length === 0 && <p className="text-gray-500">No pending withdrawals.</p>}
            {activeTab === "withdrawals" && withdrawalsPendingPage.items.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(item.amount)}</p>
                    <StatusBadge status="pending" />
                    {item.balanceType && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 capitalize">
                        {item.balanceType} balance
                      </span>
                    )}
                  </div>
                  {item.fee != null && (
                    <p className="text-xs text-gray-500 mt-1">
                      Fee: {formatCurrency(item.fee)} · Receives: {formatCurrency(item.finalAmount ?? item.amount - item.fee)}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">{formatDate(item)}</p>
                  {renderUserDetails(item.userId)}
                </div>
                <div className="flex-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Bank Details</p>
                  <p className="text-sm font-medium text-gray-900">{item.bankDetails?.bankName}</p>
                  <p className="text-sm font-medium text-gray-900">{item.bankDetails?.accountNumber}</p>
                  <p className="text-sm font-medium text-gray-900">{item.bankDetails?.accountName}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproveWithdrawal(item.id, item.userId, item.amount, item.balanceType)}
                    disabled={actionLoading !== null}
                    className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg font-semibold flex items-center gap-1 transition disabled:opacity-50"
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                    {isActionLoading("approve-withdrawal", item.id) ? "Processing..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handleRejectWithdrawal(item.id, item.userId, item.amount, item.balanceType)}
                    disabled={actionLoading !== null}
                    className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-semibold flex items-center gap-1 transition disabled:opacity-50"
                  >
                    <XCircleIcon className="w-5 h-5" />
                    {isActionLoading("reject-withdrawal", item.id) ? "Processing..." : "Reject"}
                  </button>
                </div>
              </div>
            ))}

            {activeTab === "withdrawals" && withdrawals.length > 0 && (
              <Pagination
                currentPage={withdrawalsPendingPage.currentPage}
                totalPages={withdrawalsPendingPage.totalPages}
                totalItems={withdrawalsPendingPage.totalItems}
                rangeStart={withdrawalsPendingPage.rangeStart}
                rangeEnd={withdrawalsPendingPage.rangeEnd}
                onPageChange={(p) => setPage("withdrawalsPending", p)}
              />
            )}

            {activeTab === "withdrawals" && withdrawalHistory.length > 0 && (
              <div className="mt-10 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Withdrawal History ({withdrawalHistory.length})</h3>
                <div className="space-y-3">
                  {withdrawalsHistoryPage.items.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-gray-900">{formatCurrency(item.amount)}</p>
                          <StatusBadge status={item.status} />
                          {item.balanceType && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 capitalize">
                              {item.balanceType}
                            </span>
                          )}
                        </div>
                        {item.fee != null && (
                          <p className="text-xs text-gray-500 mt-1">
                            Fee: {formatCurrency(item.fee)} · Received: {formatCurrency(item.finalAmount ?? item.amount - item.fee)}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">{formatDate(item)}</p>
                        {renderUserDetails(item.userId)}
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                        <p className="text-xs text-gray-500 mb-1">Bank</p>
                        <p className="font-medium text-gray-900">{item.bankDetails?.bankName}</p>
                        <p className="text-gray-700">{item.bankDetails?.accountNumber}</p>
                        <p className="text-gray-700">{item.bankDetails?.accountName}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination
                  currentPage={withdrawalsHistoryPage.currentPage}
                  totalPages={withdrawalsHistoryPage.totalPages}
                  totalItems={withdrawalsHistoryPage.totalItems}
                  rangeStart={withdrawalsHistoryPage.rangeStart}
                  rangeEnd={withdrawalsHistoryPage.rangeEnd}
                  onPageChange={(p) => setPage("withdrawalsHistory", p)}
                />
              </div>
            )}

            {activeTab === "payments" && payments.length === 0 && <p className="text-gray-500">No pending purchases.</p>}
            {activeTab === "payments" && paymentsPendingPage.items.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-gray-900">{item.productName}</p>
                    <StatusBadge status="pending" />
                  </div>
                  <p className="text-sm font-medium text-emerald-600">{formatCurrency(item.amount)}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(item, "submittedAt")}</p>
                  {renderUserDetails(item.userId)}
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
                  <button
                    onClick={() => handleApprovePayment(item.id, item.userId, item.productId, item.productName, item.amount)}
                    disabled={actionLoading !== null}
                    className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg font-semibold flex items-center gap-1 transition disabled:opacity-50"
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                    {isActionLoading("approve-payment", item.id) ? "Processing..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handleRejectPayment(item.id, item.userId, item.productName)}
                    disabled={actionLoading !== null}
                    className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-semibold flex items-center gap-1 transition disabled:opacity-50"
                  >
                    <XCircleIcon className="w-5 h-5" />
                    {isActionLoading("reject-payment", item.id) ? "Processing..." : "Reject"}
                  </button>
                </div>
              </div>
            ))}

            {activeTab === "payments" && payments.length > 0 && (
              <Pagination
                currentPage={paymentsPendingPage.currentPage}
                totalPages={paymentsPendingPage.totalPages}
                totalItems={paymentsPendingPage.totalItems}
                rangeStart={paymentsPendingPage.rangeStart}
                rangeEnd={paymentsPendingPage.rangeEnd}
                onPageChange={(p) => setPage("paymentsPending", p)}
              />
            )}

            {activeTab === "payments" && paymentHistory.length > 0 && (
              <div className="mt-10 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Request History ({paymentHistory.length})</h3>
                <div className="space-y-3">
                  {paymentsHistoryPage.items.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900">{item.productName}</p>
                          <StatusBadge status={item.status} />
                        </div>
                        <p className="text-sm text-emerald-600">{formatCurrency(item.amount)}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(item, "submittedAt")}</p>
                        {renderUserDetails(item.userId)}
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination
                  currentPage={paymentsHistoryPage.currentPage}
                  totalPages={paymentsHistoryPage.totalPages}
                  totalItems={paymentsHistoryPage.totalItems}
                  rangeStart={paymentsHistoryPage.rangeStart}
                  rangeEnd={paymentsHistoryPage.rangeEnd}
                  onPageChange={(p) => setPage("paymentsHistory", p)}
                />
              </div>
            )}

            {activeTab === "purchaseHistory" && purchases.length === 0 && (
              <p className="text-gray-500">No completed purchases yet.</p>
            )}
            {activeTab === "purchaseHistory" && purchasesPage.items.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-gray-900">{item.name}</p>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                      Active
                    </span>
                  </div>
                  <p className="text-sm font-medium text-emerald-600">{formatCurrency(item.price)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.ads} ads/day · Daily: {formatCurrency(item.dailyIncome)} · Total: {formatCurrency(item.totalIncome)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(item, "purchasedAt")}</p>
                  {renderUserDetails(item.userId)}
                </div>
                <button
                  onClick={() => handleCancelPlan(item.id, item.userId, item.name)}
                  disabled={actionLoading === item.id}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {actionLoading === item.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="w-5 h-5" />
                      Cancel Plan
                    </>
                  )}
                </button>
              </div>
            ))}

            {activeTab === "purchaseHistory" && purchases.length > 0 && (
              <Pagination
                currentPage={purchasesPage.currentPage}
                totalPages={purchasesPage.totalPages}
                totalItems={purchasesPage.totalItems}
                rangeStart={purchasesPage.rangeStart}
                rangeEnd={purchasesPage.rangeEnd}
                onPageChange={(p) => setPage("purchases", p)}
              />
            )}

            {activeTab === "messages" && (
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users by name, email, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {filteredUsers.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No users found matching your search.</p>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {messagesPage.items.map((user) => (
                          <div
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className={`p-4 rounded-xl border cursor-pointer transition ${
                              "bg-gray-50 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                                {user.fullName?.charAt(0) || "U"}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{user.fullName}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                              <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {filteredUsers.length > PAGE_SIZE && (
                        <Pagination
                          currentPage={messagesPage.currentPage}
                          totalPages={messagesPage.totalPages}
                          totalItems={messagesPage.totalItems}
                          rangeStart={messagesPage.rangeStart}
                          rangeEnd={messagesPage.rangeEnd}
                          onPageChange={(p) => setPage("messages", p)}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Message Modal */}
            {selectedUser && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl transform transition-all scale-100 animate-in slide-in-from-bottom-4 duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Send Message</h3>
                    <button
                      onClick={() => {
                        setSelectedUser(null);
                        setMessageText("");
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                      <XMarkIcon className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                          {selectedUser.fullName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{selectedUser.fullName}</p>
                          <p className="text-sm text-gray-500">{selectedUser.email}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Phone:</span> {selectedUser.phone || "N/A"}
                      </p>
                    </div>
                    
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type your message here..."
                      rows={4}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-gray-900"
                    />
                    
                    <div className="flex gap-3">
                      <button
                        onClick={handleSendMessage}
                        disabled={sendingMessage || !messageText.trim()}
                        className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {sendingMessage ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <ChatBubbleLeftRightIcon className="w-5 h-5" />
                            Send Message
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(null);
                          setMessageText("");
                        }}
                        className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && activeTab === "users" && (
          <div className="space-y-4">
            {users.length === 0 && <p className="text-gray-500">No users found.</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {usersPage.items.map((user) => (
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
            {users.length > 0 && (
              <Pagination
                currentPage={usersPage.currentPage}
                totalPages={usersPage.totalPages}
                totalItems={usersPage.totalItems}
                rangeStart={usersPage.rangeStart}
                rangeEnd={usersPage.rangeEnd}
                onPageChange={(p) => setPage("users", p)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
