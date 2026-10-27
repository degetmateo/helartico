import { PaginatedResult } from "../../core/Pagination";
import { Staff, StaffRole } from "../../domain/entities/Staff";
import { IStaffRepository, StaffSearchCriteria } from "../../domain/repositories/IStaffRepository";

export interface ListStaffFilter {
  search?: string;
  role?: StaffRole;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export class ListStaffUseCase {
  constructor(private readonly staffRepo: IStaffRepository) {}

  public async execute(filter: ListStaffFilter): Promise<PaginatedResult<Staff>> {
    return this.staffRepo.findAll({
      searchTerm: filter.search,
      role: filter.role,
      isActive: filter.isActive,
      page: filter.page,
      limit: filter.limit,
    });
  }
}
