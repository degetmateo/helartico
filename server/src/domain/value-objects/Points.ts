import { Result } from "../../core/Result";

export class Points {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  public get value(): number {
    return this._value;
  }

  public static create(points: number): Result<Points> {
    if (typeof points !== "number" || isNaN(points)) {
      return Result.fail<Points>("Points must be a valid number.");
    }
    if (!Number.isInteger(points)) {
      return Result.fail<Points>("Points must be an integer.");
    }
    if (points < 0) {
      return Result.fail<Points>("Points cannot be negative.");
    }
    return Result.ok<Points>(new Points(points));
  }

  public static zero(): Points {
    return new Points(0);
  }

  public add(additional: Points): Points {
    return new Points(this._value + additional.value);
  }

  public subtract(deduction: Points): Result<Points> {
    if (this._value < deduction.value) {
      return Result.fail<Points>("Insufficient points balance.");
    }
    return Result.ok<Points>(new Points(this._value - deduction.value));
  }

  public hasEnough(required: Points): boolean {
    return this._value >= required.value;
  }
}
