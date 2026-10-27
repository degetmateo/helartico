import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";

export function createAuthRouter(controller: AuthController): Router {
  const router = Router();

  router.post("/login", controller.login);
  router.post("/register", controller.registerCustomer);
  router.get("/me", AuthMiddleware.handle, controller.getMe);
  router.post(
    "/staff/register",
    AuthMiddleware.handle,
    RoleMiddleware.requireAdmin(),
    controller.createStaff
  );

  return router;
}
