import { Response } from "express";
import { IImageStorageService } from "../../domain/services/IImageStorageService";
import { AuthenticatedRequest } from "../middlewares/AuthMiddleware";

export class UploadController {
  constructor(private readonly imageStorageService: IImageStorageService) {}

  public uploadImage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ success: false, error: "No image file provided." });
      return;
    }

    try {
      const url = await this.imageStorageService.uploadImage(
        req.file.buffer,
        req.file.originalname
      );
      res.json({ success: true, data: { url } });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Failed to upload image.",
      });
    }
  };
}
