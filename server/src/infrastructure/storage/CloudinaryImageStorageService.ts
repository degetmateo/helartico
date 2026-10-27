import { v2 as cloudinary } from "cloudinary";
import { EnvironmentConfig } from "../../config/EnvironmentConfig";
import { IImageStorageService } from "../../domain/services/IImageStorageService";

export function extractCloudinaryPublicId(url: string): string | null {
  if (!url || typeof url !== "string" || !url.includes("res.cloudinary.com")) {
    return null;
  }
  const uploadIndex = url.indexOf("/upload/");
  if (uploadIndex === -1) {
    return null;
  }

  let pathAfterUpload = url.substring(uploadIndex + "/upload/".length);

  // Remove version prefix if present (e.g. "v1729000000/")
  pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, "");

  // Remove file extension
  const lastDotIndex = pathAfterUpload.lastIndexOf(".");
  if (lastDotIndex !== -1) {
    pathAfterUpload = pathAfterUpload.substring(0, lastDotIndex);
  }

  return pathAfterUpload.trim() || null;
}

export class CloudinaryImageStorageService implements IImageStorageService {
  private isConfigured: boolean = false;

  constructor() {
    const cloudName = EnvironmentConfig.cloudinaryCloudName;
    const apiKey = EnvironmentConfig.cloudinaryApiKey;
    const apiSecret = EnvironmentConfig.cloudinaryApiSecret;

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
      this.isConfigured = true;
    }
  }

  public async uploadImage(buffer: Buffer, _originalFilename?: string): Promise<string> {
    if (!this.isConfigured) {
      console.warn(
        "[Cloudinary] Credentials not provided in .env (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)."
      );
      // Fallback base64 data URI so local dev works seamlessly before configuring Cloudinary credentials
      return `data:image/jpeg;base64,${buffer.toString("base64")}`;
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: EnvironmentConfig.cloudinaryFolder,
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(new Error(error?.message || "Failed to upload image to Cloudinary."));
            return;
          }
          resolve(result.secure_url);
        }
      );

      uploadStream.end(buffer);
    });
  }

  public async deleteImage(imageUrlOrPublicId: string): Promise<void> {
    if (!this.isConfigured) {
      console.warn("[Cloudinary] Credentials not configured, skipping image deletion.");
      return;
    }

    if (!imageUrlOrPublicId || typeof imageUrlOrPublicId !== "string") {
      return;
    }

    // Ignore base64 data URIs
    if (imageUrlOrPublicId.startsWith("data:")) {
      return;
    }

    let publicId = imageUrlOrPublicId;
    if (imageUrlOrPublicId.includes("res.cloudinary.com")) {
      const extracted = extractCloudinaryPublicId(imageUrlOrPublicId);
      if (!extracted) {
        return;
      }
      publicId = extracted;
    } else if (
      imageUrlOrPublicId.startsWith("http://") ||
      imageUrlOrPublicId.startsWith("https://")
    ) {
      // External non-Cloudinary image URL (e.g. Unsplash, placeholder)
      return;
    }

    try {
      await cloudinary.uploader.destroy(publicId, { invalidate: true });
    } catch (error) {
      console.error(`[Cloudinary] Failed to delete image (${publicId}):`, error);
    }
  }
}
