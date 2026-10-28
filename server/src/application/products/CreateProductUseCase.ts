import { Result } from "../../core/Result";
import { Product } from "../../domain/entities/Product";
import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { Points } from "../../domain/value-objects/Points";

export interface CreateProductDTO {
  name: string;
  imageUrl: string;
  pointsRequired: number;
}

export class CreateProductUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  public async execute(dto: CreateProductDTO): Promise<Result<Product>> {
    if (!dto.name || dto.name.trim().length === 0) {
      return Result.fail<Product>("El nombre del producto es obligatorio.");
    }
    if (!dto.imageUrl || dto.imageUrl.trim().length === 0) {
      return Result.fail<Product>("La imagen del producto es obligatoria.");
    }

    const pointsResult = Points.create(dto.pointsRequired);
    if (pointsResult.isFailure) {
      return Result.fail<Product>(pointsResult.error);
    }

    const product = new Product({
      name: dto.name,
      imageUrl: dto.imageUrl,
      pointsRequired: pointsResult.getValue(),
      isActive: true,
    });

    const saved = await this.productRepo.save(product);
    return Result.ok<Product>(saved);
  }
}
