import { Types } from "mongoose";
import { AuditCategory, AuditLog } from "../../../domain/entities/AuditLog";
import { IAuditLogDocument } from "../schemas/AuditLogSchema";

export class AuditLogMapper {
  public static toDomain(raw: IAuditLogDocument): AuditLog {
    return new AuditLog({
      id: raw._id.toString(),
      action: raw.action,
      category: raw.category as AuditCategory,
      actorId: raw.actorId ? raw.actorId.toString() : undefined,
      actorName: raw.actorName,
      actorEmail: raw.actorEmail,
      actorRole: raw.actorRole,
      targetId: raw.targetId,
      targetName: raw.targetName,
      targetType: raw.targetType,
      description: raw.description,
      details: raw.details,
      createdAt: raw.createdAt,
    });
  }

  public static toPersistence(log: AuditLog): Record<string, any> {
    const data: Record<string, any> = {
      action: log.action,
      category: log.category,
      actorName: log.actorName,
      actorEmail: log.actorEmail,
      actorRole: log.actorRole,
      targetId: log.targetId,
      targetName: log.targetName,
      targetType: log.targetType,
      description: log.description,
      details: log.details,
      createdAt: log.createdAt,
    };

    if (log.actorId && Types.ObjectId.isValid(log.actorId)) {
      data.actorId = new Types.ObjectId(log.actorId);
    }

    return data;
  }
}
