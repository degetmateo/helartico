import { Request, Response } from "express"
import { responseError, responseOk } from "../../helpers/response.helper.js";
import { productsRepository } from "../../repository/products/products.repository.js";
import { RESPONSES } from "../../static/responses.js";

const productsControllerGet = async (req: Request, res: Response) => {
    try {
        const _id = req.query._id ? req.query._id as string : null;
        const name = req.query.name ? req.query.name as string : null;
        const olderId = req.query.older_id ? req.query.older_id as string : null;
        const data = await productsRepository.get({ _id, name, olderId });
        responseOk(res, RESPONSES.OK, data);
    } catch (error: any) {
        console.error(error);
        responseError(res, error);
    };
};

export default productsControllerGet;