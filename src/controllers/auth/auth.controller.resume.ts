import { Request, Response } from "express";
import { responseError, responseOk } from "../../helpers/response.helper.js";
import { mongoDb } from "../../database/mongo.js";
import { UUID } from "mongodb";
import UnauthorizedError from "../../errors/unauthorized.error.js";
import { RESPONSES } from "../../static/responses.js";

const authControllerResume = async (req: Request, res: Response) => {
    try {
        const collection = mongoDb.collection('members');
        const member = await collection.findOne({ _id: new UUID(req.member._id) as any });
        if (!member) throw new UnauthorizedError();
        responseOk(res, RESPONSES.OK, member);
    } catch (error: any) {
        console.error(error);
        responseError(res, error);
    };
};

export default authControllerResume;