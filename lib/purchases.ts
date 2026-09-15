export type PurchaseLike = {
  status?: string;
  expiresAt?: { toDate?: () => Date } | Date | string | number | null;
};

function getExpiryTime(expiresAt: PurchaseLike["expiresAt"]): number | null {
  if (!expiresAt) return null;
  if (typeof (expiresAt as { toDate?: () => Date }).toDate === "function") {
    return (expiresAt as { toDate: () => Date }).toDate().getTime();
  }
  if (expiresAt instanceof Date) return expiresAt.getTime();
  const parsed = new Date(expiresAt as string | number).getTime();
  return Number.isNaN(parsed) ? null : parsed;
}

/** Active = not cancelled/expired, and not past expiresAt when set. */
export function isPurchaseActive(purchase: PurchaseLike | null | undefined): boolean {
  if (!purchase) return false;
  if (purchase.status === "cancelled" || purchase.status === "expired") return false;

  const expiry = getExpiryTime(purchase.expiresAt);
  if (expiry !== null && expiry < Date.now()) return false;

  return true;
}

/** Plan still stored as active, but expiresAt has already passed. */
export function isPurchaseNewlyExpired(purchase: PurchaseLike | null | undefined): boolean {
  if (!purchase) return false;
  if (purchase.status === "cancelled" || purchase.status === "expired") return false;

  const expiry = getExpiryTime(purchase.expiresAt);
  return expiry !== null && expiry < Date.now();
}
