import type { IPaymentService } from "@/application/services/IPaymentService";

export class CreatePaymentIntentUseCase {
  constructor(private paymentService: IPaymentService) {}

  async execute(params: {
    amount: number;
    orderId: string;
    customerEmail: string;
    customerName: string;
  }) {
    return this.paymentService.createPaymentIntent(params);
  }
}
