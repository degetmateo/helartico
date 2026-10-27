import { PointsTransaction } from "../entities/PointsTransaction";

export interface ITransactionRepository {
  save(transaction: PointsTransaction): Promise<PointsTransaction>;
  findByCustomerId(customerId: string): Promise<PointsTransaction[]>;
}
