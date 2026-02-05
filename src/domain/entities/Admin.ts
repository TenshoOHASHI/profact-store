import { Email } from "../valueObjects/Email";

export interface AdminProps {
  id: string;
  email: Email;
  name: string;
  hashedPassword: string;
  createdAt: Date;
}

export class Admin {
  private readonly _id: string;
  private readonly _email: Email;
  private readonly _name: string;
  private readonly _hashedPassword: string;
  private readonly _createdAt: Date;

  constructor(props: AdminProps) {
    this._id = props.id;
    this._email = props.email;
    this._name = props.name;
    this._hashedPassword = props.hashedPassword;
    this._createdAt = props.createdAt;
  }

  static create(email: Email, hashedPassword: string, name: string): Admin {
    return new Admin({
      id: crypto.randomUUID(),
      email,
      hashedPassword,
      name,
      createdAt: new Date(),
    });
  }

  withEmail(newEmail: Email): Admin {
    return new Admin({
      id: this._id,
      email: newEmail,
      name: this._name,
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
  get name(): string {
    return this._name;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get hashedPassword(): string {
    return this._hashedPassword;
  }
}
