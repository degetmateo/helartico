import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRedemptionDocument extends Document {
  code: string;
  customerId: Types.ObjectId;
  productId: Types.ObjectId;
  pointsSpent: number;
  status: "ACTIVE" | "CONSUMED" | "EXPIRED";
  expiresAt: Date;
  consumedAt?: Date;
  consumedByStaffId?: Types.ObjectId;
  createdAt: Date;
}

const RedemptionSchema = new Schema<IRedemptionDocument>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    pointsSpent: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      required: true,
      enum: ["ACTIVE", "CONSUMED", "EXPIRED"],
      default: "ACTIVE",
    },
    expiresAt: { type: Date, required: true },
    consumedAt: { type: Date },
    consumedByStaffId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

RedemptionSchema.index({ customerId: 1, createdAt: -1 });
RedemptionSchema.index({ expiresAt: 1 });

export const RedemptionModel = mongoose.model<IRedemptionDocument>(
  "Redemption",
  RedemptionSchema
);
