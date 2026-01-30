import { describe, it, expect } from "vitest";
import { Money } from "./Money";
import { Quantity } from "./Quantity";
import { ValidationError } from "./DomainError";

describe("Money", () => {
  it("金額を作成できる", () => {
    const money = new Money(1000);
    expect(money.value).toBe(1000);
  });

  it("負の金額はエラー", () => {
    expect(() => new Money(-100)).toThrow(ValidationError);
  });

  it("加算できる", () => {
    const money1 = new Money(1000);
    const money2 = new Money(500);
    const result = money1.add(money2);
    expect(result.value).toBe(1500);
  });

  it("数量を掛けられる", () => {
    const money = new Money(1000);
    const quantity = new Quantity(3);
    const result = money.multiply(quantity);
    expect(result.value).toBe(3000);
  });

  it("フォーマットできる", () => {
    const money = new Money(1000);
    expect(money.format()).toBe("￥1,000");
  });
});
