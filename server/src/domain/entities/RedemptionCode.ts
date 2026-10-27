import { Result } from "../../core/Result";
import { Points } from "../value-objects/Points";
import { RedemptionToken } from "../value-objects/RedemptionToken";

export type RedemptionStatus = "ACTIVE" | "CONSUMED" | "EXPIRED";

export interface RedemptionCodeProps {
  id?: string;
  code: RedemptionToken;
  customerId: string;
  productId: string;
  pointsSpent: Points;
  status: RedemptionStatus;
  expiresAt: Date;
  consumedAt?: Date;
  consumedByStaffId?: string;
  createdAt?: Date;
}

export class RedemptionCode {
  private readonly _id?: string;
  private readonly _code: RedemptionToken;
  private readonly _customerId: string;
  private readonly _productId: string;
  private readonly _pointsSpent: Points;
  private _status: RedemptionStatus;
  private readonly _expiresAt: Date;
  private _consumedAt?: Date;
  private _consumedByStaffId?: string;
  private readonly _createdAt: Date;

  constructor(props: RedemptionCodeProps) {
    this._id = props.id;
    this._code = props.code;
    this._customerId = props.customerId;
    this._productId = props.productId;
    this._pointsSpent = props.pointsSpent;
    this._status = props.status;
    this._expiresAt = props.expiresAt;
    this._consumedAt = props.consumedAt;
    this._consumedByStaffId = props.consumedByStaffId;
    this._createdAt = props.createdAt ?? new Date();
  }

  public get id(): string | undefined { return this._id; }
  public get code(): RedemptionToken { return this._code; }
  public get customerId(): string { return this._customerId; }
  public get productId(): string { return this._productId; }
  public get pointsSpent(): Points { return this._pointsSpent; }
  public get status(): RedemptionStatus { return this._status; }
  public get expiresAt(): Date { return this._expiresAt; }
  public get consumedAt(): Date | undefined { return this._consumedAt; }
  public get consumedByStaffId(): string | undefined { return this._consumedByStaffId; }
  public get createdAt(): Date { return this._createdAt; }

  public isExpired(currentDate: Date = new Date()): boolean {
    return currentDate.getTime() > this._expiresAt.getTime();
  }

  public consume(staffId: string, currentDate: Date = new Date()): Result<void> {
    if (this._status === "CONSUMED") {
      return Result.fail<void>("This redemption code has already been consumed.");
    }
    if (this.isExpired(currentDate)) {
      this._status = "EXPIRED";
      return Result.fail<void>("This redemption code has expired.");
    }
    this._status = "CONSUMED";
    this._consumedAt = currentDate;
    this._consumedByStaffId = staffId;
    return Result.ok<void>();
  }
}
