import { NextResponse } from "next/server";
import { adminDb, FieldValue } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { userId, provider_id, phone_number, amount } = await req.json();

    if (!userId || !provider_id || !phone_number || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (amount < 50) {
      return NextResponse.json({ error: "Minimum amount is NGN 50" }, { status: 400 });
    }

    // 1. Check user balance using Admin SDK
    const userRef = adminDb.collection("users").doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userSnap.data();
    if (!userData || userData.balance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // 2. Deduct balance from user (Pending State)
    await userRef.update({
      balance: FieldValue.increment(-amount),
    });

    // 3. Make request to CheapDataHub
    const apiKey = process.env.CHEAPDATAHUB_API_KEY;
    if (!apiKey) {
      // Revert balance on missing key
      await userRef.update({ balance: FieldValue.increment(amount) });
      throw new Error("CheapDataHub API Key is missing");
    }

    const response = await fetch("https://www.cheapdatahub.ng/api/v1/resellers/airtime/purchase/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider_id,
        phone_number,
        amount,
      }),
    });

    const data = await response.json();
    console.log("[DEBUG] CheapDataHub Airtime API Response:", data);

    // 4. Handle response
    if (data.status === "true" || data.status === true) {
      // Success, log transaction
      await adminDb.collection("transactions").add({
        userId,
        type: "airtime",
        amount,
        phone_number,
        provider_id,
        reference: data.reference || data.transaction_id || "N/A",
        status: "success",
        createdAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ message: data.message || "Airtime purchase successful" }, { status: 200 });
    } else {
      // Failed, refund the user
      await userRef.update({
        balance: FieldValue.increment(amount),
      });

      return NextResponse.json({ error: data.message || data.detail || "Airtime purchase failed" }, { status: 400 });
    }

  } catch (error: any) {
    console.error("Airtime Purchase Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
