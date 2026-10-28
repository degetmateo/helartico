import { Result } from "../../core/Result";
import { ICustomerRepository } from "../../domain/repositories/ICustomerRepository";
import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { IRedemptionCodeRepository } from "../../domain/repositories/IRedemptionCodeRepository";
import { RedemptionToken } from "../../domain/value-objects/RedemptionToken";
import { AuditLogService } from "../../infrastructure/services/AuditLogService";

export interface ValidateCodeDTO {
  code: string;
  staffId: string;
  staffName?: string;
}

export interface ValidationSuccessDTO {
  productName: string;
  customerName: string;
  customerDocument: string;
  consumedAt: Date;
  status: "CONSUMED";
}

export class ValidateCodeUseCase {
  constructor(
    private readonly redemptionRepo: IRedemptionCodeRepository,
    private readonly customerRepo: ICustomerRepository,
    private readonly productRepo: IProductRepository,
    private readonly auditLogService?: AuditLogService
  ) {}

  public async execute(dto: ValidateCodeDTO): Promise<Result<ValidationSuccessDTO>> {
    const tokenResult = RedemptionToken.create(dto.code);
    if (tokenResult.isFailure) {
      return Result.fail<ValidationSuccessDTO>(tokenResult.error);
    }

    const redemption = await this.redemptionRepo.findByCode(tokenResult.getValue());
    if (!redemption) {
      return Result.fail<ValidationSuccessDTO>("Código de canje no encontrado.");
    }

    const consumeResult = redemption.consume(dto.staffId);
    if (consumeResult.isFailure) {
      // Persist expired state if it just transitioned
      await this.redemptionRepo.save(redemption);
      return Result.fail<ValidationSuccessDTO>(consumeResult.error);
    }

    await this.redemptionRepo.save(redemption);

    const [customer, product] = await Promise.all([
      this.customerRepo.findById(redemption.customerId),
      this.productRepo.findById(redemption.productId),
    ]);

    const prodName = product ? product.name : "Producto";
    const custName = customer ? customer.name : "Cliente";
    const staffLabel = dto.staffName || "Personal en mostrador";

    if (this.auditLogService) {
      await this.auditLogService.log({
        action: "REDEMPTION_VALIDATE",
        category: "REDEMPTION",
        actorId: dto.staffId,
        actorName: staffLabel,
        actorRole: "STAFF",
        targetId: redemption.id,
        targetName: prodName,
        targetType: "REDEMPTION_CODE",
        description: `El personal ${staffLabel} validó y entregó "${prodName}" al cliente ${custName} (Código: ${redemption.code.value}).`,
        details: {
          code: redemption.code.value,
          productName: prodName,
          customerName: custName,
          customerId: customer?.id,
          consumedAt: redemption.consumedAt,
        },
      });
    }

    return Result.ok<ValidationSuccessDTO>({
      productName: prodName,
      customerName: custName,
      customerDocument: customer ? customer.documentNumber.value : "N/A",
      consumedAt: redemption.consumedAt!,
      status: "CONSUMED",
    });
  }
}
