import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import {
  SERVER_DOWN_FIELD,
  SERVER_DOWN_MESSAGE,
  SERVER_STATUS_COLLECTION,
  SERVER_STATUS_DOC,
  type PlatformSettings,
} from "@/lib/server-status";

/** Returns true when Firestore settings/platform.serverDown is true. */
export async function isServerDown(): Promise<boolean> {
  try {
    const snap = await adminDb
      .collection(SERVER_STATUS_COLLECTION)
      .doc(SERVER_STATUS_DOC)
      .get();

    if (!snap.exists) return false;

    const data = snap.data() as PlatformSettings | undefined;
    return data?.[SERVER_DOWN_FIELD] === true;
  } catch (error) {
    // Fail open so a temporary Firestore read error does not brick APIs.
    console.error("Failed to read server status:", error);
    return false;
  }
}

/** If the platform is down, return a 503 JSON response; otherwise null. */
export async function serverDownResponse(): Promise<NextResponse | null> {
  if (!(await isServerDown())) return null;
  return NextResponse.json(
    { error: SERVER_DOWN_MESSAGE },
    { status: 503 }
  );
}
