import { describe, it, expect } from "vitest";
import { ValidationError, BusinessRuleError } from "./DomainError";

describe("DomainError", () => {
  describe("ValidationError", () => {
    it("バリデーションエラーを作成できる", () => {
      const error = new ValidationError("Invalid input", "email");

      expect(error.code).toBe("VALIDATION_ERROR");
      expect(error.field).toBe("email");
    });
  });

  describe("BusinessRuleError", () => {
    it("ruleNameがコードに含まれることを確認する", () => {
      const error = new BusinessRuleError("msg", "TestRule");

      expect(error.code).toBe("BUSINESS_RULE_ERROR_TestRule");
    });
  });
});
