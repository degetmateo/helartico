import { Response } from "express";
import { CreateProductUseCase } from "../../application/products/CreateProductUseCase";
import { DeleteProductUseCase } from "../../application/products/DeleteProductUseCase";
import { ListProductsUseCase } from "../../application/products/ListProductsUseCase";
import { UpdateProductUseCase } from "../../application/products/UpdateProductUseCase";
import { AuditLogService } from "../../infrastructure/services/AuditLogService";
import { AuthenticatedRequest } from "../middlewares/AuthMiddleware";

export class ProductController {
  constructor(
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly auditLogService?: AuditLogService
  ) {}

  public listActive = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const search = req.query.search as string | undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 12;

    const result = await this.listProductsUseCase.execute({
      onlyActive: true,
      searchTerm: search,
      page,
      limit,
    });

    res.json({
      success: true,
      data: result.items.map((p) => ({
        id: p.id,
        name: p.name,
        imageUrl: p.imageUrl,
        pointsRequired: p.pointsRequired.value,
        isActive: p.isActive,
      })),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        hasMore: result.hasMore,
      },
    });
  };

  public listAll = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const search = req.query.search as string | undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 12;

    const result = await this.listProductsUseCase.execute({
      onlyActive: false,
      searchTerm: search,
      page,
      limit,
    });

    res.json({
      success: true,
      data: result.items.map((p) => ({
        id: p.id,
        name: p.name,
        imageUrl: p.imageUrl,
        pointsRequired: p.pointsRequired.value,
        isActive: p.isActive,
      })),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        hasMore: result.hasMore,
      },
    });
  };


  public create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const result = await this.createProductUseCase.execute(req.body);
    if (result.isFailure) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }
    const p = result.getValue();

    if (this.auditLogService) {
      const actorName = req.user?.name || req.user?.email || "Personal";
      await this.auditLogService.log({
        action: "PRODUCT_CREATE",
        category: "PRODUCT",
        actorId: req.user?.userId,
        actorName,
        actorRole: req.user?.staffRole || req.user?.role || "STAFF",
        targetId: p.id,
        targetName: p.name,
        targetType: "PRODUCT",
        description: `El personal ${actorName} creó el producto "${p.name}" (${p.pointsRequired.value} pts).`,
        details: { pointsRequired: p.pointsRequired.value, imageUrl: p.imageUrl },
      });
    }

    res.status(201).json({
      success: true,
      data: { id: p.id, name: p.name, imageUrl: p.imageUrl, pointsRequired: p.pointsRequired.value },
    });
  };

  public update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const result = await this.updateProductUseCase.execute({
      productId: req.params.id,
      name: req.body.name,
      imageUrl: req.body.imageUrl,
      pointsRequired: Number(req.body.pointsRequired),
      isActive: req.body.isActive,
    });
    if (result.isFailure) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }
    const p = result.getValue();

    if (this.auditLogService) {
      const actorName = req.user?.name || req.user?.email || "Personal";
      await this.auditLogService.log({
        action: "PRODUCT_UPDATE",
        category: "PRODUCT",
        actorId: req.user?.userId,
        actorName,
        actorRole: req.user?.staffRole || req.user?.role || "STAFF",
        targetId: p.id,
        targetName: p.name,
        targetType: "PRODUCT",
        description: `El personal ${actorName} modificó los datos del producto "${p.name}".`,
        details: { pointsRequired: p.pointsRequired.value, isActive: p.isActive },
      });
    }

    res.json({
      success: true,
      data: {
        id: p.id,
        name: p.name,
        imageUrl: p.imageUrl,
        pointsRequired: p.pointsRequired.value,
        isActive: p.isActive,
      },
    });
  };

  public delete = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const result = await this.deleteProductUseCase.execute(req.params.id);
    if (result.isFailure) {
      res.status(404).json({ success: false, error: result.error });
      return;
    }

    if (this.auditLogService) {
      const actorName = req.user?.name || req.user?.email || "Personal";
      await this.auditLogService.log({
        action: "PRODUCT_DELETE",
        category: "PRODUCT",
        actorId: req.user?.userId,
        actorName,
        actorRole: req.user?.staffRole || req.user?.role || "STAFF",
        targetId: req.params.id,
        targetType: "PRODUCT",
        description: `El personal ${actorName} eliminó un producto del catálogo (ID: ${req.params.id}).`,
      });
    }

    res.json({ success: true, message: "Producto eliminado con éxito." });
  };
}
