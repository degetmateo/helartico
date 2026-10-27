import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";

export function createProductRouter(controller: ProductController): Router {
  const router = Router();

  // Public / Authenticated customers can see active products
  router.get("/", controller.listActive);

  // Staff endpoints for product CRUD
  router.get("/admin/all", AuthMiddleware.handle, RoleMiddleware.requireRole("STAFF"), controller.listAll);
  router.post("/", AuthMiddleware.handle, RoleMiddleware.requireRole("STAFF"), controller.create);
  router.put("/:id", AuthMiddleware.handle, RoleMiddleware.requireRole("STAFF"), controller.update);
  router.delete("/:id", AuthMiddleware.handle, RoleMiddleware.requireRole("STAFF"), controller.delete);

  return router;
}
