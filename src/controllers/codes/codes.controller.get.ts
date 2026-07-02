import { Request, Response } from "express"
import { responseError, responseOk } from "../../helpers/response.helper.js";
import { mongoDb } from "../../database/mongo.js";
import { Document, Filter, Sort, UUID } from "mongodb";
import { RESPONSES } from "../../static/responses.js";

const codesControllerGet = async (req: Request, res: Response) => {
    try {
        const collection = mongoDb.collection('exchange_codes');

        const filter: Filter<Document> = { "member._id": new UUID(req.member._id) };
        const sort: Sort = { _id: 'desc' };

        const data = await collection.find(filter).sort(sort).limit(20).toArray();

        responseOk(res, RESPONSES.OK, data);
    } catch (error: any) {
        console.error(error);
        responseError(res, error);  
    };
};

export default codesControllerGet;