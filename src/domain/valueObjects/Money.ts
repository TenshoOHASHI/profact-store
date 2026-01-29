import { ValidationError } from "./DomainError";

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

  multiply(multiply: Money): Money {
    return new Money(this._value * multiply._value);
  }

  equals(other: Money): boolean {
    return this._value === other._value;
  }

  format(): string {
    return `￥${this._value.toLocaleString("ja-JP")}`;
  }
}
