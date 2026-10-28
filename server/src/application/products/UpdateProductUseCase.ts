import { Result } from "../../core/Result";
import { Product } from "../../domain/entities/Product";
import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { IImageStorageService } from "../../domain/services/IImageStorageService";
import { Points } from "../../domain/value-objects/Points";

export interface UpdateProductDTO {
  productId: string;
  name: string;
  imageUrl: string;
  pointsRequired: number;
  isActive?: boolean;
}

export class UpdateProductUseCase {
  constructor(
    private readonly productRepo: IProductRepository,
    private readonly imageStorageService?: IImageStorageService
  ) {}

  public async execute(dto: UpdateProductDTO): Promise<Result<Product>> {
    const pointsResult = Points.create(dto.pointsRequired);
    if (pointsResult.isFailure) {
      return Result.fail<Product>(pointsResult.error);
    }

    const product = await this.productRepo.findById(dto.productId);
    if (!product) {
      return Result.fail<Product>("Producto no encontrado.");
    }

    const oldImageUrl = product.imageUrl;

    const updateResult = product.update(dto.name, dto.imageUrl, pointsResult.getValue());
    if (updateResult.isFailure) {
      return Result.fail<Product>(updateResult.error);
    }

    if (dto.isActive !== undefined) {
      dto.isActive ? product.activate() : product.deactivate();
    }

    const saved = await this.productRepo.save(product);

    if (this.imageStorageService && dto.imageUrl && oldImageUrl && dto.imageUrl !== oldImageUrl) {
      try {
        await this.imageStorageService.deleteImage(oldImageUrl);
      } catch (err) {
        console.error("Failed to delete previous image from Cloudinary:", err);
      }
    }

    return Result.ok<Product>(saved);
  }
}
