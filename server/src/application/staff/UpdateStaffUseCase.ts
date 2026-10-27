import { Result } from "../../core/Result";
import { Staff, StaffRole } from "../../domain/entities/Staff";
import { IStaffRepository } from "../../domain/repositories/IStaffRepository";
import { DocumentNumber } from "../../domain/value-objects/DocumentNumber";
import { BcryptPasswordHasher } from "../../infrastructure/security/BcryptPasswordHasher";

export interface UpdateStaffDTO {
  staffId: string;
  name?: string;
  phone?: string;
  documentNumber?: string;
  password?: string;
  role?: StaffRole;
  isActive?: boolean;
}

export class UpdateStaffUseCase {
  constructor(private readonly staffRepo: IStaffRepository) {}

  public async execute(dto: UpdateStaffDTO): Promise<Result<Staff>> {
    const staff = await this.staffRepo.findById(dto.staffId);
    if (!staff) {
      return Result.fail<Staff>("Staff member not found.");
    }

    let docNumber: DocumentNumber | undefined = staff.documentNumber;
    if (dto.documentNumber !== undefined) {
      if (dto.documentNumber.trim().length > 0) {
        const docRes = DocumentNumber.create(dto.documentNumber);
        if (docRes.isFailure) return Result.fail<Staff>(docRes.error);
        const existing = await this.staffRepo.findByDocumentNumber(docRes.getValue());
        if (existing && existing.id !== staff.id) {
          return Result.fail<Staff>("Document number is already in use by another staff member.");
        }
        docNumber = docRes.getValue();
      } else {
        docNumber = undefined;
      }
    }

    const updatedName = dto.name !== undefined ? dto.name.trim() : staff.name;
    if (updatedName.length < 2) {
      return Result.fail<Staff>("Name must have at least 2 characters.");
    }

    staff.updateProfile(
      updatedName,
      dto.phone !== undefined ? dto.phone : staff.phone,
      docNumber,
      dto.role !== undefined ? dto.role : staff.role
    );

    if (dto.isActive !== undefined) {
      if (dto.isActive) {
        staff.activate();
      } else {
        staff.deactivate();
      }
    }

    if (dto.password && dto.password.trim().length > 0) {
      if (dto.password.length < 6) {
        return Result.fail<Staff>("Password must be at least 6 characters long.");
      }
      const newHash = await BcryptPasswordHasher.hash(dto.password);
      staff.changePassword(newHash);
    }

    const saved = await this.staffRepo.save(staff);
    return Result.ok<Staff>(saved);
  }
}
