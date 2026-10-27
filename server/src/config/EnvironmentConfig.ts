import dotenv from "dotenv";

dotenv.config();

export class EnvironmentConfig {
  public static get port(): number {
    return parseInt(process.env.PORT || "5000", 10);
  }

  public static get nodeEnv(): string {
    return process.env.NODE_ENV || "development";
  }

  public static get mongoUri(): string {
    return process.env.MONGODB_URI || "mongodb://localhost:27017/helartico";
  }

  public static get jwtSecret(): string {
    return process.env.JWT_SECRET || "helartico_default_secret_replace_in_prod";
  }

  public static get jwtExpiresIn(): string {
    return process.env.JWT_EXPIRES_IN || "7d";
  }

  public static get corsOrigin(): string {
    return process.env.CORS_ORIGIN || "http://localhost:5173";
  }

  public static get redemptionCodeExpirationMinutes(): number {
    return parseInt(process.env.REDEMPTION_CODE_EXPIRATION_MINUTES || "30", 10);
  }

  public static get vapidPublicKey(): string {
    return process.env.VAPID_PUBLIC_KEY || "";
  }

  public static get vapidPrivateKey(): string {
    return process.env.VAPID_PRIVATE_KEY || "";
  }

  public static get vapidSubject(): string {
    return process.env.VAPID_SUBJECT || "mailto:admin@helartico.com";
  }

  public static get cloudinaryCloudName(): string {
    return process.env.CLOUDINARY_CLOUD_NAME || "";
  }

  public static get cloudinaryApiKey(): string {
    return process.env.CLOUDINARY_API_KEY || "";
  }

  public static get cloudinaryApiSecret(): string {
    return process.env.CLOUDINARY_API_SECRET || "";
  }

  public static get cloudinaryFolder(): string {
    return process.env.CLOUDINARY_FOLDER || "helartico_products";
  }
}
