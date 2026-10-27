import { PaginatedResult } from "../../core/Pagination";
import { Customer } from "../../domain/entities/Customer";
import { ICustomerRepository } from "../../domain/repositories/ICustomerRepository";

export interface ListCustomersFilter {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export class ListCustomersUseCase {
  constructor(private readonly customerRepo: ICustomerRepository) {}

  public async execute(filter: ListCustomersFilter): Promise<PaginatedResult<Customer>> {
    return this.customerRepo.search({
      searchTerm: filter.search,
      isActive: filter.isActive,
      page: filter.page,
      limit: filter.limit,
    });
  }
}

