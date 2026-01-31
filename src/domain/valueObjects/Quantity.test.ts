import { describe, it, expect } from "vitest";
import { Quantity } from "./Quantity";
import { ValidationError } from "./DomainError";

describe("Quantity", () => {
  it("数量を作成できる", () => {
    const quantity = new Quantity(5);
    expect(quantity.value).toBe(5);
  });

  it("0はエラー", () => {
    expect(() => new Quantity(0)).toThrow(ValidationError);
  });

  it("負の値はエラー", () => {
    expect(() => new Quantity(-1)).toThrow(ValidationError);
  });

  it("小数はエラー", () => {
    expect(() => new Quantity(1.5)).toThrow(ValidationError);
  });

  it("数量を加算できる", () => {
    const q1 = new Quantity(3);
    const q2 = new Quantity(2);
    const result = q1.add(q2);
    expect(result.value).toBe(5);
  });
});
