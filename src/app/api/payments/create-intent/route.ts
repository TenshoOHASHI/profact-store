import { NextRequest, NextResponse } from "next/server";
import { StripePaymentService } from "@/infrastructure/services/StripePaymentService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, orderId, customerEmail, customerName } = body;
    const paymentService = new StripePaymentService();
    const result = await paymentService.createPaymentIntent({
      amount,
      orderId,
      customerEmail,
      customerName,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log("Payment intent error:", error);
    NextResponse.json(
      {
        error: "Failed to create payment intent",
      },
      { status: 500 },
    );
  }
}
