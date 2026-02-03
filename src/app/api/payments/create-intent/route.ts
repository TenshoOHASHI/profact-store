import { NextRequest, NextResponse } from "next/server";
import { StripePaymentService } from "@/infrastructure/services/StripePaymentService";
import { createPaymentIntentSchema } from "@/infrastructure/zod/shemas";
import z from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    const validationData = createPaymentIntentSchema.parse(body);

    const paymentService = new StripePaymentService();

    const result = await paymentService.createPaymentIntent(validationData);
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const treeified = z.treeifyError(error);

      return NextResponse.json(
        {
          error: "Validation Error",
          errors: treeified,
        },
        { status: 400 },
      );
    }
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to create payment intent";

    return NextResponse.json(
      {
        error: errorMessage,
        ...(process.env.NODE_ENV === "development" && { details: error }),
      },
      { status: 500 },
    );
  }
}
