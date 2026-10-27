import { PaginatedResult } from "../../core/Pagination";
import { Product } from "../entities/Product";

export interface ProductSearchCriteria {
  searchTerm?: string;
  onlyActive?: boolean;
  page?: number;
  limit?: number;
}

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findAll(criteria?: ProductSearchCriteria | boolean): Promise<PaginatedResult<Product>>;
  save(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
}

