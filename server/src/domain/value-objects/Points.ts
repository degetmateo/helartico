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
      return Result.fail<Points>("Los puntos deben ser un número válido.");
    }
    if (!Number.isInteger(points)) {
      return Result.fail<Points>("Los puntos deben ser un número entero.");
    }
    if (points < 0) {
      return Result.fail<Points>("Los puntos no pueden ser negativos.");
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
      return Result.fail<Points>("Saldo de puntos insuficiente.");
    }
    return Result.ok<Points>(new Points(this._value - deduction.value));
  }

  public hasEnough(required: Points): boolean {
    return this._value >= required.value;
  }
}
