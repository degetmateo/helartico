import { Result } from "../../core/Result";
import { Customer } from "../../domain/entities/Customer";
import { PointsTransaction } from "../../domain/entities/PointsTransaction";
import { ICustomerRepository } from "../../domain/repositories/ICustomerRepository";
import { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import { Points } from "../../domain/value-objects/Points";
import { AuditLogService } from "../../infrastructure/services/AuditLogService";

export interface SetCustomerPointsDTO {
  customerId: string;
  targetPoints: number;
  staffId: string;
  staffName?: string;
  staffRole?: string;
  reason?: string;
}

export class SetCustomerPointsUseCase {
  constructor(
    private readonly customerRepo: ICustomerRepository,
    private readonly transactionRepo: ITransactionRepository,
    private readonly auditLogService?: AuditLogService
  ) {}

  public async execute(dto: SetCustomerPointsDTO): Promise<Result<Customer>> {
    const pointsResult = Points.create(dto.targetPoints);
    if (pointsResult.isFailure) {
      return Result.fail<Customer>(pointsResult.error);
    }
    const targetPointsVO = pointsResult.getValue();

    const customer = await this.customerRepo.findById(dto.customerId);
    if (!customer || !customer.isActive) {
      return Result.fail<Customer>("Cliente no encontrado o inactivo.");
    }

    const previousPoints = customer.pointsBalance.value;
    const diff = targetPointsVO.value - previousPoints;

    customer.setPoints(targetPointsVO);
    const updatedCustomer = await this.customerRepo.save(customer);

    const defaultNote = `Ajuste manual de saldo de puntos (de ${previousPoints} a ${targetPointsVO.value} pts)`;
    const transaction = new PointsTransaction({
      customerId: customer.id!,
      amount: diff,
      type: "MANUAL_ADJUSTMENT",
      performedByStaffId: dto.staffId,
      note: dto.reason?.trim() ? dto.reason.trim() : defaultNote,
    });

    await this.transactionRepo.save(transaction);

    if (this.auditLogService) {
      const staffLabel = dto.staffName || "Personal";
      const reasonLabel = dto.reason?.trim() ? ` (Motivo: ${dto.reason.trim()})` : "";
      await this.auditLogService.log({
        action: "POINTS_SET",
        category: "POINTS",
        actorId: dto.staffId,
        actorName: staffLabel,
        actorRole: dto.staffRole || "STAFF",
        targetId: customer.id,
        targetName: customer.name,
        targetType: "CUSTOMER",
        description: `El personal ${staffLabel} estableció el saldo de puntos de ${customer.name} de ${previousPoints} a ${targetPointsVO.value} pts (${diff >= 0 ? `+${diff}` : `${diff}`} pts)${reasonLabel}.`,
        details: {
          previousPoints,
          newBalance: targetPointsVO.value,
          difference: diff,
          reason: dto.reason,
        },
      });
    }

    return Result.ok<Customer>(updatedCustomer);
  }
}
