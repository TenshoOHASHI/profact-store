// TODO: #16 注文機能の実装時に定義する
import { Money } from "../valueObjects/Money";
import { Email } from "../valueObjects/Email";
import {
  BusinessRuleError,
  ValidationError,
} from "../valueObjects/DomainError";
import { OrderItem } from "./OrderItems";
import { OrderStatus, OrderStatusValidator } from "../valueObjects/OrderStatus";

export interface OrderProps {
  id: string;
  customerEmail: Email;
  customerName: string;
  items: OrderItem[];
  status: OrderStatus;
  guestSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Order {
  private readonly _id: string;
  private readonly _customerEmail: Email;
  private readonly _customerName: string;
  private readonly _items: OrderItem[];
  private _status: OrderStatus;
  private readonly _guestSessionId?: string;
  private _stripePaymentIntentId?: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(props: OrderProps) {
    if (props.items.length === 0) {
      throw new ValidationError(
        "注文には少なくても１つの商品が必要です",
        "items",
      );
    }
    this._id = props.id;
    this._customerEmail = props.customerEmail;
    this._customerName = props.customerName;
    this._items = [...props.items];
    this._status = props.status;
    this._guestSessionId = props.guestSessionId;
    this._stripePaymentIntentId = props.stripePaymentIntentId;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get totalAmountIncludingTax(): Money {
    return this._items.reduce((total, item) => {
      return total.add(item.amountWithTax);
    }, new Money(0));
  }

  get totalAmountExcludingTax(): Money {
    return this._items.reduce((total, item) => {
      return total.add(item.subtotal);
    }, new Money(0));
  }

  markAsPaid(paymentIntentId: string): void {
    if (!OrderStatusValidator.canTransition(this._status, OrderStatus.PAID)) {
      throw new BusinessRuleError(
        "ステータスが不正です",
        "INVALID_STATUS_TRANSITION",
        "status",
      );
    }
    this._status = OrderStatus.PAID;
    this._stripePaymentIntentId = paymentIntentId;
  }

  markAsFailed(): void {
    if (!OrderStatusValidator.canTransition(this._status, OrderStatus.FAILED)) {
      throw new BusinessRuleError(
        "ステータスが不正です",
        "INVALID_STATUS_TRANSITION",
        "status",
      );
    }

    this._status = OrderStatus.FAILED;
  }
  markAsRefunded(): void {
    if (
      !OrderStatusValidator.canTransition(this._status, OrderStatus.REFUNDED)
    ) {
      throw new BusinessRuleError(
        "返金できないステータスです",
        "INVALID_STATUS_TRANSITION",
        "status",
      );
    }
    this._status = OrderStatus.REFUNDED;
  }
  get id(): string {
    return this._id;
  }
  get customerEmail(): Email {
    return this._customerEmail;
  }
  get customerName(): string {
    return this._customerName;
  }
  get items(): OrderItem[] {
    return [...this._items];
  }
  get status(): OrderStatus {
    return this._status;
  }
  get guestSessionId(): string | undefined {
    return this._guestSessionId;
  }
  get stripePaymentIntentId(): string | undefined {
    return this._stripePaymentIntentId;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
