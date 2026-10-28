import { Result } from "../../core/Result";
import { Staff, StaffRole } from "../../domain/entities/Staff";
import { IStaffRepository } from "../../domain/repositories/IStaffRepository";
import { DocumentNumber } from "../../domain/value-objects/DocumentNumber";
import { Email } from "../../domain/value-objects/Email";
import { BcryptPasswordHasher } from "../../infrastructure/security/BcryptPasswordHasher";

export interface CreateStaffDTO {
  name: string;
  email: string;
  phone?: string;
  documentNumber?: string;
  password: string;
  role?: StaffRole;
}

export class CreateStaffUseCase {
  constructor(private readonly staffRepo: IStaffRepository) {}

  public async execute(dto: CreateStaffDTO): Promise<Result<Staff>> {
    if (!dto.name || dto.name.trim().length < 2) {
      return Result.fail<Staff>("El nombre del personal debe tener al menos 2 caracteres.");
    }
    if (!dto.password || dto.password.length < 6) {
      return Result.fail<Staff>("La contraseña debe tener al menos 6 caracteres.");
    }

    const emailResult = Email.create(dto.email);
    if (emailResult.isFailure) return Result.fail<Staff>(emailResult.error);
    const email = emailResult.getValue();

    const existingByEmail = await this.staffRepo.findByEmail(email);
    if (existingByEmail) {
      return Result.fail<Staff>("Ya existe un miembro del personal registrado con este correo electrónico.");
    }

    let docNumber: DocumentNumber | undefined;
    if (dto.documentNumber && dto.documentNumber.trim().length > 0) {
      const docResult = DocumentNumber.create(dto.documentNumber);
      if (docResult.isFailure) return Result.fail<Staff>(docResult.error);
      docNumber = docResult.getValue();

      const existingByDoc = await this.staffRepo.findByDocumentNumber(docNumber);
      if (existingByDoc) {
        return Result.fail<Staff>("Ya existe un miembro del personal registrado con este número de documento.");
      }
    }

    const passwordHash = await BcryptPasswordHasher.hash(dto.password);

    const newStaff = new Staff({
      name: dto.name,
      email,
      phone: dto.phone,
      documentNumber: docNumber,
      passwordHash,
      role: dto.role ?? "EMPLOYEE",
      isActive: true,
    });

    const saved = await this.staffRepo.save(newStaff);
    return Result.ok<Staff>(saved);
  }
}
