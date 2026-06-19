const { Db, MongoClient } = require('mongodb');

let client;
let mongo;

const init = async () => {    
    try {
        client = new MongoClient(process.env.MONGODB_DATABASE_KEY);
        await client.connect();
        mongo = client.db(process.env.MONGODB_DATABASE_NAME);
        console.log('✅ | MongoDB connected.');
    } catch (error) {
        console.error('🟥 | MongoDB error: ', error);
    };
};

module.exports = {
    init,
    mongo
};