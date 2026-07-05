import { Request, Response } from "express";
import * as uuid from 'uuid';
import { responseError, responseOk } from "../../helpers/response.helper.js";
import InvalidArgumentError from "../../errors/invalidargument.error.js";
import { RESPONSES } from "../../static/responses.js";
import { mongoDb } from "../../database/mongo.js";
import { Document, UUID } from "mongodb";
import cloudinaryService from "../../services/cloudinary.service.js";

const productsControllerPost = async (req: Request, res: Response) => {
    try {
        if (!req.file) throw new InvalidArgumentError("No se subió ninguna imagen.");

        const name = req.body.name as string;
        const price = Number(req.body.price);
        const rewardPoints = Number(req.body.reward_points);
        const exchangePoints = Number(req.body.exchange_points);

        if (!name || !name.trim()) throw new InvalidArgumentError('Nombre invalido.');
        if (!price || price <= 0) throw new InvalidArgumentError('Precio invalido.');
        if (!rewardPoints || rewardPoints < 0) throw new InvalidArgumentError('Puntos de recompensa invalidos.');
        if (!exchangePoints || exchangePoints < 0) throw new InvalidArgumentError('Puntos para canjear invalidos.');

        const result: any = await cloudinaryService.upload(req.file.buffer);

        const collection = mongoDb.collection('products');

        const _id = uuid.v7();

        const doc: Document = {
            _id: new UUID(_id),
            name: name,
            price: price,
            exchange_points: exchangePoints,
            reward_points: rewardPoints,
            created_at: new Date(),
            image: {
                url: result.url,
                secure_url: result.secure_url,
                public_id: result.public_id,
                format: result.format,
                width: result.width,
                height: result.height,
                created_at: new Date(result.created_at)
            }
        };

        await collection.insertOne(doc);

        responseOk(res, RESPONSES.CREATED, doc);
    } catch (error: any) {
        console.error(error);
        responseError(res, error);  
    };
};

export default productsControllerPost;