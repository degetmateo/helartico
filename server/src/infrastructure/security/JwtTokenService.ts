import jwt, { SignOptions } from "jsonwebtoken";
import { EnvironmentConfig } from "../../config/EnvironmentConfig";
import { StaffRole } from "../../domain/entities/Staff";

export interface TokenPayload {
  userId: string;
  role: "CUSTOMER" | "STAFF";
  staffRole?: StaffRole;
  email: string;
}

export class JwtTokenService {
  public static generateToken(payload: TokenPayload): string {
    const options: SignOptions = {
      expiresIn: EnvironmentConfig.jwtExpiresIn as any,
    };
    return jwt.sign(payload, EnvironmentConfig.jwtSecret, options);
  }

  public static verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, EnvironmentConfig.jwtSecret) as TokenPayload;
    } catch {
      return null;
    }
  }
}
