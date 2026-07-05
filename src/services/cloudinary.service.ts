import { v2 as cloudinary } from "cloudinary";
import stream from 'stream';

const upload = (buffer: Buffer) => {
    return new Promise((resolve, reject) => {
        const cloudinaryStream = cloudinary.uploader.upload_stream(
            { folder: 'helartico' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        stream.Readable.from(buffer).pipe(cloudinaryStream);
    }); 
};

const destroy = async (_id: string) => {
    await cloudinary.uploader.destroy(_id);
};

const cloudinaryService = {
    upload,
    destroy
};

export default cloudinaryService;