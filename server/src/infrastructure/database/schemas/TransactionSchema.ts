import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITransactionDocument extends Document {
  customerId: Types.ObjectId;
  amount: number;
  type: "PURCHASE_REWARD" | "REDEMPTION" | "MANUAL_ADJUSTMENT";
  performedByStaffId?: Types.ObjectId;
  note?: string;
  redemptionCodeId?: Types.ObjectId;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransactionDocument>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    type: {
      type: String,
      required: true,
      enum: ["PURCHASE_REWARD", "REDEMPTION", "MANUAL_ADJUSTMENT"],
    },
    performedByStaffId: { type: Schema.Types.ObjectId, ref: "User" },
    note: { type: String, trim: true },
    redemptionCodeId: { type: Schema.Types.ObjectId, ref: "Redemption" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

TransactionSchema.index({ customerId: 1, createdAt: -1 });

export const TransactionModel = mongoose.model<ITransactionDocument>(
  "PointsTransaction",
  TransactionSchema
);
