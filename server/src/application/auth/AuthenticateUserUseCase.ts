import { Result } from "../../core/Result";
import { ICustomerRepository } from "../../domain/repositories/ICustomerRepository";
import { IStaffRepository } from "../../domain/repositories/IStaffRepository";
import { Email } from "../../domain/value-objects/Email";
import { BcryptPasswordHasher } from "../../infrastructure/security/BcryptPasswordHasher";
import { JwtTokenService } from "../../infrastructure/security/JwtTokenService";

import { StaffRole } from "../../domain/entities/Staff";

export interface AuthenticateUserDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    documentNumber: string;
    role: "CUSTOMER" | "STAFF";
    staffRole?: StaffRole;
    pointsBalance?: number;
  };
}

export class AuthenticateUserUseCase {
  constructor(
    private readonly customerRepo: ICustomerRepository,
    private readonly staffRepo: IStaffRepository
  ) {}

  public async execute(dto: AuthenticateUserDTO): Promise<Result<AuthResponseDTO>> {
    const emailResult = Email.create(dto.email);
    if (emailResult.isFailure) {
      return Result.fail<AuthResponseDTO>(emailResult.error);
    }
    const email = emailResult.getValue();

    // 1. Check if user is staff
    const staff = await this.staffRepo.findByEmail(email);
    if (staff && staff.isActive) {
      const match = await BcryptPasswordHasher.compare(dto.password, staff.passwordHash);
      if (match) {
        const token = JwtTokenService.generateToken({
          userId: staff.id!,
          role: "STAFF",
          staffRole: staff.role,
          email: staff.email.value,
        });
        return Result.ok<AuthResponseDTO>({
          token,
          user: {
            id: staff.id!,
            name: staff.name,
            email: staff.email.value,
            phone: staff.phone || "",
            documentNumber: staff.documentNumber?.value || "",
            role: "STAFF",
            staffRole: staff.role,
          },
        });
      }
    }

    // 2. Check if user is customer
    const customer = await this.customerRepo.findByEmail(email);
    if (customer && customer.isActive) {
      const match = await BcryptPasswordHasher.compare(dto.password, customer.passwordHash);
      if (match) {
        const token = JwtTokenService.generateToken({
          userId: customer.id!,
          role: "CUSTOMER",
          email: customer.email.value,
        });
        return Result.ok<AuthResponseDTO>({
          token,
          user: {
            id: customer.id!,
            name: customer.name,
            email: customer.email.value,
            phone: customer.phone,
            documentNumber: customer.documentNumber.value,
            role: "CUSTOMER",
            pointsBalance: customer.pointsBalance.value,
          },
        });
      }
    }

    return Result.fail<AuthResponseDTO>("Invalid email or password.");
  }
}
