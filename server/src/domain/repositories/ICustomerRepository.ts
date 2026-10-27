import { PaginatedResult } from "../../core/Pagination";
import { Customer } from "../entities/Customer";
import { DocumentNumber } from "../value-objects/DocumentNumber";
import { Email } from "../value-objects/Email";

export interface CustomerSearchCriteria {
  searchTerm?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface ICustomerRepository {
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: Email): Promise<Customer | null>;
  findByDocumentNumber(documentNumber: DocumentNumber): Promise<Customer | null>;
  save(customer: Customer): Promise<Customer>;
  search(criteria: CustomerSearchCriteria): Promise<PaginatedResult<Customer>>;
}

