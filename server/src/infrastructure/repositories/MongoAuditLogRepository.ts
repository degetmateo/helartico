import { PaginatedResult, PaginationHelper } from "../../core/Pagination";
import { AuditLog } from "../../domain/entities/AuditLog";
import {
  AuditLogSearchCriteria,
  IAuditLogRepository,
} from "../../domain/repositories/IAuditLogRepository";
import { AuditLogMapper } from "../database/mappers/AuditLogMapper";
import { AuditLogModel } from "../database/schemas/AuditLogSchema";

export class MongoAuditLogRepository implements IAuditLogRepository {
  public async save(log: AuditLog): Promise<AuditLog> {
    const persistenceData = AuditLogMapper.toPersistence(log);
    const created = await AuditLogModel.create(persistenceData);
    return AuditLogMapper.toDomain(created);
  }

  public async search(criteria: AuditLogSearchCriteria): Promise<PaginatedResult<AuditLog>> {
    const query: Record<string, any> = {};

    if (criteria.category) {
      query.category = criteria.category;
    }

    if (criteria.action) {
      query.action = criteria.action;
    }

    if (criteria.actorRole) {
      query.actorRole = criteria.actorRole;
    }

    if (criteria.startDate || criteria.endDate) {
      query.createdAt = {};
      if (criteria.startDate) {
        query.createdAt.$gte = criteria.startDate;
      }
      if (criteria.endDate) {
        query.createdAt.$lte = criteria.endDate;
      }
    }

    if (criteria.searchTerm) {
      const regex = new RegExp(criteria.searchTerm.trim(), "i");
      query.$or = [
        { description: regex },
        { actorName: regex },
        { actorEmail: regex },
        { targetName: regex },
        { action: regex },
      ];
    }

    const total = await AuditLogModel.countDocuments(query);
    const { page, limit, skip } = PaginationHelper.normalize(criteria, 15);

    const docs = await AuditLogModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const items = docs.map((doc) => AuditLogMapper.toDomain(doc));
    return PaginationHelper.createPaginatedResult(items, total, page, limit);
  }
}
