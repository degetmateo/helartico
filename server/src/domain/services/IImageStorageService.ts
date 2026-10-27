export interface IImageStorageService {
  uploadImage(buffer: Buffer, originalFilename?: string): Promise<string>;
  deleteImage(imageUrlOrPublicId: string): Promise<void>;
}
