import { EnvironmentConfig } from "../../config/EnvironmentConfig";
import { Result } from "../../core/Result";
import { PointsTransaction } from "../../domain/entities/PointsTransaction";
import { RedemptionCode } from "../../domain/entities/RedemptionCode";
import { ICustomerRepository } from "../../domain/repositories/ICustomerRepository";
import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { IRedemptionCodeRepository } from "../../domain/repositories/IRedemptionCodeRepository";
import { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import { RedemptionToken } from "../../domain/value-objects/RedemptionToken";
import { AuditLogService } from "../../infrastructure/services/AuditLogService";

export interface RedeemProductDTO {
  customerId: string;
  productId: string;
}

export interface RedemptionResultDTO {
  code: string;
  productName: string;
  pointsSpent: number;
  expiresAt: Date;
  status: string;
}

export class RedeemProductUseCase {
  constructor(
    private readonly customerRepo: ICustomerRepository,
    private readonly productRepo: IProductRepository,
    private readonly redemptionRepo: IRedemptionCodeRepository,
    private readonly transactionRepo: ITransactionRepository,
    private readonly auditLogService?: AuditLogService
  ) {}

  public async execute(dto: RedeemProductDTO): Promise<Result<RedemptionResultDTO>> {
    const customer = await this.customerRepo.findById(dto.customerId);
    if (!customer || !customer.isActive) {
      return Result.fail<RedemptionResultDTO>("Cliente no encontrado o inactivo.");
    }

    const product = await this.productRepo.findById(dto.productId);
    if (!product || !product.isActive) {
      return Result.fail<RedemptionResultDTO>("El producto seleccionado no está disponible para canje.");
    }

    if (!customer.pointsBalance.hasEnough(product.pointsRequired)) {
      return Result.fail<RedemptionResultDTO>(
        `Puntos insuficientes para este canje. Necesarios: ${product.pointsRequired.value}, Disponibles: ${customer.pointsBalance.value}`
      );
    }

    const deductResult = customer.deductPoints(product.pointsRequired);
    if (deductResult.isFailure) {
      return Result.fail<RedemptionResultDTO>(deductResult.error);
    }

    const token = RedemptionToken.generate();
    const expirationMinutes = EnvironmentConfig.redemptionCodeExpirationMinutes;
    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);

    const redemptionCode = new RedemptionCode({
      code: token,
      customerId: customer.id!,
      productId: product.id!,
      pointsSpent: product.pointsRequired,
      status: "ACTIVE",
      expiresAt,
    });

    const savedCode = await this.redemptionRepo.save(redemptionCode);
    await this.customerRepo.save(customer);

    const transaction = new PointsTransaction({
      customerId: customer.id!,
      amount: -product.pointsRequired.value,
      type: "REDEMPTION",
      note: `Canje de producto: ${product.name}`,
      redemptionCodeId: savedCode.id,
    });
    await this.transactionRepo.save(transaction);

    if (this.auditLogService) {
      await this.auditLogService.log({
        action: "REDEMPTION_CREATE",
        category: "REDEMPTION",
        actorId: customer.id,
        actorName: customer.name,
        actorEmail: customer.email.value,
        actorRole: "CUSTOMER",
        targetId: product.id,
        targetName: product.name,
        targetType: "PRODUCT",
        description: `El cliente ${customer.name} canjeó el producto "${product.name}" por ${product.pointsRequired.value} puntos (Código: ${savedCode.code.value}).`,
        details: {
          code: savedCode.code.value,
          pointsSpent: product.pointsRequired.value,
          expiresAt: savedCode.expiresAt,
        },
      });
    }

    return Result.ok<RedemptionResultDTO>({
      code: savedCode.code.value,
      productName: product.name,
      pointsSpent: product.pointsRequired.value,
      expiresAt: savedCode.expiresAt,
      status: savedCode.status,
    });
  }
}
