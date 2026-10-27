import { describe, expect, it, vi } from "vitest";
import { DeleteProductUseCase } from "../../application/products/DeleteProductUseCase";
import { UpdateProductUseCase } from "../../application/products/UpdateProductUseCase";
import { Product } from "../../domain/entities/Product";
import { IImageStorageService } from "../../domain/services/IImageStorageService";
import { Points } from "../../domain/value-objects/Points";
import { extractCloudinaryPublicId } from "../../infrastructure/storage/CloudinaryImageStorageService";
import { InMemoryProductRepository } from "../mocks/InMemoryRepositories";

describe("Cloudinary Public ID Extraction Helper", () => {
  it("should extract public_id with version and extension", () => {
    const url =
      "https://res.cloudinary.com/helartico/image/upload/v1729000000/helartico/products/icecream_cone_123.jpg";
    const publicId = extractCloudinaryPublicId(url);
    expect(publicId).toBe("helartico/products/icecream_cone_123");
  });

  it("should extract public_id without version", () => {
    const url =
      "https://res.cloudinary.com/helartico/image/upload/helartico/products/icecream_cone_456.png";
    const publicId = extractCloudinaryPublicId(url);
    expect(publicId).toBe("helartico/products/icecream_cone_456");
  });

  it("should return null for non-cloudinary URLs or base64 data URIs", () => {
    expect(extractCloudinaryPublicId("data:image/jpeg;base64,/9j/4AAQSkZJRg==")).toBeNull();
    expect(
      extractCloudinaryPublicId("https://images.unsplash.com/photo-1501443762994-82bd5dace89a")
    ).toBeNull();
    expect(extractCloudinaryPublicId("")).toBeNull();
  });
});

describe("Product Editing and Cloudinary Image Cleanup UseCases", () => {
  const createMockStorageService = (): IImageStorageService => ({
    uploadImage: vi.fn().mockResolvedValue("https://res.cloudinary.com/helartico/image/upload/v1/new.png"),
    deleteImage: vi.fn().mockResolvedValue(undefined),
  });

  it("should update product fields without calling deleteImage if image remains the same", async () => {
    const productRepo = new InMemoryProductRepository();
    const mockStorage = createMockStorageService();
    const updateUseCase = new UpdateProductUseCase(productRepo, mockStorage);

    const initialProduct = await productRepo.save(
      new Product({
        id: "prod_1",
        name: "Copa Helada",
        imageUrl: "https://res.cloudinary.com/helartico/image/upload/v1/helartico/products/copa.png",
        pointsRequired: Points.create(300).getValue(),
        isActive: true,
      })
    );

    const result = await updateUseCase.execute({
      productId: "prod_1",
      name: "Copa Helada Especial",
      imageUrl: initialProduct.imageUrl,
      pointsRequired: 350,
      isActive: false,
    });

    expect(result.isSuccess).toBe(true);
    const updated = result.getValue();
    expect(updated.name).toBe("Copa Helada Especial");
    expect(updated.pointsRequired.value).toBe(350);
    expect(updated.isActive).toBe(false);
    expect(mockStorage.deleteImage).not.toHaveBeenCalled();
  });

  it("should delete old image from Cloudinary when updating product with a new image", async () => {
    const productRepo = new InMemoryProductRepository();
    const mockStorage = createMockStorageService();
    const updateUseCase = new UpdateProductUseCase(productRepo, mockStorage);

    const oldImageUrl =
      "https://res.cloudinary.com/helartico/image/upload/v1/helartico/products/old_photo.png";
    const newImageUrl =
      "https://res.cloudinary.com/helartico/image/upload/v2/helartico/products/new_photo.png";

    await productRepo.save(
      new Product({
        id: "prod_2",
        name: "Café Espresso",
        imageUrl: oldImageUrl,
        pointsRequired: Points.create(150).getValue(),
        isActive: true,
      })
    );

    const result = await updateUseCase.execute({
      productId: "prod_2",
      name: "Café Espresso Doble",
      imageUrl: newImageUrl,
      pointsRequired: 180,
      isActive: true,
    });

    expect(result.isSuccess).toBe(true);
    expect(mockStorage.deleteImage).toHaveBeenCalledWith(oldImageUrl);
  });

  it("should delete product completely from repository and delete its image from Cloudinary", async () => {
    const productRepo = new InMemoryProductRepository();
    const mockStorage = createMockStorageService();
    const deleteUseCase = new DeleteProductUseCase(productRepo, mockStorage);

    const imageUrl =
      "https://res.cloudinary.com/helartico/image/upload/v1/helartico/products/delete_me.png";

    await productRepo.save(
      new Product({
        id: "prod_to_delete",
        name: "Torta Helada",
        imageUrl,
        pointsRequired: Points.create(500).getValue(),
        isActive: true,
      })
    );

    const result = await deleteUseCase.execute("prod_to_delete");
    expect(result.isSuccess).toBe(true);

    // Verify removed from repository
    const found = await productRepo.findById("prod_to_delete");
    expect(found).toBeNull();

    // Verify Cloudinary deleteImage called
    expect(mockStorage.deleteImage).toHaveBeenCalledWith(imageUrl);
  });

  it("should fail gracefully when deleting or updating a non-existent product", async () => {
    const productRepo = new InMemoryProductRepository();
    const mockStorage = createMockStorageService();
    const updateUseCase = new UpdateProductUseCase(productRepo, mockStorage);
    const deleteUseCase = new DeleteProductUseCase(productRepo, mockStorage);

    const updateRes = await updateUseCase.execute({
      productId: "unknown_id",
      name: "Nonexistent",
      imageUrl: "url",
      pointsRequired: 100,
    });
    expect(updateRes.isFailure).toBe(true);
    expect(updateRes.error).toBe("Product not found.");

    const deleteRes = await deleteUseCase.execute("unknown_id");
    expect(deleteRes.isFailure).toBe(true);
    expect(deleteRes.error).toBe("Product not found.");
  });
});
