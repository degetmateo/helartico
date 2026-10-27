import { Response } from "express";
import { CreateStaffUseCase } from "../../application/auth/CreateStaffUseCase";
import { DeleteStaffUseCase } from "../../application/staff/DeleteStaffUseCase";
import { ListStaffUseCase } from "../../application/staff/ListStaffUseCase";
import { UpdateStaffUseCase } from "../../application/staff/UpdateStaffUseCase";
import { StaffRole } from "../../domain/entities/Staff";
import { AuthenticatedRequest } from "../middlewares/AuthMiddleware";

export class StaffController {
  constructor(
    private readonly listStaffUseCase: ListStaffUseCase,
    private readonly createStaffUseCase: CreateStaffUseCase,
    private readonly updateStaffUseCase: UpdateStaffUseCase,
    private readonly deleteStaffUseCase: DeleteStaffUseCase
  ) {}

  public list = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const search = req.query.search as string | undefined;
    const role = req.query.role as StaffRole | undefined;
    const isActive = req.query.isActive !== undefined ? req.query.isActive === "true" : undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

    const result = await this.listStaffUseCase.execute({
      search,
      role,
      isActive,
      page,
      limit,
    });

    res.json({
      success: true,
      data: result.items.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email.value,
        phone: s.phone || "",
        documentNumber: s.documentNumber?.value || "",
        role: "STAFF",
        staffRole: s.role,
        isActive: s.isActive,
        createdAt: s.createdAt,
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
    const result = await this.createStaffUseCase.execute({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      documentNumber: req.body.documentNumber,
      password: req.body.password,
      role: req.body.role,
    });

    if (result.isFailure) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    const s = result.getValue();
    res.status(201).json({
      success: true,
      data: {
        id: s.id,
        name: s.name,
        email: s.email.value,
        phone: s.phone || "",
        documentNumber: s.documentNumber?.value || "",
        role: "STAFF",
        staffRole: s.role,
      },
    });
  };

  public update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const result = await this.updateStaffUseCase.execute({
      staffId: req.params.id,
      name: req.body.name,
      phone: req.body.phone,
      documentNumber: req.body.documentNumber,
      password: req.body.password,
      role: req.body.role,
      isActive: req.body.isActive,
    });

    if (result.isFailure) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    const s = result.getValue();
    res.json({
      success: true,
      data: {
        id: s.id,
        name: s.name,
        email: s.email.value,
        phone: s.phone || "",
        documentNumber: s.documentNumber?.value || "",
        role: "STAFF",
        staffRole: s.role,
        isActive: s.isActive,
      },
    });
  };

  public delete = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const requesterStaffId = req.user?.userId;
    if (!requesterStaffId) {
      res.status(401).json({ success: false, error: "Authentication required." });
      return;
    }

    const result = await this.deleteStaffUseCase.execute({
      staffId: req.params.id,
      requesterStaffId,
    });

    if (result.isFailure) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.json({ success: true, message: "Staff member deleted successfully." });
  };
}
