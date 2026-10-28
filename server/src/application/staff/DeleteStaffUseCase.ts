import { Result } from "../../core/Result";
import { IStaffRepository } from "../../domain/repositories/IStaffRepository";

export interface DeleteStaffDTO {
  staffId: string;
  requesterStaffId: string;
}

export class DeleteStaffUseCase {
  constructor(private readonly staffRepo: IStaffRepository) {}

  public async execute(dto: DeleteStaffDTO): Promise<Result<void>> {
    if (dto.staffId === dto.requesterStaffId) {
      return Result.fail<void>("No puedes eliminar tu propia cuenta de administrador mientras estés en sesión.");
    }

    const staff = await this.staffRepo.findById(dto.staffId);
    if (!staff) {
      return Result.fail<void>("Miembro del personal no encontrado.");
    }

    await this.staffRepo.delete(dto.staffId);
    return Result.ok<void>();
  }
}
