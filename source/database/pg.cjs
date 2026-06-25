const { Pool } = require('pg');

const pg = new Pool({
    connectionString: process.env.DATABASE_URI,
    database: 'helartico',
    ssl: {
        rejectUnauthorized: true,
        ca: Buffer.from(process.env.DATABASE_CA, 'base64').toString()
    }
});

module.exports = { 
    pg
};