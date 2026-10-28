import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAuditLogDocument extends Document {
  action: string;
  category: string;
  actorId?: Types.ObjectId;
  actorName: string;
  actorEmail?: string;
  actorRole: string;
  targetId?: string;
  targetName?: string;
  targetType?: string;
  description: string;
  details?: Record<string, any>;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLogDocument>(
  {
    action: { type: String, required: true, index: true },
    category: {
      type: String,
      required: true,
      enum: ["POINTS", "REDEMPTION", "PRODUCT", "CUSTOMER", "STAFF", "AUTH"],
      index: true,
    },
    actorId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    actorName: { type: String, required: true },
    actorEmail: { type: String },
    actorRole: { type: String, required: true, index: true },
    targetId: { type: String, index: true },
    targetName: { type: String },
    targetType: { type: String },
    description: { type: String, required: true },
    details: { type: Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now, index: -1 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AuditLogSchema.index({ category: 1, createdAt: -1 });
AuditLogSchema.index({ createdAt: -1 });

export const AuditLogModel = mongoose.model<IAuditLogDocument>(
  "AuditLog",
  AuditLogSchema
);
