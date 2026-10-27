import { Result } from "../../core/Result";
import { ICustomerRepository } from "../../domain/repositories/ICustomerRepository";
import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { IRedemptionCodeRepository } from "../../domain/repositories/IRedemptionCodeRepository";
import { RedemptionToken } from "../../domain/value-objects/RedemptionToken";

export interface ValidateCodeDTO {
  code: string;
  staffId: string;
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
    private readonly productRepo: IProductRepository
  ) {}

  public async execute(dto: ValidateCodeDTO): Promise<Result<ValidationSuccessDTO>> {
    const tokenResult = RedemptionToken.create(dto.code);
    if (tokenResult.isFailure) {
      return Result.fail<ValidationSuccessDTO>(tokenResult.error);
    }

    const redemption = await this.redemptionRepo.findByCode(tokenResult.getValue());
    if (!redemption) {
      return Result.fail<ValidationSuccessDTO>("Redemption code not found.");
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

    return Result.ok<ValidationSuccessDTO>({
      productName: product ? product.name : "Product",
      customerName: customer ? customer.name : "Customer",
      customerDocument: customer ? customer.documentNumber.value : "N/A",
      consumedAt: redemption.consumedAt!,
      status: "CONSUMED",
    });
  }
}
