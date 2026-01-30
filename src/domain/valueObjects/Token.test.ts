import { describe, it, expect } from "vitest";
import { Token } from "./Token";
import { ValidationError } from "./DomainError";

describe("Token", () => {
  it("トークンを作成できる", () => {
    const token = new Token("a".repeat(32));
    expect(token.value).toBe("a".repeat(32));
  });

  it("短いトークンはエラー", () => {
    expect(() => new Token("short")).toThrow(ValidationError);
  });

  it("トークンを生成できる", () => {
    const token = Token.generate();
    expect(token.value.length).toBeGreaterThanOrEqual(32);
  });
});
