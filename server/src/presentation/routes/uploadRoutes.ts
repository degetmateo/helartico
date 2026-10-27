import { Router } from "express";
import { UploadController } from "../controllers/UploadController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";
import { uploadImageMiddleware } from "../middlewares/UploadMiddleware";

export function createUploadRouter(controller: UploadController): Router {
  const router = Router();

  // Only Staff can upload product images
  router.post(
    "/",
    AuthMiddleware.handle,
    RoleMiddleware.requireRole("STAFF"),
    uploadImageMiddleware,
    controller.uploadImage
  );

  return router;
}
