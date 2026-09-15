import { adminDb, FieldValue } from "@/lib/firebase-admin";
import {
  isPurchaseActive,
  isPurchaseNewlyExpired,
  type PurchaseLike,
} from "@/lib/purchases";

/** Server-side: expire lapsed plans and zero task balance if none remain active. */
export async function settleExpiredPlansForUserAdmin(userId: string): Promise<void> {
  const snap = await adminDb.collection("purchases").where("userId", "==", userId).get();
  const purchases = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as PurchaseLike),
  }));

  const newlyExpired = purchases.filter(isPurchaseNewlyExpired);
  const hasActivePlan = purchases.some((p) => isPurchaseActive(p));

  if (newlyExpired.length === 0) return;

  const batch = adminDb.batch();
  for (const purchase of newlyExpired) {
    batch.update(adminDb.collection("purchases").doc(purchase.id), {
      status: "expired",
      expiredAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  if (!hasActivePlan) {
    const userRef = adminDb.collection("users").doc(userId);
    const userSnap = await userRef.get();
    if (userSnap.exists && Number(userSnap.data()?.balance || 0) !== 0) {
      batch.update(userRef, {
        balance: 0,
        expiredBalanceClearedAt: FieldValue.serverTimestamp(),
      });
    }
  }

  await batch.commit();
}
