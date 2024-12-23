import { NextResponse } from "next/server";
import crypto from "crypto";
import { MidtransWebhookBody } from "@/types/midtrans";
import prisma from "@/lib/prisma";

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

    const orderId = body.order_id.split("-").slice(0, 5).join("-");

    switch (body.transaction_status) {
      case "capture":
      case "settlement":
        if (body.fraud_status === "accept") {
          const payment = await prisma.payment.update({
            where: {
              order_id: orderId,
            },
            data: {
              status: "COMPLETED",
              method: body.payment_type,
            },
          });
          await prisma.order.update({
            where: {
              id: payment.order_id,
            },
            data: {
              status: "PENDING",
            },
          });
        }
        break;
      case "pending":
        await prisma.payment.update({
          where: {
            order_id: orderId,
          },
          data: {
            status: "PENDING",
            method: body.payment_type,
          },
        });
        break;
      case "deny":
      case "expire":
      case "cancel": {
        const payment = await prisma.payment.update({
          where: {
            order_id: orderId,
          },
          data: {
            status: "FAILED",
          },
        });
        await prisma.order.update({
          where: {
            id: payment.order_id,
          },
          data: {
            status: "CANCELED",
          },
        });
        break;
      }
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
