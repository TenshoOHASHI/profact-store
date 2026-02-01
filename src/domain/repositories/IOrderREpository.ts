import { Order } from "../entities/Order";

export interface IOrderRepository {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
  findByGuestSessionId(id: string): Promise<Order[]>;
  findByPaymentIntentId(paymentIntentId: string): Promise<Order | null>;
}
