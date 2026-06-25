import { Pool } from 'pg';

console.log(process.env)

const pg: Pool = new Pool({
    connectionString: process.env.DATABASE_URI,
    database: 'helartico',
    ssl: {
        rejectUnauthorized: true,
        ca: Buffer.from(process.env.DATABASE_CA as any, 'base64').toString()
    }
});

export { pg };