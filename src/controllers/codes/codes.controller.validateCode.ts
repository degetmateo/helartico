import { Request, Response } from "express";
import { responseError, responseOk } from "../../helpers/response.helper.js";
import InvalidArgumentError from "../../errors/invalidargument.error.js";
import { mongoDb } from "../../database/mongo.js";
import NotFoundError from "../../errors/notfound.error.js";
import { RESPONSES } from "../../static/responses.js";

const codesControllerValidateCode = async (req: Request, res: Response) => {
    try {
        let code = req.query.code ? req.query.code as string : null;
        if (!code || !code.trim()) throw new InvalidArgumentError('Tenés que ingresar el código.');

        code = code.toUpperCase();

        const collection = mongoDb.collection('exchange_codes');
        
        let data: any = await collection.findOne({
            code: code,
            status: "PENDING"
        });

        if (!data) throw new NotFoundError('El código ingresado no existe.');

        data = await collection.findOneAndUpdate({ _id: data._id }, { $set: { status: "RECLAIMED" } });
        data.status = 'RECLAIMED';

        responseOk(res, RESPONSES.OK, data);
    } catch (error: any) {
        console.error(error);
        responseError(res, error);  
    };
};

export default codesControllerValidateCode;