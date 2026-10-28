import { Result } from "../../core/Result";
import { Customer } from "../../domain/entities/Customer";
import { ICustomerRepository } from "../../domain/repositories/ICustomerRepository";
import { DocumentNumber } from "../../domain/value-objects/DocumentNumber";
import { Email } from "../../domain/value-objects/Email";
import { Points } from "../../domain/value-objects/Points";
import { BcryptPasswordHasher } from "../../infrastructure/security/BcryptPasswordHasher";

export interface RegisterCustomerDTO {
  name: string;
  email: string;
  phone?: string;
  documentNumber: string;
  password: string;
  initialPoints?: number;
}

export class RegisterCustomerUseCase {
  constructor(private readonly customerRepo: ICustomerRepository) {}

  public async execute(dto: RegisterCustomerDTO): Promise<Result<Customer>> {
    if (!dto.name || dto.name.trim().length < 2) {
      return Result.fail<Customer>("El nombre debe tener al menos 2 caracteres.");
    }
    if (!dto.password || dto.password.length < 6) {
      return Result.fail<Customer>("La contraseña debe tener al menos 6 caracteres.");
    }

    const emailResult = Email.create(dto.email);
    if (emailResult.isFailure) return Result.fail<Customer>(emailResult.error);
    const email = emailResult.getValue();

    const docResult = DocumentNumber.create(dto.documentNumber);
    if (docResult.isFailure) return Result.fail<Customer>(docResult.error);
    const docNumber = docResult.getValue();

    const existingByEmail = await this.customerRepo.findByEmail(email);
    if (existingByEmail) {
      return Result.fail<Customer>("Ya existe un cliente registrado con este correo electrónico.");
    }

    const existingByDoc = await this.customerRepo.findByDocumentNumber(docNumber);
    if (existingByDoc) {
      return Result.fail<Customer>("Ya existe un cliente registrado con este número de documento.");
    }

    const passwordHash = await BcryptPasswordHasher.hash(dto.password);
    const initialPoints = Points.create(dto.initialPoints ?? 0).getValue();

    const newCustomer = new Customer({
      name: dto.name,
      email,
      phone: (dto.phone ?? "").trim(),
      documentNumber: docNumber,
      passwordHash,
      pointsBalance: initialPoints,
      isActive: true,
    });

    const saved = await this.customerRepo.save(newCustomer);
    return Result.ok<Customer>(saved);
  }
}
