import { stripe } from "../stripe/stripeClient";
import {
  IPaymentService,
  CreatePaymentIntentParams,
  PaymentIntentResult,
} from "@/application/services/IPaymentService";

export class StripePaymentService implements IPaymentService {
  async createPaymentIntent(
    params: CreatePaymentIntentParams,
  ): Promise<PaymentIntentResult> {
    const amountInYen = params.amount;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInYen,
      currency: "jpy",
      metadata: {
        orderId: params.orderId,
        customerEmail: params.customerEmail,
        customerName: params.customerName,
      },
      confirm: false,
      payment_method_types: ["card"],
    });

    if (!paymentIntent.client_secret) {
      throw new Error("Failed to get client_secret from Stripe");
    }

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    };
  }

  constructWebhookEvent(payload: string, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not set");
    }

    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }
}
