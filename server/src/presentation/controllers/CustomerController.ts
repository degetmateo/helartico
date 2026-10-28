import { Response } from "express";
import { RegisterCustomerUseCase } from "../../application/auth/RegisterCustomerUseCase";
import { AddPointsUseCase } from "../../application/customers/AddPointsUseCase";
import { GetCustomerByIdUseCase } from "../../application/customers/GetCustomerByIdUseCase";
import { ListCustomersUseCase } from "../../application/customers/ListCustomersUseCase";
import { SetCustomerPointsUseCase } from "../../application/customers/SetCustomerPointsUseCase";
import { UpdateCustomerUseCase } from "../../application/customers/UpdateCustomerUseCase";
import { AuditLogService } from "../../infrastructure/services/AuditLogService";
import { AuthenticatedRequest } from "../middlewares/AuthMiddleware";

export class CustomerController {
  constructor(
    private readonly listCustomersUseCase: ListCustomersUseCase,
    private readonly getCustomerByIdUseCase: GetCustomerByIdUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
    private readonly addPointsUseCase: AddPointsUseCase,
    private readonly registerCustomerUseCase: RegisterCustomerUseCase,
    private readonly setCustomerPointsUseCase: SetCustomerPointsUseCase,
    private readonly auditLogService?: AuditLogService
  ) {}

  public search = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const search = req.query.search as string | undefined;
    const isActive = req.query.isActive !== undefined ? req.query.isActive === "true" : undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

    const result = await this.listCustomersUseCase.execute({
      search,
      isActive,
      page,
      limit,
    });

    res.json({
      success: true,
      data: result.items.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email.value,
        phone: c.phone,
        documentNumber: c.documentNumber.value,
        pointsBalance: c.pointsBalance.value,
        isActive: c.isActive,
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

  public create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const result = await this.registerCustomerUseCase.execute(req.body);
    if (result.isFailure) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }
    const c = result.getValue();

    if (this.auditLogService) {
      const actorName = req.user?.name || req.user?.email || "Personal";
      await this.auditLogService.log({
        action: "CUSTOMER_CREATE",
        category: "CUSTOMER",
        actorId: req.user?.userId,
        actorName,
        actorRole: req.user?.staffRole || req.user?.role || "STAFF",
        targetId: c.id,
        targetName: c.name,
        targetType: "CUSTOMER",
        description: `El personal ${actorName} dio de alta al cliente ${c.name} (DNI: ${c.documentNumber.value}).`,
        details: { email: c.email.value, phone: c.phone },
      });
    }

    res.status(201).json({
      success: true,
      data: {
        id: c.id,
        name: c.name,
        email: c.email.value,
        phone: c.phone,
        documentNumber: c.documentNumber.value,
        pointsBalance: c.pointsBalance.value,
      },
    });
  };

  public getById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const result = await this.getCustomerByIdUseCase.execute(req.params.id);
    if (result.isFailure) {
      res.status(404).json({ success: false, error: result.error });
      return;
    }
    const c = result.getValue();
    res.json({
      success: true,
      data: {
        id: c.id,
        name: c.name,
        email: c.email.value,
        phone: c.phone,
        documentNumber: c.documentNumber.value,
        pointsBalance: c.pointsBalance.value,
        isActive: c.isActive,
      },
    });
  };

  public update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const result = await this.updateCustomerUseCase.execute({
      customerId: req.params.id,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      documentNumber: req.body.documentNumber,
      password: req.body.password,
    });
    if (result.isFailure) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }
    const c = result.getValue();

    if (this.auditLogService) {
      const actorName = req.user?.name || req.user?.email || "Personal";
      const passResetText = req.body.password ? " y restableció su contraseña" : "";
      await this.auditLogService.log({
        action: "CUSTOMER_UPDATE",
        category: "CUSTOMER",
        actorId: req.user?.userId,
        actorName,
        actorRole: req.user?.staffRole || req.user?.role || "STAFF",
        targetId: c.id,
        targetName: c.name,
        targetType: "CUSTOMER",
        description: `El personal ${actorName} actualizó los datos${passResetText} del cliente ${c.name}.`,
        details: { email: c.email.value, phone: c.phone, passwordReset: !!req.body.password },
      });
    }
    res.json({
      success: true,
      data: {
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email.value,
        documentNumber: c.documentNumber.value,
      },
    });
  };

  public addPoints = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const staffId = req.user?.userId;
    if (!staffId) {
      res.status(401).json({ success: false, error: "Autenticación de personal requerida." });
      return;
    }
    const result = await this.addPointsUseCase.execute({
      customerId: req.params.id,
      pointsToAdd: Number(req.body.points),
      staffId,
      staffName: req.user?.name || req.user?.email || "Personal",
      staffRole: req.user?.staffRole || req.user?.role || "STAFF",
      note: req.body.note,
    });
    if (result.isFailure) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }
    const c = result.getValue();
    res.json({
      success: true,
      data: { id: c.id, name: c.name, pointsBalance: c.pointsBalance.value },
    });
  };

  public setPoints = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const staffId = req.user?.userId;
    if (!staffId) {
      res.status(401).json({ success: false, error: "Autenticación de personal requerida." });
      return;
    }

    const rawPoints = req.body.points !== undefined ? req.body.points : req.body.targetPoints;
    if (rawPoints === undefined || rawPoints === null || isNaN(Number(rawPoints))) {
      res.status(400).json({ success: false, error: "Los puntos deben ser un número válido." });
      return;
    }

    const result = await this.setCustomerPointsUseCase.execute({
      customerId: req.params.id,
      targetPoints: Number(rawPoints),
      staffId,
      staffName: req.user?.name || req.user?.email || "Personal",
      staffRole: req.user?.staffRole || req.user?.role || "STAFF",
      reason: req.body.reason || req.body.note,
    });

    if (result.isFailure) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    const c = result.getValue();
    res.json({
      success: true,
      data: { id: c.id, name: c.name, pointsBalance: c.pointsBalance.value },
    });
  };
}
