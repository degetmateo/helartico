import { Router } from "express";
import { CustomerController } from "../controllers/CustomerController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";

export function createCustomerRouter(controller: CustomerController): Router {
  const router = Router();

  // Staff only routes for customer administration
  router.use(AuthMiddleware.handle);
  router.use(RoleMiddleware.requireRole("STAFF"));

  router.get("/", controller.search);
  router.post("/", controller.create);
  router.get("/:id", controller.getById);
  router.put("/:id", controller.update);
  router.post("/:id/points", controller.addPoints);
  router.put("/:id/points", controller.setPoints);

  return router;
}
