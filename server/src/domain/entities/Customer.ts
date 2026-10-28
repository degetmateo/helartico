import { Result } from "../../core/Result";
import { DocumentNumber } from "../value-objects/DocumentNumber";
import { Email } from "../value-objects/Email";
import { Points } from "../value-objects/Points";

export interface CustomerProps {
  id?: string;
  name: string;
  email: Email;
  phone?: string;
  documentNumber: DocumentNumber;
  passwordHash: string;
  pointsBalance: Points;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Customer {
  private readonly _id?: string;
  private _name: string;
  private readonly _email: Email;
  private _phone: string;
  private readonly _documentNumber: DocumentNumber;
  private _passwordHash: string;
  private _pointsBalance: Points;
  private _isActive: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: CustomerProps) {
    this._id = props.id;
    this._name = props.name.trim();
    this._email = props.email;
    this._phone = (props.phone ?? "").trim();
    this._documentNumber = props.documentNumber;
    this._passwordHash = props.passwordHash;
    this._pointsBalance = props.pointsBalance;
    this._isActive = props.isActive;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  public get id(): string | undefined { return this._id; }
  public get name(): string { return this._name; }
  public get email(): Email { return this._email; }
  public get phone(): string { return this._phone; }
  public get documentNumber(): DocumentNumber { return this._documentNumber; }
  public get passwordHash(): string { return this._passwordHash; }
  public get pointsBalance(): Points { return this._pointsBalance; }
  public get isActive(): boolean { return this._isActive; }
  public get createdAt(): Date { return this._createdAt; }
  public get updatedAt(): Date { return this._updatedAt; }

  public addPoints(amount: Points): void {
    this._pointsBalance = this._pointsBalance.add(amount);
    this._updatedAt = new Date();
  }

  public deductPoints(amount: Points): Result<void> {
    const result = this._pointsBalance.subtract(amount);
    if (result.isFailure) {
      return Result.fail<void>(result.error);
    }
    this._pointsBalance = result.getValue();
    this._updatedAt = new Date();
    return Result.ok<void>();
  }

  public setPoints(newPoints: Points): void {
    this._pointsBalance = newPoints;
    this._updatedAt = new Date();
  }

  public updateProfile(
    name: string,
    phone?: string,
    email?: Email,
    documentNumber?: DocumentNumber
  ): void {
    this._name = name.trim();
    if (phone !== undefined) {
      this._phone = phone.trim();
    }
    if (email) (this as any)._email = email;
    if (documentNumber) (this as any)._documentNumber = documentNumber;
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
}
