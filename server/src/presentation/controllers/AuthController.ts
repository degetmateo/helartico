import { Response } from "express";
import { AuthenticateUserUseCase } from "../../application/auth/AuthenticateUserUseCase";
import { CreateStaffUseCase } from "../../application/auth/CreateStaffUseCase";
import { RegisterCustomerUseCase } from "../../application/auth/RegisterCustomerUseCase";
import { ICustomerRepository } from "../../domain/repositories/ICustomerRepository";
import { IStaffRepository } from "../../domain/repositories/IStaffRepository";
import { AuthenticatedRequest } from "../middlewares/AuthMiddleware";

export class AuthController {
  constructor(
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
    private readonly registerCustomerUseCase: RegisterCustomerUseCase,
    private readonly createStaffUseCase: CreateStaffUseCase,
    private readonly customerRepo: ICustomerRepository,
    private readonly staffRepo: IStaffRepository
  ) {}

  public login = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const result = await this.authenticateUserUseCase.execute({ email, password });
    if (result.isFailure) {
      res.status(401).json({ success: false, error: result.error });
      return;
    }
    res.json({ success: true, data: result.getValue() });
  };

  public registerCustomer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const result = await this.registerCustomerUseCase.execute(req.body);
    if (result.isFailure) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }
    const customer = result.getValue();
    res.status(201).json({
      success: true,
      data: {
        id: customer.id,
        name: customer.name,
        email: customer.email.value,
        phone: customer.phone,
        documentNumber: customer.documentNumber.value,
        pointsBalance: customer.pointsBalance.value,
      },
    });
  };

  public createStaff = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const result = await this.createStaffUseCase.execute(req.body);
    if (result.isFailure) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }
    const staff = result.getValue();
    res.status(201).json({
      success: true,
      data: {
        id: staff.id,
        name: staff.name,
        email: staff.email.value,
        phone: staff.phone || "",
        documentNumber: staff.documentNumber?.value || "",
        role: "STAFF",
        staffRole: staff.role,
      },
    });
  };

  public getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Unauthorized." });
      return;
    }

    if (req.user.role === "CUSTOMER") {
      const customer = await this.customerRepo.findById(req.user.userId);
      if (!customer) {
        res.status(404).json({ success: false, error: "Customer not found." });
        return;
      }
      res.json({
        success: true,
        data: {
          id: customer.id,
          name: customer.name,
          email: customer.email.value,
          phone: customer.phone,
          documentNumber: customer.documentNumber.value,
          role: "CUSTOMER",
          pointsBalance: customer.pointsBalance.value,
        },
      });
      return;
    }

    const staff = await this.staffRepo.findById(req.user.userId);
    if (!staff) {
      res.status(404).json({ success: false, error: "Staff not found." });
      return;
    }
    res.json({
      success: true,
      data: {
        id: staff.id,
        name: staff.name,
        email: staff.email.value,
        phone: staff.phone || "",
        documentNumber: staff.documentNumber?.value || "",
        role: "STAFF",
        staffRole: staff.role,
      },
    });
  };
}
