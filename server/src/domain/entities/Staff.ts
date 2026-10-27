import { DocumentNumber } from "../value-objects/DocumentNumber";
import { Email } from "../value-objects/Email";

export type StaffRole = "ADMIN" | "EMPLOYEE";

export interface StaffProps {
  id?: string;
  name: string;
  email: Email;
  phone?: string;
  documentNumber?: DocumentNumber;
  passwordHash: string;
  role?: StaffRole;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Staff {
  private readonly _id?: string;
  private _name: string;
  private readonly _email: Email;
  private _phone: string;
  private _documentNumber?: DocumentNumber;
  private _passwordHash: string;
  private _role: StaffRole;
  private _isActive: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: StaffProps) {
    this._id = props.id;
    this._name = props.name.trim();
    this._email = props.email;
    this._phone = (props.phone ?? "").trim();
    this._documentNumber = props.documentNumber;
    this._passwordHash = props.passwordHash;
    this._role = props.role ?? "EMPLOYEE";
    this._isActive = props.isActive;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  public get id(): string | undefined { return this._id; }
  public get name(): string { return this._name; }
  public get email(): Email { return this._email; }
  public get phone(): string { return this._phone; }
  public get documentNumber(): DocumentNumber | undefined { return this._documentNumber; }
  public get passwordHash(): string { return this._passwordHash; }
  public get role(): StaffRole { return this._role; }
  public get isActive(): boolean { return this._isActive; }
  public get createdAt(): Date { return this._createdAt; }
  public get updatedAt(): Date { return this._updatedAt; }

  public updateProfile(
    name: string,
    phone?: string,
    documentNumber?: DocumentNumber,
    role?: StaffRole
  ): void {
    this._name = name.trim();
    if (phone !== undefined) this._phone = phone.trim();
    if (documentNumber !== undefined) this._documentNumber = documentNumber;
    if (role !== undefined) this._role = role;
    this._updatedAt = new Date();
  }

  public changePassword(newPasswordHash: string): void {
    this._passwordHash = newPasswordHash;
    this._updatedAt = new Date();
  }

  public deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  public activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }
}
