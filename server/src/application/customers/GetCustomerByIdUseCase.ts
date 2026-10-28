import { Result } from "../../core/Result";
import { Customer } from "../../domain/entities/Customer";
import { ICustomerRepository } from "../../domain/repositories/ICustomerRepository";

export class GetCustomerByIdUseCase {
  constructor(private readonly customerRepo: ICustomerRepository) {}

  public async execute(customerId: string): Promise<Result<Customer>> {
    const customer = await this.customerRepo.findById(customerId);
    if (!customer) {
      return Result.fail<Customer>("Cliente no encontrado.");
    }
    return Result.ok<Customer>(customer);
  }
}
