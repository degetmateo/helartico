import { Document, Filter, Sort, UUID } from "mongodb";
import { mongoDb } from "../../database/mongo.js";
import BaseError from "../../errors/base.error.js";
import DatabaseError from "../../errors/database.error.js";

const productsRepositoryGet = async (data: {
    _id: string | null;
    name: string | null;
    olderId: string | null;
}) => {
    const collection = mongoDb.collection('products');
    const LIMIT = 20;
    try {
        let words: string[] = [];
        
        if (data.name) {
            words = data.name.split(' ').filter(p => p.trim() !== '');
        };

        let conds: Array<{ name: { $regex: string, $options: string } }> = [];

        if (words.length > 0) {
            conds = words.map(p => ({
                name: { $regex: p, $options: 'i' }
            }));
        };

        let filter: Filter<Document> = {};

        if (data._id) filter['_id'] = new UUID(data._id) as any;
        if (conds.length > 0) filter['$and'] = conds;
        if (data.olderId) filter['_id'] = { $lt: new UUID(data.olderId) as any };

        let sort: Sort = { _id: 'desc' };
        
        const products = await collection.find(filter).sort(sort).limit(LIMIT).toArray();

        return products;
    } catch (error) {
        console.error(error);
        if (error instanceof BaseError) throw error;
        else throw new DatabaseError();
    };
};

export default productsRepositoryGet;