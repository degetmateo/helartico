import { PaginatedResult, PaginationOptions } from "../../core/Pagination";
import { RedemptionCode } from "../entities/RedemptionCode";
import { RedemptionToken } from "../value-objects/RedemptionToken";

export interface IRedemptionCodeRepository {
  findById(id: string): Promise<RedemptionCode | null>;
  findByCode(code: RedemptionToken): Promise<RedemptionCode | null>;
  findByCustomerId(
    customerId: string,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<RedemptionCode>>;
  save(redemptionCode: RedemptionCode): Promise<RedemptionCode>;
}

