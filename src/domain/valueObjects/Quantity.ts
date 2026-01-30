import { ValidationError } from "./DomainError";

export class Quantity {
  private readonly _value: number;
  private readonly MIN_VALUE = 1;
  private readonly MAX_VALUE = 999;

  constructor(value: number) {
    const numValue = typeof value === "string" ? parseInt(value, 10) : value;

    if (!Number.isInteger(numValue)) {
      throw new ValidationError("数量は整数で入力してください", "value");
    }

    if (numValue < this.MIN_VALUE) {
      throw new ValidationError(
        `数量は${this.MIN_VALUE}以上で入力してください`,
        "value",
      );
    }
    if (numValue > this.MAX_VALUE) {
      throw new ValidationError(
        `数量は${this.MAX_VALUE}以下で入力してください`,
        "value",
      );
    }
    this._value = numValue;
  }
  get value(): number {
    return this._value;
  }

  add(other: Quantity): Quantity {
    return new Quantity(this._value + other._value);
  }

  equals(other: Quantity): boolean {
    return this._value === other._value;
  }

  isZero(): boolean {
    return this._value === 0;
  }
}
