import { AuditLog, AuditLogProps } from "../../domain/entities/AuditLog";
import { IAuditLogRepository } from "../../domain/repositories/IAuditLogRepository";

export class AuditLogService {
  constructor(private readonly auditLogRepo: IAuditLogRepository) {}

  public async log(props: AuditLogProps): Promise<void> {
    try {
      const log = new AuditLog(props);
      await this.auditLogRepo.save(log);
    } catch (error) {
      console.error("[AuditLogService] Failed to record audit log:", error);
    }
  }
}
