import { Types } from "mongoose";
import { PaginatedResult, PaginationHelper, PaginationOptions } from "../../core/Pagination";
import { RedemptionCode } from "../../domain/entities/RedemptionCode";
import { IRedemptionCodeRepository } from "../../domain/repositories/IRedemptionCodeRepository";
import { RedemptionToken } from "../../domain/value-objects/RedemptionToken";
import { RedemptionCodeMapper } from "../database/mappers/RedemptionCodeMapper";
import { RedemptionModel } from "../database/schemas/RedemptionSchema";

export class MongoRedemptionCodeRepository implements IRedemptionCodeRepository {
  public async findById(id: string): Promise<RedemptionCode | null> {
    const doc = await RedemptionModel.findById(id);
    return doc ? RedemptionCodeMapper.toDomain(doc) : null;
  }

  public async findByCode(code: RedemptionToken): Promise<RedemptionCode | null> {
    const doc = await RedemptionModel.findOne({ code: code.value });
    return doc ? RedemptionCodeMapper.toDomain(doc) : null;
  }

  public async findByCustomerId(
    customerId: string,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<RedemptionCode>> {
    const { page, limit, skip } = PaginationHelper.normalize(pagination, 10);
    const query = { customerId: new Types.ObjectId(customerId) };

    const [total, docs] = await Promise.all([
      RedemptionModel.countDocuments(query),
      RedemptionModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    const items = docs.map((doc) => RedemptionCodeMapper.toDomain(doc));
    return PaginationHelper.createPaginatedResult(items, total, page, limit);
  }

  public async save(redemptionCode: RedemptionCode): Promise<RedemptionCode> {
    const persistenceData = RedemptionCodeMapper.toPersistence(redemptionCode);
    if (redemptionCode.id) {
      const updated = await RedemptionModel.findByIdAndUpdate(
        redemptionCode.id,
        { $set: persistenceData },
        { new: true }
      );
      if (!updated) throw new Error(`Redemption code ${redemptionCode.id} not found.`);
      return RedemptionCodeMapper.toDomain(updated);
    }

    const created = await RedemptionModel.create(persistenceData);
    return RedemptionCodeMapper.toDomain(created);
  }
}
