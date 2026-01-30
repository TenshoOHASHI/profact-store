import { ValidationError } from "./DomainError";

export class Email {
  private readonly _value: string;
  // [^\s@]+ -> 空白と＠以外の１文字以上
  private readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(value: string) {
    const trimmed = value.trim();
    if (!this.EMAIL_REGEX.test(trimmed)) {
      throw new ValidationError(
        "メールアドレスの形式が正しくありません",
        "email",
      );
    }
    this._value = trimmed.toLocaleLowerCase();
  }

  get value(): string {
    return this._value;
  }
  equals(other: Email): boolean {
    return this._value === other._value;
  }
}
