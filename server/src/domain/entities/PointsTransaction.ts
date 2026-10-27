export type TransactionType = "PURCHASE_REWARD" | "REDEMPTION" | "MANUAL_ADJUSTMENT";

export interface PointsTransactionProps {
  id?: string;
  customerId: string;
  amount: number;
  type: TransactionType;
  performedByStaffId?: string;
  note?: string;
  redemptionCodeId?: string;
  createdAt?: Date;
}

export class PointsTransaction {
  private readonly _id?: string;
  private readonly _customerId: string;
  private readonly _amount: number;
  private readonly _type: TransactionType;
  private readonly _performedByStaffId?: string;
  private readonly _note?: string;
  private readonly _redemptionCodeId?: string;
  private readonly _createdAt: Date;

  constructor(props: PointsTransactionProps) {
    this._id = props.id;
    this._customerId = props.customerId;
    this._amount = props.amount;
    this._type = props.type;
    this._performedByStaffId = props.performedByStaffId;
    this._note = props.note;
    this._redemptionCodeId = props.redemptionCodeId;
    this._createdAt = props.createdAt ?? new Date();
  }

  public get id(): string | undefined { return this._id; }
  public get customerId(): string { return this._customerId; }
  public get amount(): number { return this._amount; }
  public get type(): TransactionType { return this._type; }
  public get performedByStaffId(): string | undefined { return this._performedByStaffId; }
  public get note(): string | undefined { return this._note; }
  public get redemptionCodeId(): string | undefined { return this._redemptionCodeId; }
  public get createdAt(): Date { return this._createdAt; }
}
