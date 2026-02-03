import { stripe } from "../stripe/stripeClient";
import { Money } from "@/domain/valueObjects/Money";
import {
  IPaymentService,
  CreatePaymentIntentParams,
  PaymentIntentResult,
} from "@/application/services/IPaymentService";

export class StripePaymentService implements IPaymentService {
  async createPaymentIntent(
    params: CreatePaymentIntentParams,
  ): Promise<PaymentIntentResult> {
    const money = new Money(params.amount);
    const amountInYen = money.value;
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

    return {
      clientSecret: paymentIntent.client_secret!,
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
