import { NextResponse } from "next/server";
import { adminDb, FieldValue } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { userId, bundle_id, phone_number, amount, provider_id } = await req.json();

    if (!userId || !bundle_id || !phone_number || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

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

    // Only send bundle_id and phone_number as per CheapDataHub docs
    const payload: Record<string, any> = { bundle_id, phone_number };
    // Some plans may require provider_id — include it if provided
    if (provider_id) payload.provider_id = provider_id;

    console.log("[DEBUG] Sending Data purchase payload:", payload);
    const response = await fetch(
      "https://www.cheapdatahub.ng/api/v1/resellers/data/purchase/",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    console.log("[DEBUG] CheapDataHub Data endpoint HTTP status:", response.status);

    const rawResponse = await response.text();
    let data;
    try {
      data = JSON.parse(rawResponse);
      console.log("[DEBUG] CheapDataHub Data API Response:", data);
    } catch (e) {
      console.error("[DEBUG] Non-JSON Response from CheapDataHub:", rawResponse);
      await userRef.update({ balance: FieldValue.increment(amount) });
      return NextResponse.json(
        { error: "CheapDataHub returned a server error (500). The bundle_id may be invalid or the service is temporarily down." },
        { status: 502 }
      );
    }

    // 4. Handle response
    if (data.status === "true" || data.status === true) {
      // Success, log transaction
      await adminDb.collection("transactions").add({
        userId,
        type: "data",
        amount,
        phone_number,
        bundle_id,
        provider_id: provider_id || null,
        reference: data.reference || data.transaction_id || "N/A",
        status: "success",
        createdAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ message: data.message || "Data purchase successful" }, { status: 200 });
    } else {
      // Failed, refund the user
      await userRef.update({
        balance: FieldValue.increment(amount),
      });

      return NextResponse.json({ error: data.message || data.detail || "Data purchase failed" }, { status: 400 });
    }

  } catch (error: any) {
    console.error("Data Purchase Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
