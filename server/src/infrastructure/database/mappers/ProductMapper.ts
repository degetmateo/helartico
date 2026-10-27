import { Product } from "../../../domain/entities/Product";
import { Points } from "../../../domain/value-objects/Points";
import { IProductDocument } from "../schemas/ProductSchema";

export class ProductMapper {
  public static toDomain(doc: IProductDocument): Product {
    const pointsResult = Points.create(doc.pointsRequired);
    if (pointsResult.isFailure) {
      throw new Error(`Corrupt product document: ${doc._id}`);
    }

    return new Product({
      id: doc._id.toString(),
      name: doc.name,
      imageUrl: doc.imageUrl,
      pointsRequired: pointsResult.getValue(),
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  public static toPersistence(product: Product): Partial<IProductDocument> {
    return {
      name: product.name,
      imageUrl: product.imageUrl,
      pointsRequired: product.pointsRequired.value,
      isActive: product.isActive,
    };
  }
}
