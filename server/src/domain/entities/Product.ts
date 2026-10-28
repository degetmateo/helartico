import { Result } from "../../core/Result";
import { Points } from "../value-objects/Points";

export interface ProductProps {
  id?: string;
  name: string;
  imageUrl: string;
  pointsRequired: Points;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product {
  private readonly _id?: string;
  private _name: string;
  private _imageUrl: string;
  private _pointsRequired: Points;
  private _isActive: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ProductProps) {
    this._id = props.id;
    this._name = props.name.trim();
    this._imageUrl = props.imageUrl.trim();
    this._pointsRequired = props.pointsRequired;
    this._isActive = props.isActive;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  public get id(): string | undefined { return this._id; }
  public get name(): string { return this._name; }
  public get imageUrl(): string { return this._imageUrl; }
  public get pointsRequired(): Points { return this._pointsRequired; }
  public get isActive(): boolean { return this._isActive; }
  public get createdAt(): Date { return this._createdAt; }
  public get updatedAt(): Date { return this._updatedAt; }

  public update(name: string, imageUrl: string, points: Points): Result<void> {
    if (!name || name.trim().length === 0) {
      return Result.fail<void>("El nombre del producto no puede estar vacío.");
    }
    this._name = name.trim();
    this._imageUrl = imageUrl.trim();
    this._pointsRequired = points;
    this._updatedAt = new Date();
    return Result.ok<void>();
  }

  public activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  public deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }
}
