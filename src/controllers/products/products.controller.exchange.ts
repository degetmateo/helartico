import { Request, Response } from "express";
import * as uuid from 'uuid';
import { responseError, responseOk } from "../../helpers/response.helper.js";
import InvalidArgumentError from "../../errors/invalidargument.error.js";
import { mongoDb } from "../../database/mongo.js";
import { Document, Filter, ObjectId, UpdateFilter, UUID } from "mongodb";
import NotfoundError from "../../errors/notfound.error.js";
import UnauthorizedError from "../../errors/unauthorized.error.js";
import { RESPONSES } from "../../static/responses.js";
import codesHelper from "../../helpers/codes.helper.js";

const productsControllerExchange = async (req: Request, res: Response) => {
    try {
        const _id = req.params._id as string;
        if (!_id || !_id.trim()) throw new InvalidArgumentError('INVALID ID.');

        const membersCollection = mongoDb.collection('members');
        const productsCollection = mongoDb.collection('products');
        const exchangeCodesCollection = mongoDb.collection('exchange_codes');

        const memberFilter: Filter<Document> = { _id: new UUID(req.member._id) as any };
        const productFilter: Filter<Document> = { _id: new ObjectId(_id) as any };

        const member = await membersCollection.findOne(memberFilter);
        const product = await productsCollection.findOne(productFilter);

        if (!member || !product) throw new NotfoundError('Ha ocurrido un error inesperado.');

        if (member.points < product.exchange_points) {
            throw new UnauthorizedError('Tus puntos no son suficientes para canjear este producto.');
        };

        const points = member.points - product.exchange_points;
        const memberUpdate: Document[] | UpdateFilter<Document> = { $set: { points } };

        await membersCollection.updateOne(memberFilter, memberUpdate);

        const exchangeCode = codesHelper.generateExchangeCode();
        const exchangeCodeId = uuid.v7();

        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 24);

        const newCode: Document = {
            _id: new UUID(exchangeCodeId),
            code: exchangeCode,
            member_id: member._id,
            product_id: product._id,
            points: product.exchange_points,
            status: "PENDING",
            creation_date: new Date(),
            expiration_date: expirationDate
        };

        await exchangeCodesCollection.insertOne(newCode);

        responseOk(res, RESPONSES.ACCEPTED, {
            remaining_points: points,
            ...newCode
        });
    } catch (error: any) {
        console.error(error);
        responseError(res, error);
    };
};

export default productsControllerExchange;