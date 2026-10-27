import { Result } from "../../core/Result";
import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { IImageStorageService } from "../../domain/services/IImageStorageService";

export class DeleteProductUseCase {
  constructor(
    private readonly productRepo: IProductRepository,
    private readonly imageStorageService?: IImageStorageService
  ) {}

  public async execute(productId: string): Promise<Result<void>> {
    const product = await this.productRepo.findById(productId);
    if (!product) {
      return Result.fail<void>("Product not found.");
    }

    if (this.imageStorageService && product.imageUrl) {
      try {
        await this.imageStorageService.deleteImage(product.imageUrl);
      } catch (err) {
        console.error("Failed to delete product image from Cloudinary:", err);
      }
    }

    await this.productRepo.delete(productId);
    return Result.ok<void>();
  }
}
