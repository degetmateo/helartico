import { Request, Response } from "express"
import { responseError, responseOk } from "../../helpers/response.helper.js";
import { productsRepository } from "../../repository/products/products.repository.js";
import { RESPONSES } from "../../static/responses.js";

const productsControllerGet = async (req: Request, res: Response) => {
    try {
        const name = req.query.name ? req.query.name as string : null;
        const data = await productsRepository.get({ name });
        responseOk(res, RESPONSES.OK, data);
    } catch (error: any) {
        console.error(error);
        responseError(res, error);
    };
};

export default productsControllerGet;