export interface CreatePaymentIntentParams {
  amount: number;
  orderId: string;
  customerEmail: string;
  customerName: string;
}

export interface PaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export interface IPaymentService {
  createPaymentIntent(
    params: CreatePaymentIntentParams,
  ): Promise<PaymentIntentResult>;
}
