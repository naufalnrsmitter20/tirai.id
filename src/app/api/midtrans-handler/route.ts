// file: app/api/midtrans-webhook/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { MidtransWebhookBody } from "@/types/midtrans";

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";

export async function POST(req: Request) {
  try {
    const body: MidtransWebhookBody = await req.json();

    const expectedSignature = crypto
      .createHash("sha512")
      .update(
        `${body.order_id}${body.status_code}${body.gross_amount}${MIDTRANS_SERVER_KEY}`,
      )
      .digest("hex");

    if (body.signature_key !== expectedSignature) {
      return NextResponse.json(
        { message: "Invalid signature key" },
        { status: 403 },
      );
    }

    switch (body.transaction_status) {
      case "capture":
      case "settlement":
        if (body.fraud_status === "accept") {
          // TODO: Update order to 'success'
        }
        break;
      case "pending":
        // TODO: Update order to 'waiting payment'
        break;
      case "deny":
      case "expire":
      case "cancel":
        // TODO: Update order to 'failure or cancel'
        break;
      default:
        // Handle unexpected status
        return NextResponse.json(
          { message: "Unhandled transaction status" },
          { status: 400 },
        );
    }

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
