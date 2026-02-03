import { NextRequest, NextResponse } from "next/server";
import { StripePaymentService } from "@/infrastructure/services/StripePaymentService";
import { createPaymentIntentSchema } from "@/infrastructure/zod/shemas";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const result = createPaymentIntentSchema.safeParse(body);
  if (!result.success) {
    const messages = result.error.issues.map((i) => i.message).join(", ");
    return NextResponse.json(
      { error: "Validation Error", message: messages },
      { status: 400 },
    );
  }

  try {
    const paymentService = new StripePaymentService();
    const response = await paymentService.createPaymentIntent(result.data);

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to create payment intent";

    return NextResponse.json({ error: errorMessage, status: 500 });
  }
}
