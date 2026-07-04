import { Request, Response } from "express";
import { responseError, responseOk } from "../../helpers/response.helper.js";
import InvalidArgumentError from "../../errors/invalidargument.error.js";
import { mongoDb } from "../../database/mongo.js";
import { UUID } from "mongodb";
import NotFoundError from "../../errors/notfound.error.js";
import { RESPONSES } from "../../static/responses.js";

const productsControllerUpdateName = async (req: Request, res: Response) => {
    try {
        const _id = req.params._id as string;
        if (!_id || !_id.trim()) throw new InvalidArgumentError('ID is required!');
        let name = req.body.name as string;
        if (!name || !name.trim()) throw new InvalidArgumentError('New name is required!');

        name = name.trim();

        const products = mongoDb.collection('products');
        const product = await products.findOneAndUpdate({ _id: new UUID(_id) as any }, { $set: { name } });

        if (!product) throw new NotFoundError('No hemos encontrado el producto.');

        return responseOk(res, RESPONSES.ACCEPTED, null);
    } catch (error: any) {
        console.error(error);
        responseError(res, error);
    };
};

export default productsControllerUpdateName;