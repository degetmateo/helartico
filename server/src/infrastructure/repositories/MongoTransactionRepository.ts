import { Types } from "mongoose";
import { PointsTransaction } from "../../domain/entities/PointsTransaction";
import { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import { ITransactionDocument, TransactionModel } from "../database/schemas/TransactionSchema";

export class MongoTransactionRepository implements ITransactionRepository {
  public async save(tx: PointsTransaction): Promise<PointsTransaction> {
    const docData: Partial<ITransactionDocument> = {
      customerId: new Types.ObjectId(tx.customerId),
      amount: tx.amount,
      type: tx.type,
      performedByStaffId: tx.performedByStaffId
        ? new Types.ObjectId(tx.performedByStaffId)
        : undefined,
      note: tx.note,
      redemptionCodeId: tx.redemptionCodeId
        ? new Types.ObjectId(tx.redemptionCodeId)
        : undefined,
    };

    const created = await TransactionModel.create(docData);
    return new PointsTransaction({
      id: created._id.toString(),
      customerId: created.customerId.toString(),
      amount: created.amount,
      type: created.type,
      performedByStaffId: created.performedByStaffId?.toString(),
      note: created.note,
      redemptionCodeId: created.redemptionCodeId?.toString(),
      createdAt: created.createdAt,
    });
  }

  public async findByCustomerId(customerId: string): Promise<PointsTransaction[]> {
    const docs = await TransactionModel.find({ customerId: new Types.ObjectId(customerId) })
      .sort({ createdAt: -1 })
      .limit(50);

    return docs.map(
      (doc) =>
        new PointsTransaction({
          id: doc._id.toString(),
          customerId: doc.customerId.toString(),
          amount: doc.amount,
          type: doc.type,
          performedByStaffId: doc.performedByStaffId?.toString(),
          note: doc.note,
          redemptionCodeId: doc.redemptionCodeId?.toString(),
          createdAt: doc.createdAt,
        })
    );
  }
}
