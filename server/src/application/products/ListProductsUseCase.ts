import { PaginatedResult } from "../../core/Pagination";
import { Product } from "../../domain/entities/Product";
import {
  IProductRepository,
  ProductSearchCriteria,
} from "../../domain/repositories/IProductRepository";

export class ListProductsUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  public async execute(
    criteria?: ProductSearchCriteria | boolean
  ): Promise<PaginatedResult<Product>> {
    return this.productRepo.findAll(criteria);
  }
}

