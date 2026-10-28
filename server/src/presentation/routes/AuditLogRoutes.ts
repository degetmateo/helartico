import { Router } from "express";
import { AuditLogController } from "../controllers/AuditLogController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";

export function createAuditLogRouter(controller: AuditLogController): Router {
  const router = Router();

  // Audit logs are strictly reserved for ADMINISTRATOR
  router.use(AuthMiddleware.handle);
  router.use(RoleMiddleware.requireAdmin());

  router.get("/", controller.list);

  return router;
}
