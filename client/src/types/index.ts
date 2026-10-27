export type UserRole = "CUSTOMER" | "STAFF";
export type StaffRole = "ADMIN" | "EMPLOYEE";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  documentNumber?: string;
  role: UserRole;
  staffRole?: StaffRole;
  pointsBalance?: number;
  isActive?: boolean;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  pointsRequired: number;
  isActive: boolean;
}

export interface RedemptionCodeItem {
  id: string;
  code: string;
  productName: string;
  pointsSpent: number;
  status: "ACTIVE" | "CONSUMED" | "EXPIRED";
  expiresAt: string;
  consumedAt?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}
