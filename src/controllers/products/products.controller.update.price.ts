import { Request, Response } from "express";
import { responseError, responseOk } from "../../helpers/response.helper.js";
import InvalidArgumentError from "../../errors/invalidargument.error.js";
import { RESPONSES } from "../../static/responses.js";
import { mongoDb } from "../../database/mongo.js";
import { UUID } from "mongodb";

const productsControllerUpdatePrice = async (req: Request, res: Response) => {
    try {
        const _id = req.params._id as string;

        if (!_id) throw new InvalidArgumentError('ID is required.');

        const price: any = Number(req.body.price);
        
        if (!price) throw new InvalidArgumentError('PRICE is required.');
        if (isNaN(price)) throw new InvalidArgumentError('PRICE must be a number.');
        if (price < 0) throw new InvalidArgumentError('PRICE must be zero or positive.');

        const products = mongoDb.collection('products');
        const product = await products.findOneAndUpdate({ _id: new UUID(_id) as any }, { $set: { price } });

        if (!product) throw new InvalidArgumentError('No hemos encontrado el producto.');

        responseOk(res, RESPONSES.ACCEPTED, null);
    } catch (error: any) {
        console.error(error);
        responseError(res, error);
    };
};

export default productsControllerUpdatePrice;