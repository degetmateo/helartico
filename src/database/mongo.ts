import { Db, MongoClient } from "mongodb";

let mongoDb: Db = {} as Db;

const mongoInit = async () => {
    try {
        const client = new MongoClient(process.env.MONGODB_DATABASE_KEY);
        await client.connect();
        mongoDb = client.db(process.env.MONGODB_DATABASE_NAME);
        console.log('✅ | MongoDB connected.');
    } catch (error) {
        console.error('🟥 | MongoDB error: ', error);
    };
};

export {
    mongoDb,
    mongoInit
};