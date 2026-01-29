export abstract class DomainError extends Error {
  readonly _isDomainError = true;

  constructor(
    message: string,
    public readonly code: string,
    public readonly field?: string,
  ) {
    super(message);
    // class name
    this.name = this.constructor.name;
  }
}

// Error Type & Field
export class ValidationError extends DomainError {
  constructor(message: string, field?: string) {
    super(message, "VALIDATION_ERROR", field);
  }
}

//　注文数、在庫数、
export class BusinessRuleError extends DomainError {
  constructor(
    message: string,
    ruleName: string,
    field?: string,
    //
    public readonly details?: Record<string, unknown>,
  ) {
    super(message, `BUSINESS_RULE_ERROR_$(ruleName)`, field);
  }
}
