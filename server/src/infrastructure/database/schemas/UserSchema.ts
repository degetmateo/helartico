import mongoose, { Schema, Document } from "mongoose";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  phone?: string;
  documentNumber?: string;
  passwordHash: string;
  role: "CUSTOMER" | "STAFF";
  staffRole?: "ADMIN" | "EMPLOYEE";
  pointsBalance: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: false, default: "", trim: true },
    documentNumber: { type: String, required: false, unique: true, sparse: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ["CUSTOMER", "STAFF"], default: "CUSTOMER" },
    staffRole: { type: String, required: false, enum: ["ADMIN", "EMPLOYEE"], default: undefined },
    pointsBalance: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UserSchema.index({ role: 1 });
UserSchema.index({ staffRole: 1 });

export const UserModel = mongoose.model<IUserDocument>("User", UserSchema);
