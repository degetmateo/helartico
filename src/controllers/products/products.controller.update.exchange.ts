import { Request, Response } from "express";
import { responseError, responseOk } from "../../helpers/response.helper.js";
import InvalidArgumentError from "../../errors/invalidargument.error.js";
import { mongoDb } from "../../database/mongo.js";
import { UUID } from "mongodb";
import NotFoundError from "../../errors/notfound.error.js";
import { RESPONSES } from "../../static/responses.js";

const productsControllerUpdateExchange = async (req: Request, res: Response) => {
    try {
        const _id = req.params._id as string;
        if (!_id) throw new InvalidArgumentError('ID is required.');

        const exchange_points: any = req.body.exchange;
        if (!exchange_points) throw new InvalidArgumentError('EXCHANGE is required.');
        if (isNaN(exchange_points)) throw new InvalidArgumentError('EXCHANGE must be a number.');
        if (exchange_points < 0) throw new InvalidArgumentError('EXCHANGE must be zero or positive.');

        const products = mongoDb.collection('products');
        const product = await products.findOneAndUpdate({ _id: new UUID(_id) as any }, { $set: { exchange_points } });
        if (!product) throw new NotFoundError('No hemos encontrado el producto.');

        responseOk(res, RESPONSES.ACCEPTED, null);
    } catch (error: any) {
        console.error(error);
        responseError(res, error);  
    };
};

export default productsControllerUpdateExchange;