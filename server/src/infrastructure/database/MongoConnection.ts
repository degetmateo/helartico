import mongoose from "mongoose";
import { EnvironmentConfig } from "../../config/EnvironmentConfig";

export class MongoConnection {
  private static isConnected: boolean = false;

  public static async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      await mongoose.connect(EnvironmentConfig.mongoUri);
      this.isConnected = true;
      console.log("[MongoDB] Connected successfully to Helartico database.");
    } catch (error) {
      console.error("[MongoDB] Connection error:", error);
      throw error;
    }
  }

  public static async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }
    await mongoose.disconnect();
    this.isConnected = false;
    console.log("[MongoDB] Disconnected.");
  }
}
