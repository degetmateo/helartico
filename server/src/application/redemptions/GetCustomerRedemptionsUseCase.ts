import { PaginatedResult, PaginationOptions } from "../../core/Pagination";
import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { IRedemptionCodeRepository } from "../../domain/repositories/IRedemptionCodeRepository";

export interface CustomerRedemptionItemDTO {
  id: string;
  code: string;
  productName: string;
  pointsSpent: number;
  status: "ACTIVE" | "CONSUMED" | "EXPIRED";
  expiresAt: Date;
  consumedAt?: Date;
  createdAt: Date;
}

export interface GetCustomerRedemptionsQuery extends PaginationOptions {
  customerId: string;
}

export class GetCustomerRedemptionsUseCase {
  constructor(
    private readonly redemptionRepo: IRedemptionCodeRepository,
    private readonly productRepo: IProductRepository
  ) {}

  public async execute(
    queryOrCustomerId: string | GetCustomerRedemptionsQuery
  ): Promise<PaginatedResult<CustomerRedemptionItemDTO>> {
    const customerId =
      typeof queryOrCustomerId === "string" ? queryOrCustomerId : queryOrCustomerId.customerId;
    const page = typeof queryOrCustomerId === "object" ? queryOrCustomerId.page : 1;
    const limit = typeof queryOrCustomerId === "object" ? queryOrCustomerId.limit : 10;

    const redemptionsResult = await this.redemptionRepo.findByCustomerId(customerId, {
      page,
      limit,
    });

    const productsResult = await this.productRepo.findAll({ limit: 100 });
    const productMap = new Map(productsResult.items.map((p) => [p.id!, p.name]));

    const items: CustomerRedemptionItemDTO[] = redemptionsResult.items.map((item) => {
      let status = item.status;
      if (status === "ACTIVE" && item.isExpired()) {
        status = "EXPIRED";
      }

      return {
        id: item.id!,
        code: item.code.value,
        productName: productMap.get(item.productId) || "Product",
        pointsSpent: item.pointsSpent.value,
        status,
        expiresAt: item.expiresAt,
        consumedAt: item.consumedAt,
        createdAt: item.createdAt,
      };
    });

    return {
      ...redemptionsResult,
      items,
    };
  }
}

