import { Router } from "express";
import { RedemptionController } from "../controllers/RedemptionController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";

export function createRedemptionRouter(controller: RedemptionController): Router {
  const router = Router();

  // Customer redemption actions
  router.post("/redeem", AuthMiddleware.handle, RoleMiddleware.requireRole("CUSTOMER"), controller.redeem);
  router.get("/my", AuthMiddleware.handle, RoleMiddleware.requireRole("CUSTOMER"), controller.getMyRedemptions);

  // Staff validation actions
  router.post(
    "/validate",
    AuthMiddleware.handle,
    RoleMiddleware.requireRole("STAFF"),
    controller.validate
  );

  return router;
}
