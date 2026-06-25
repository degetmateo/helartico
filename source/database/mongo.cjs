const { MongoClient } = require('mongodb');

const mongo = {
    init: null,
    db: null
};

mongo.init = async () => {    
    try {
        client = new MongoClient(process.env.MONGODB_DATABASE_KEY);
        await client.connect();
        mongo.db = client.db(process.env.MONGODB_DATABASE_NAME);
        console.log('✅ | MongoDB connected.');
    } catch (error) {
        console.error('🟥 | MongoDB error: ', error);
    };
};

module.exports = mongo;