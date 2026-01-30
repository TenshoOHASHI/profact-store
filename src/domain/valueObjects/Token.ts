import { ValidationError } from "./DomainError";

export class Token {
  private readonly _value: string;
  private readonly MIN_LENGTH = 32;

  constructor(value: string) {
    const trimmed = value.trim();

    if (trimmed.length < this.MIN_LENGTH) {
      throw new ValidationError(
        `トークンは${this.MIN_LENGTH}文字以上である必要があります`,
        "token",
      );
    }
    this._value = trimmed;
  }

  get value(): string {
    return this._value;
  }

  equals(other: Token): boolean {
    return this._value === other._value;
  }

  static generate(): Token {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    const token = Array.from(randomBytes, (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");
    return new Token(token);
  }
}
