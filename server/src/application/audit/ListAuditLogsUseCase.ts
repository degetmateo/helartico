import { PaginatedResult } from "../../core/Pagination";
import { AuditCategory, AuditLog } from "../../domain/entities/AuditLog";
import { IAuditLogRepository } from "../../domain/repositories/IAuditLogRepository";

export interface ListAuditLogsDTO {
  category?: AuditCategory;
  action?: string;
  actorRole?: string;
  searchTerm?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export class ListAuditLogsUseCase {
  constructor(private readonly auditLogRepo: IAuditLogRepository) {}

  public async execute(dto: ListAuditLogsDTO): Promise<PaginatedResult<AuditLog>> {
    return this.auditLogRepo.search(dto);
  }
}
