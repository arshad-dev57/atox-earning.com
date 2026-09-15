import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  isPurchaseActive,
  isPurchaseNewlyExpired,
  type PurchaseLike,
} from "@/lib/purchases";

async function forfeitTaskBalance(userId: string, notify = true): Promise<boolean> {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return false;

  const current = Number(userSnap.data().balance || 0);
  if (current === 0) return false;

  await updateDoc(userRef, {
    balance: 0,
    expiredBalanceClearedAt: serverTimestamp(),
  });

  if (notify) {
    await addDoc(collection(db, "notifications"), {
      userId,
      title: "Plan Expired",
      message: "Your plan has expired. Your task balance has been reset to ₦0.",
      type: "error",
      createdAt: serverTimestamp(),
    });
  }

  return true;
}

/**
 * Marks time-expired purchases, and if the user has no remaining active plan,
 * resets task balance to 0. Does not run again on later free-mode earnings.
 */
export async function settleExpiredPlansForUser(userId: string): Promise<{
  hasActivePlan: boolean;
  balanceCleared: boolean;
}> {
  const snap = await getDocs(
    query(collection(db, "purchases"), where("userId", "==", userId))
  );
  const purchases = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as PurchaseLike),
  }));

  const newlyExpired = purchases.filter(isPurchaseNewlyExpired);
  const hasActivePlan = purchases.some((p) => isPurchaseActive(p));

  if (newlyExpired.length > 0) {
    const batch = writeBatch(db);
    for (const purchase of newlyExpired) {
      batch.update(doc(db, "purchases", purchase.id), {
        status: "expired",
        expiredAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    await batch.commit();
  }

  const balanceCleared =
    !hasActivePlan && newlyExpired.length > 0
      ? await forfeitTaskBalance(userId)
      : false;

  return { hasActivePlan, balanceCleared };
}

/** After admin expire/cancel: wipe task balance if no active plan remains. */
export async function forfeitTaskBalanceIfNoActivePlan(userId: string): Promise<{
  hasActivePlan: boolean;
  balanceCleared: boolean;
}> {
  const snap = await getDocs(
    query(collection(db, "purchases"), where("userId", "==", userId))
  );
  const hasActivePlan = snap.docs.some((d) => isPurchaseActive(d.data() as PurchaseLike));
  if (hasActivePlan) return { hasActivePlan: true, balanceCleared: false };

  const balanceCleared = await forfeitTaskBalance(userId, false);
  return { hasActivePlan: false, balanceCleared };
}
