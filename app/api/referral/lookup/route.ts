import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

/** Public lookup so registration can resolve invitation codes before auth. */
export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    const normalized = typeof code === "string" ? code.trim().toUpperCase() : "";

    if (!normalized) {
      return NextResponse.json({ error: "Invitation code is required" }, { status: 400 });
    }

    const snapshot = await adminDb
      .collection("users")
      .where("myInvitationCode", "==", normalized)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ found: false }, { status: 200 });
    }

    const referrer = snapshot.docs[0];
    return NextResponse.json({
      found: true,
      referrerId: referrer.id,
      referrerName: referrer.data()?.fullName || null,
    });
  } catch (error) {
    console.error("Referral lookup error:", error);
    return NextResponse.json({ error: "Failed to look up invitation code" }, { status: 500 });
  }
}
