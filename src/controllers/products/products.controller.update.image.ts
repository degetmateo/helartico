import { Request, Response } from "express";
import { responseError, responseOk } from "../../helpers/response.helper.js";
import InvalidArgumentError from "../../errors/invalidargument.error.js";
import cloudinaryService from "../../services/cloudinary.service.js";
import { mongoDb } from "../../database/mongo.js";
import { UUID } from "mongodb";
import NotFoundError from "../../errors/notfound.error.js";
import { RESPONSES } from "../../static/responses.js";

const productsControllerUpdateImage = async (req: Request, res: Response) => {
    try {
        const _id = req.params._id as string;
        if (!_id) throw new InvalidArgumentError('ID is required.');
        if (!req.file) throw new InvalidArgumentError('FILE is required.');

        const products = mongoDb.collection('products');
        const product = await products.findOne({ _id: new UUID(_id) as any });
        if (!product) throw new NotFoundError('No hemos encontrado el producto.');

        await cloudinaryService.destroy(product.image.public_id);

        const image: any = await cloudinaryService.upload(req.file.buffer);

        await products.updateOne({ _id: new UUID(_id) as any }, { $set: { image: {
            url: image.url,
            secure_url: image.secure_url,
            public_id: image.public_id,
            format: image.format,
            width: image.width,
            height: image.height,
            created_at: new Date(image.created_at)
        } } });

        responseOk(res, RESPONSES.ACCEPTED, null);
    } catch (error: any) {
        console.error(error);
        responseError(res, error);  
    };
};

export default productsControllerUpdateImage;