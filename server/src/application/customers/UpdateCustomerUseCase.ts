import { Result } from "../../core/Result";
import { Customer } from "../../domain/entities/Customer";
import { ICustomerRepository } from "../../domain/repositories/ICustomerRepository";
import { DocumentNumber } from "../../domain/value-objects/DocumentNumber";
import { Email } from "../../domain/value-objects/Email";
import { BcryptPasswordHasher } from "../../infrastructure/security/BcryptPasswordHasher";

export interface UpdateCustomerDTO {
  customerId: string;
  name?: string;
  phone?: string;
  email?: string;
  documentNumber?: string;
  password?: string;
}

export class UpdateCustomerUseCase {
  constructor(private readonly customerRepo: ICustomerRepository) {}

  public async execute(dto: UpdateCustomerDTO): Promise<Result<Customer>> {
    const customer = await this.customerRepo.findById(dto.customerId);
    if (!customer) {
      return Result.fail<Customer>("Customer not found.");
    }

    let emailVal: Email | undefined;
    if (dto.email && dto.email.trim().length > 0) {
      const emailRes = Email.create(dto.email);
      if (emailRes.isFailure) return Result.fail<Customer>(emailRes.error);
      const existing = await this.customerRepo.findByEmail(emailRes.getValue());
      if (existing && existing.id !== customer.id) {
        return Result.fail<Customer>("Email is already in use by another customer.");
      }
      emailVal = emailRes.getValue();
    }

    let docVal: DocumentNumber | undefined;
    if (dto.documentNumber && dto.documentNumber.trim().length > 0) {
      const docRes = DocumentNumber.create(dto.documentNumber);
      if (docRes.isFailure) return Result.fail<Customer>(docRes.error);
      const existing = await this.customerRepo.findByDocumentNumber(docRes.getValue());
      if (existing && existing.id !== customer.id) {
        return Result.fail<Customer>("Document number is already in use by another customer.");
      }
      docVal = docRes.getValue();
    }

    const updatedName = dto.name !== undefined ? dto.name.trim() : customer.name;
    if (updatedName.length < 2) {
      return Result.fail<Customer>("Name must have at least 2 characters.");
    }

    customer.updateProfile(
      updatedName,
      dto.phone !== undefined ? dto.phone : customer.phone,
      emailVal,
      docVal
    );

    if (dto.password && dto.password.trim().length > 0) {
      if (dto.password.length < 6) {
        return Result.fail<Customer>("Password must be at least 6 characters long.");
      }
      const newHash = await BcryptPasswordHasher.hash(dto.password);
      customer.changePassword(newHash);
    }

    const updated = await this.customerRepo.save(customer);
    return Result.ok<Customer>(updated);
  }
}
