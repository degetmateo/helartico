import { Request, Response } from "express";
import { responseError, responseOk } from "../../helpers/response.helper.js";
import InvalidArgumentError from "../../errors/invalidargument.error.js";
import { RESPONSES } from "../../static/responses.js";
import { mongoDb } from "../../database/mongo.js";
import { UUID } from "mongodb";
import NotFoundError from "../../errors/notfound.error.js";

const productsControllerUpdateReward = async (req: Request, res: Response) => {
    try {
        const _id = req.params._id as string;
        if (!_id) throw new InvalidArgumentError('ID is required.');

        const reward_points: any = req.body.reward;
        if (!reward_points) throw new InvalidArgumentError('REWARD is required.');
        if (isNaN(reward_points)) throw new InvalidArgumentError('REWARD must be a number.');
        if (reward_points < 0) throw new InvalidArgumentError('REWARD must be zero or positive.');

        const products = mongoDb.collection('products');
        const product = await products.findOneAndUpdate({ _id: new UUID(_id) as any }, { $set: { reward_points } });
        if (!product) throw new NotFoundError('No hemos encontrado el producto.');

        responseOk(res, RESPONSES.ACCEPTED, null);
    } catch (error: any) {
        console.error(error);
        responseError(res, error);  
    };
};

export default productsControllerUpdateReward;