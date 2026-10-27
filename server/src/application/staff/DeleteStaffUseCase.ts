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
      return Result.fail<void>("You cannot delete your own administrator account.");
    }

    const staff = await this.staffRepo.findById(dto.staffId);
    if (!staff) {
      return Result.fail<void>("Staff member not found.");
    }

    await this.staffRepo.delete(dto.staffId);
    return Result.ok<void>();
  }
}
