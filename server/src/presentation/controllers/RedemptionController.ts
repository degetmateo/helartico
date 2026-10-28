import { Response } from "express";
import { GetCustomerRedemptionsUseCase } from "../../application/redemptions/GetCustomerRedemptionsUseCase";
import { RedeemProductUseCase } from "../../application/redemptions/RedeemProductUseCase";
import { ValidateCodeUseCase } from "../../application/redemptions/ValidateCodeUseCase";
import { AuthenticatedRequest } from "../middlewares/AuthMiddleware";

export class RedemptionController {
  constructor(
    private readonly redeemProductUseCase: RedeemProductUseCase,
    private readonly validateCodeUseCase: ValidateCodeUseCase,
    private readonly getCustomerRedemptionsUseCase: GetCustomerRedemptionsUseCase
  ) {}

  public redeem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const customerId = req.user?.userId;
    if (!customerId) {
      res.status(401).json({ success: false, error: "Autenticación requerida." });
      return;
    }

    const { productId } = req.body;
    const result = await this.redeemProductUseCase.execute({ customerId, productId });
    if (result.isFailure) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.status(201).json({ success: true, data: result.getValue() });
  };

  public validate = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const staffId = req.user?.userId;
    if (!staffId) {
      res.status(401).json({ success: false, error: "Autenticación de personal requerida." });
      return;
    }

    const { code } = req.body;
    const result = await this.validateCodeUseCase.execute({
      code,
      staffId,
      staffName: req.user?.name || req.user?.email || "Personal en mostrador",
    });
    if (result.isFailure) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.json({ success: true, data: result.getValue() });
  };

  public getMyRedemptions = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const customerId = req.user?.userId;
    if (!customerId) {
      res.status(401).json({ success: false, error: "Autenticación requerida." });
      return;
    }

    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

    const result = await this.getCustomerRedemptionsUseCase.execute({
      customerId,
      page,
      limit,
    });

    res.json({
      success: true,
      data: result.items,
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
