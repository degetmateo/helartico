import { Response } from "express";
import { RegisterCustomerUseCase } from "../../application/auth/RegisterCustomerUseCase";
import { AddPointsUseCase } from "../../application/customers/AddPointsUseCase";
import { GetCustomerByIdUseCase } from "../../application/customers/GetCustomerByIdUseCase";
import { ListCustomersUseCase } from "../../application/customers/ListCustomersUseCase";
import { UpdateCustomerUseCase } from "../../application/customers/UpdateCustomerUseCase";
import { AuthenticatedRequest } from "../middlewares/AuthMiddleware";

export class CustomerController {
  constructor(
    private readonly listCustomersUseCase: ListCustomersUseCase,
    private readonly getCustomerByIdUseCase: GetCustomerByIdUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
    private readonly addPointsUseCase: AddPointsUseCase,
    private readonly registerCustomerUseCase: RegisterCustomerUseCase
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
      res.status(401).json({ success: false, error: "Staff authentication required." });
      return;
    }
    const result = await this.addPointsUseCase.execute({
      customerId: req.params.id,
      pointsToAdd: Number(req.body.points),
      staffId,
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
}
