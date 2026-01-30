import { ValidationError } from "./DomainError";
import { Quantity } from "./Quantity";

export class Money {
  // Encapusulation
  private readonly _value: number;

  constructor(value: number) {
    // Validation
    if (value < 0) {
      throw new ValidationError("金額は0以上で入力してください", "value");
    }

    this._value = Math.floor(value);
  }

  get value(): number {
    return this._value;
  }

  // Immutability
  add(other: Money): Money {
    // return new instance then keep always new value
    return new Money(this._value + other._value);
  }

  // money x quantity
  multiply(quantity: Quantity): Money {
    return new Money(this._value * quantity.value);
  }

  equals(other: Money): boolean {
    return this._value === other._value;
  }

  format(): string {
    return `￥${this._value.toLocaleString("ja-JP")}`;
  }
}
