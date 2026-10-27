import { Result } from "../../core/Result";
import { Customer } from "../../domain/entities/Customer";
import { PointsTransaction } from "../../domain/entities/PointsTransaction";
import { ICustomerRepository } from "../../domain/repositories/ICustomerRepository";
import { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import { Points } from "../../domain/value-objects/Points";

export interface AddPointsDTO {
  customerId: string;
  pointsToAdd: number;
  staffId: string;
  note?: string;
}

export class AddPointsUseCase {
  constructor(
    private readonly customerRepo: ICustomerRepository,
    private readonly transactionRepo: ITransactionRepository
  ) {}

  public async execute(dto: AddPointsDTO): Promise<Result<Customer>> {
    const pointsResult = Points.create(dto.pointsToAdd);
    if (pointsResult.isFailure) {
      return Result.fail<Customer>(pointsResult.error);
    }
    const points = pointsResult.getValue();

    if (points.value <= 0) {
      return Result.fail<Customer>("Points to add must be greater than zero.");
    }

    const customer = await this.customerRepo.findById(dto.customerId);
    if (!customer || !customer.isActive) {
      return Result.fail<Customer>("Customer not found or inactive.");
    }

    customer.addPoints(points);
    const updatedCustomer = await this.customerRepo.save(customer);

    const transaction = new PointsTransaction({
      customerId: dto.customerId,
      amount: points.value,
      type: "PURCHASE_REWARD",
      performedByStaffId: dto.staffId,
      note: dto.note || "Points added for purchase",
    });

    await this.transactionRepo.save(transaction);
    return Result.ok<Customer>(updatedCustomer);
  }
}
