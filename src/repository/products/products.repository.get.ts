import { Document, Filter } from "mongodb";
import { mongoDb } from "../../database/mongo.js";
import BaseError from "../../errors/base.error.js";
import DatabaseError from "../../errors/database.error.js";

const productsRepositoryGet = async (data: {
    name: string | null;
}) => {
    try {
        const filter: Filter<Document> = {};

        if (data.name) filter.name = data.name;

        const collection = mongoDb.collection('products');
        const results = await collection.find(filter).limit(20).toArray();
        
        return results;
    } catch (error) {
        console.error(error);
        if (error instanceof BaseError) throw error;
        else throw new DatabaseError();
    };
};

export default productsRepositoryGet;