import { Response } from "express";
import { ListAuditLogsUseCase } from "../../application/audit/ListAuditLogsUseCase";
import { AuditCategory } from "../../domain/entities/AuditLog";
import { AuthenticatedRequest } from "../middlewares/AuthMiddleware";

export class AuditLogController {
  constructor(private readonly listAuditLogsUseCase: ListAuditLogsUseCase) {}

  public list = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const category = req.query.category as AuditCategory | undefined;
    const action = req.query.action as string | undefined;
    const actorRole = req.query.role as string | undefined;
    const search = req.query.search as string | undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 15;

    const result = await this.listAuditLogsUseCase.execute({
      category: category && category !== ("ALL" as any) ? category : undefined,
      action,
      actorRole,
      searchTerm: search,
      page,
      limit,
    });

    res.json({
      success: true,
      data: result.items.map((log) => ({
        id: log.id,
        action: log.action,
        category: log.category,
        actorId: log.actorId,
        actorName: log.actorName,
        actorEmail: log.actorEmail,
        actorRole: log.actorRole,
        targetId: log.targetId,
        targetName: log.targetName,
        targetType: log.targetType,
        description: log.description,
        details: log.details,
        createdAt: log.createdAt,
      })),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        hasMore: result.hasMore,
      },
    });
  };
}
