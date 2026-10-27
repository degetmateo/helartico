import { PaginatedResult, PaginationHelper } from "../../core/Pagination";
import { Product } from "../../domain/entities/Product";
import {
  IProductRepository,
  ProductSearchCriteria,
} from "../../domain/repositories/IProductRepository";
import { ProductMapper } from "../database/mappers/ProductMapper";
import { ProductModel } from "../database/schemas/ProductSchema";

export class MongoProductRepository implements IProductRepository {
  public async findById(id: string): Promise<Product | null> {
    const doc = await ProductModel.findById(id);
    return doc ? ProductMapper.toDomain(doc) : null;
  }

  public async findAll(
    criteria?: ProductSearchCriteria | boolean
  ): Promise<PaginatedResult<Product>> {
    const options: ProductSearchCriteria =
      typeof criteria === "boolean" ? { onlyActive: criteria } : criteria || {};

    const query: Record<string, any> = {};
    if (options.onlyActive) {
      query.isActive = true;
    }
    if (options.searchTerm) {
      const regex = new RegExp(options.searchTerm.trim(), "i");
      query.name = regex;
    }

    const { page, limit, skip } = PaginationHelper.normalize(
      { page: options.page, limit: options.limit },
      12
    );

    const [total, docs] = await Promise.all([
      ProductModel.countDocuments(query),
      ProductModel.find(query).sort({ pointsRequired: 1 }).skip(skip).limit(limit),
    ]);

    const items = docs.map((doc) => ProductMapper.toDomain(doc));
    return PaginationHelper.createPaginatedResult(items, total, page, limit);
  }

  public async save(product: Product): Promise<Product> {
    const persistenceData = ProductMapper.toPersistence(product);
    if (product.id) {
      const updated = await ProductModel.findByIdAndUpdate(
        product.id,
        { $set: persistenceData },
        { new: true }
      );
      if (!updated) throw new Error(`Product with id ${product.id} not found.`);
      return ProductMapper.toDomain(updated);
    }

    const created = await ProductModel.create(persistenceData);
    return ProductMapper.toDomain(created);
  }

  public async delete(id: string): Promise<void> {
    await ProductModel.findByIdAndDelete(id);
  }
}
