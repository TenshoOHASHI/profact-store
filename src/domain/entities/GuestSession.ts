import { BusinessRuleError } from "../valueObjects/DomainError";
import { Token } from "../valueObjects/Token";

export interface GuestSessionProps {
  id: string;
  token: Token;
  expiresAt: Date;
  createdAt: Date;
}

export class GuestSession {
  private readonly _id: string;
  private readonly _token: Token;
  private readonly _expiresAt: Date;
  private readonly _createdAt: Date;

  private static readonly DEFAULT_EXPIRY_DAYS = 7;

  constructor(props: GuestSessionProps) {
    this._id = props.id;
    this._token = props.token;
    this._expiresAt = props.expiresAt;
    this._createdAt = props.createdAt;
  }

  static create(): GuestSession {
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + GuestSession.DEFAULT_EXPIRY_DAYS);

    return new GuestSession({
      id: crypto.randomUUID(),
      token: Token.generate(),
      expiresAt,
      createdAt: now,
    });
  }

  isExpired(): boolean {
    return new Date() > this._expiresAt;
  }

  validate(): void {
    if (this.isExpired()) {
      throw new BusinessRuleError(
        "ゲストセッションの有効期限が切れています",
        "SESSION_EXPIRED",
        "expiresAt",
      );
    }
  }

  getRemainingDays(): number {
    const now = new Date();
    const diffMs = this._expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  get id(): string {
    return this._id;
  }
  get token(): Token {
    return this._token;
  }
  get expiresAt(): Date {
    return this._expiresAt;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
}
