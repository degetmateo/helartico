import { Request, Response } from "express";
import { responseError, responseOk } from "../../helpers/response.helper.js";
import InvalidArgumentError from "../../errors/invalidargument.error.js";
import { Document, Filter, UUID } from "mongodb";
import { mongoDb } from "../../database/mongo.js";
import NotFoundError from "../../errors/notfound.error.js";
import { RESPONSES } from "../../static/responses.js";
import dniValidator from "../../validators/dni.validator.js";

const membersControllerGet = async (req: Request, res: Response) => {
    try {
        const dni = req.query.dni as string;

        if (!dni) throw new InvalidArgumentError('DNI is required.');

        dniValidator(dni);

        const filter: Filter<Document> = {};

        if (dni) filter.dni = dni; 

        const collection = mongoDb.collection('members');
        const member = await collection.findOne(filter);

        if (!member) throw new NotFoundError('No hemos encontrado el usuario solicitado.');

        responseOk(res, RESPONSES.OK, member);
    } catch (error: any) {
        console.error(error);
        responseError(res, error);
    };
};

export default membersControllerGet;