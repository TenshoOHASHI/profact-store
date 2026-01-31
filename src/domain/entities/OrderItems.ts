import { Money } from "../valueObjects/Money";
import { Quantity } from "../valueObjects/Quantity";

export interface OrderItemProps {
  id: string;
  productId: string;
  productName: string;
  unitPrice: Money;
  quantity: Quantity;
  taxRate: number;
}

export class OrderItem {
  private readonly _id: string;
  private readonly _productId: string;
  private readonly _productName: string;
  private readonly _unitPrice: Money;
  private readonly _quantity: Quantity;
  private readonly _taxRate: number;

  constructor(props: OrderItemProps) {
    this._id = props.id;
    this._productId = props.productId;
    this._productName = props.productName;
    this._unitPrice = props.unitPrice;
    this._quantity = props.quantity;
    this._taxRate = props.taxRate;
  }

  // price x quantity
  get subtotal(): Money {
    return this._unitPrice.multiply(this._quantity);
  }

  // subtotal x tax
  get amountWithTax(): Money {
    return this.subtotal.withTax(this._taxRate);
  }

  get id(): string {
    return this._id;
  }

  get productId(): string {
    return this._productId;
  }

  get productName(): string {
    return this._productName;
  }
  get unitPrice(): Money {
    return this._unitPrice;
  }

  get quantity(): Quantity {
    return this._quantity;
  }

  get taxRate(): number {
    return this._taxRate;
  }
}
