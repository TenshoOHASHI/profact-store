export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

// node: [pending, paid, failed, refuned]
// edge: [pending] ->　[paid, failed]
export class OrderStatusValidator {
  static canTransition(from: OrderStatus, to: OrderStatus): boolean {
    const transitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.FAILED],
      [OrderStatus.PAID]: [OrderStatus.REFUNDED],
      [OrderStatus.FAILED]: [],
      [OrderStatus.REFUNDED]: [],
    };
    return transitions[from]?.includes(to) ?? false;
  }
}
