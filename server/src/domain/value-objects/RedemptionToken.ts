import { Result } from "../../core/Result";

export class RedemptionToken {
  private static readonly TOKEN_PATTERN = /^HLT-[A-Z0-9]{6}$/;
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public get value(): string {
    return this._value;
  }

  public static generate(): RedemptionToken {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No ambiguous chars like 0/O, 1/I
    let randomPart = "";
    for (let i = 0; i < 6; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return new RedemptionToken(`HLT-${randomPart}`);
  }

  public static create(token: string): Result<RedemptionToken> {
    if (!token || typeof token !== "string") {
      return Result.fail<RedemptionToken>("El código de canje es obligatorio.");
    }
    const cleanToken = token.trim().toUpperCase();
    if (!RedemptionToken.TOKEN_PATTERN.test(cleanToken)) {
      return Result.fail<RedemptionToken>("El formato del código de canje no es válido (ej: HLT-ABC123).");
    }
    return Result.ok<RedemptionToken>(new RedemptionToken(cleanToken));
  }
}
