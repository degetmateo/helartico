export type AuditCategory =
  | "POINTS"
  | "REDEMPTION"
  | "PRODUCT"
  | "CUSTOMER"
  | "STAFF"
  | "AUTH";

export interface AuditLogProps {
  id?: string;
  action: string;
  category: AuditCategory;
  actorId?: string;
  actorName: string;
  actorEmail?: string;
  actorRole: string; // "ADMIN" | "EMPLOYEE" | "CUSTOMER" | "SYSTEM" | string
  targetId?: string;
  targetName?: string;
  targetType?: string; // "CUSTOMER" | "PRODUCT" | "STAFF" | "REDEMPTION_CODE" | string
  description: string;
  details?: Record<string, any>;
  createdAt?: Date;
}

export class AuditLog {
  private readonly _id?: string;
  private readonly _action: string;
  private readonly _category: AuditCategory;
  private readonly _actorId?: string;
  private readonly _actorName: string;
  private readonly _actorEmail?: string;
  private readonly _actorRole: string;
  private readonly _targetId?: string;
  private readonly _targetName?: string;
  private readonly _targetType?: string;
  private readonly _description: string;
  private readonly _details?: Record<string, any>;
  private readonly _createdAt: Date;

  constructor(props: AuditLogProps) {
    this._id = props.id;
    this._action = props.action.trim();
    this._category = props.category;
    this._actorId = props.actorId;
    this._actorName = props.actorName.trim();
    this._actorEmail = props.actorEmail?.trim();
    this._actorRole = props.actorRole.trim();
    this._targetId = props.targetId;
    this._targetName = props.targetName?.trim();
    this._targetType = props.targetType?.trim();
    this._description = props.description.trim();
    this._details = props.details;
    this._createdAt = props.createdAt ?? new Date();
  }

  public get id(): string | undefined { return this._id; }
  public get action(): string { return this._action; }
  public get category(): AuditCategory { return this._category; }
  public get actorId(): string | undefined { return this._actorId; }
  public get actorName(): string { return this._actorName; }
  public get actorEmail(): string | undefined { return this._actorEmail; }
  public get actorRole(): string { return this._actorRole; }
  public get targetId(): string | undefined { return this._targetId; }
  public get targetName(): string | undefined { return this._targetName; }
  public get targetType(): string | undefined { return this._targetType; }
  public get description(): string { return this._description; }
  public get details(): Record<string, any> | undefined { return this._details; }
  public get createdAt(): Date { return this._createdAt; }
}
