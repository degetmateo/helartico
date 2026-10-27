import bcrypt from "bcryptjs";

export class BcryptPasswordHasher {
  private static readonly SALT_ROUNDS = 10;

  public static async hash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, this.SALT_ROUNDS);
  }

  public static async compare(plainPassword: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hash);
  }
}
