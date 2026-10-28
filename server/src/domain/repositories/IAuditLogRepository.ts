import { PaginatedResult } from "../../core/Pagination";
import { AuditCategory, AuditLog } from "../entities/AuditLog";

export interface AuditLogSearchCriteria {
  category?: AuditCategory;
  action?: string;
  actorRole?: string;
  searchTerm?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface IAuditLogRepository {
  save(log: AuditLog): Promise<AuditLog>;
  search(criteria: AuditLogSearchCriteria): Promise<PaginatedResult<AuditLog>>;
}
