import { Result } from "../../core/Result";
import { Customer } from "../../domain/entities/Customer";
import { PointsTransaction } from "../../domain/entities/PointsTransaction";
import { ICustomerRepository } from "../../domain/repositories/ICustomerRepository";
import { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import { Points } from "../../domain/value-objects/Points";
import { AuditLogService } from "../../infrastructure/services/AuditLogService";

export interface AddPointsDTO {
  customerId: string;
  pointsToAdd: number;
  staffId: string;
  staffName?: string;
  staffRole?: string;
  note?: string;
}

export class AddPointsUseCase {
  constructor(
    private readonly customerRepo: ICustomerRepository,
    private readonly transactionRepo: ITransactionRepository,
    private readonly auditLogService?: AuditLogService
  ) {}

  public async execute(dto: AddPointsDTO): Promise<Result<Customer>> {
    const pointsResult = Points.create(dto.pointsToAdd);
    if (pointsResult.isFailure) {
      return Result.fail<Customer>(pointsResult.error);
    }
    const points = pointsResult.getValue();

    if (points.value <= 0) {
      return Result.fail<Customer>("Los puntos a acreditar deben ser mayores a cero.");
    }

    const customer = await this.customerRepo.findById(dto.customerId);
    if (!customer || !customer.isActive) {
      return Result.fail<Customer>("Cliente no encontrado o inactivo.");
    }

    customer.addPoints(points);
    const updatedCustomer = await this.customerRepo.save(customer);

    const transaction = new PointsTransaction({
      customerId: dto.customerId,
      amount: points.value,
      type: "PURCHASE_REWARD",
      performedByStaffId: dto.staffId,
      note: dto.note || "Puntos acreditados por compra presencial",
    });

    await this.transactionRepo.save(transaction);

    if (this.auditLogService) {
      const staffLabel = dto.staffName || "Personal";
      const noteLabel = dto.note ? ` (Motivo: ${dto.note})` : "";
      await this.auditLogService.log({
        action: "POINTS_ADD",
        category: "POINTS",
        actorId: dto.staffId,
        actorName: staffLabel,
        actorRole: dto.staffRole || "STAFF",
        targetId: customer.id,
        targetName: customer.name,
        targetType: "CUSTOMER",
        description: `El personal ${staffLabel} acreditó ${points.value} puntos al cliente ${customer.name}${noteLabel}.`,
        details: {
          pointsAdded: points.value,
          newBalance: updatedCustomer.pointsBalance.value,
          note: dto.note,
        },
      });
    }

    return Result.ok<Customer>(updatedCustomer);
  }
}
