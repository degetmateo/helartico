import { Types } from "mongoose";
import { RedemptionCode } from "../../../domain/entities/RedemptionCode";
import { Points } from "../../../domain/value-objects/Points";
import { RedemptionToken } from "../../../domain/value-objects/RedemptionToken";
import { IRedemptionDocument } from "../schemas/RedemptionSchema";

export class RedemptionCodeMapper {
  public static toDomain(doc: IRedemptionDocument): RedemptionCode {
    const tokenResult = RedemptionToken.create(doc.code);
    const pointsResult = Points.create(doc.pointsSpent);

    if (tokenResult.isFailure || pointsResult.isFailure) {
      throw new Error(`Corrupt redemption code document: ${doc._id}`);
    }

    return new RedemptionCode({
      id: doc._id.toString(),
      code: tokenResult.getValue(),
      customerId: doc.customerId.toString(),
      productId: doc.productId.toString(),
      pointsSpent: pointsResult.getValue(),
      status: doc.status,
      expiresAt: doc.expiresAt,
      consumedAt: doc.consumedAt,
      consumedByStaffId: doc.consumedByStaffId?.toString(),
      createdAt: doc.createdAt,
    });
  }

  public static toPersistence(entity: RedemptionCode): Partial<IRedemptionDocument> {
    return {
      code: entity.code.value,
      customerId: new Types.ObjectId(entity.customerId),
      productId: new Types.ObjectId(entity.productId),
      pointsSpent: entity.pointsSpent.value,
      status: entity.status,
      expiresAt: entity.expiresAt,
      consumedAt: entity.consumedAt,
      consumedByStaffId: entity.consumedByStaffId
        ? new Types.ObjectId(entity.consumedByStaffId)
        : undefined,
    };
  }
}
