import { PaginatedResult } from "../../core/Pagination";
import { Staff, StaffRole } from "../entities/Staff";
import { DocumentNumber } from "../value-objects/DocumentNumber";
import { Email } from "../value-objects/Email";

export interface StaffSearchCriteria {
  searchTerm?: string;
  role?: StaffRole;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface IStaffRepository {
  findById(id: string): Promise<Staff | null>;
  findByEmail(email: Email): Promise<Staff | null>;
  findByDocumentNumber(documentNumber: DocumentNumber): Promise<Staff | null>;
  findAll(criteria?: StaffSearchCriteria): Promise<PaginatedResult<Staff>>;
  save(staff: Staff): Promise<Staff>;
  delete(id: string): Promise<void>;
}
