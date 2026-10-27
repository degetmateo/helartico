import { Router } from "express";
import { StaffController } from "../controllers/StaffController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";

export function createStaffRouter(controller: StaffController): Router {
  const router = Router();

  // All staff management routes are strictly reserved for ADMINISTRATOR
  router.use(AuthMiddleware.handle);
  router.use(RoleMiddleware.requireAdmin());

  router.get("/", controller.list);
  router.post("/", controller.create);
  router.put("/:id", controller.update);
  router.delete("/:id", controller.delete);

  return router;
}
