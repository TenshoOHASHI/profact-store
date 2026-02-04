import { NextRequest, NextResponse } from "next/server";
import { StripePaymentService } from "@/infrastructure/stripe/StripePaymentService";
import { CreatePaymentIntentUseCase } from "@/application/useCases/payment/createPaymentIntent";
import { createPaymentIntentSchema } from "@/infrastructure/zod/createPaymentSchema";

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
    const createPaymentIntentUseCase = new CreatePaymentIntentUseCase(
      paymentService,
    );
    const response = await createPaymentIntentUseCase.execute(result.data);

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
