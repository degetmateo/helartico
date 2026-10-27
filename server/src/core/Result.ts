export class Result<T> {
  private readonly _isSuccess: boolean;
  private readonly _error?: string;
  private readonly _value?: T;

  private constructor(isSuccess: boolean, error?: string, value?: T) {
    this._isSuccess = isSuccess;
    this._error = error;
    this._value = value;
  }

  public get isSuccess(): boolean {
    return this._isSuccess;
  }

  public get isFailure(): boolean {
    return !this._isSuccess;
  }

  public get error(): string {
    if (this._isSuccess) {
      throw new Error("Cannot get the error of a success result.");
    }
    return this._error ?? "Unknown error";
  }

  public getValue(): T {
    if (!this._isSuccess) {
      throw new Error("Cannot get the value of a failure result.");
    }
    return this._value as T;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error);
  }
}
