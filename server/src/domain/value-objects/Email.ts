import { Result } from "../../core/Result";

export class Email {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public get value(): string {
    return this._value;
  }

  public static create(email: string): Result<Email> {
    if (!email || typeof email !== "string") {
      return Result.fail<Email>("El correo electrónico es obligatorio.");
    }
    const trimmed = email.trim().toLowerCase();
    if (!Email.EMAIL_REGEX.test(trimmed)) {
      return Result.fail<Email>("El formato del correo electrónico no es válido.");
    }
    return Result.ok<Email>(new Email(trimmed));
  }

  public equals(other?: Email): boolean {
    if (!other) return false;
    return this._value === other._value;
  }
}
