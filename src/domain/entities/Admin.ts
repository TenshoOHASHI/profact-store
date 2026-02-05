import { ValidationError } from "../valueObjects/DomainError";
import { Email } from "../valueObjects/Email";

export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  verify(plainPassword: string, hashedPassword: string): Promise<boolean>;
}

export interface AdminProps {
  id: string;
  email: Email;
  hashedPassword: string;
  createdAt: Date;
}

export class Admin {
  private readonly _id: string;
  private readonly _email: Email;
  private readonly _hashedPassword: string;
  private readonly _createdAt: Date;

  constructor(props: AdminProps) {
    this._id = props.id;
    this._email = props.email;
    this._hashedPassword = props.hashedPassword;
    this._createdAt = props.createdAt;
  }

  static async create(
    email: Email,
    plainPassword: string,
    passwordHasher: IPasswordHasher,
  ): Promise<Admin> {
    // パスワードバリデーション
    Admin.validatePassword(plainPassword);

    const hashedPassword = await passwordHasher.hash(plainPassword);

    return new Admin({
      id: crypto.randomUUID(),
      email,
      hashedPassword,
      createdAt: new Date(),
    });
  }

  async verifyPassword(
    plainPassword: string,
    passwordHasher: IPasswordHasher,
  ): Promise<boolean> {
    return await passwordHasher.verify(plainPassword, this._hashedPassword);
  }

  private static validatePassword(password: string): void {
    if (password.length < 8) {
      throw new ValidationError(
        "パスワードは8文字以上で入力してください",
        "password",
      );
    }

    if (!/[a-z]/.test(password)) {
      throw new ValidationError(
        "パスワードには英小文字を含めてください",
        "password",
      );
    }

    if (!/[A-Z]/.test(password)) {
      throw new ValidationError(
        "パスワードには英大文字を含めてください",
        "password",
      );
    }

    if (!/[0-9]/.test(password)) {
      throw new ValidationError(
        "パスワードには数字を含めてください",
        "password",
      );
    }
  }

  withEmail(newEmail: Email): Admin {
    return new Admin({
      id: this._id,
      email: newEmail,
      hashedPassword: this._hashedPassword,
      createdAt: this._createdAt,
    });
  }

  get id(): string {
    return this._id;
  }
  get email(): Email {
    return this._email;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
}
