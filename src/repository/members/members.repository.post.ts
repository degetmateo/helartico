import * as uuid from 'uuid';
import ConflictError from '../../errors/conflict.error.js';
import { pg } from '../../database/pg.js';
import { mongoDb } from '../../database/mongo.js';
import { UUID } from 'mongodb';
import { generateToken } from '../../helpers/jwt.helper.js';
import { PoolClient } from 'pg';
import BaseError from '../../errors/base.error.js';
import DatabaseError from '../../errors/database.error.js';

const membersRepositoryPost = async (data: {
    names: string;
    surnames: string;
    email: string;
    dni: string;
    password: string;
}) => {
    let client: PoolClient = {} as PoolClient;
    try {   
        const q1 = 'SELECT * FROM member WHERE email = $1;';
        const v1 = [data.email];
        
        client = await pg.connect();

        await client.query('BEGIN');

        const r1: any = await client.query(q1, v1);
        if (r1[0]) throw new ConflictError('Ya existe un usuario con esos datos.');

        const id = uuid.v7();
        const q2 = 'INSERT INTO member (id, names, surnames, dni, email, password) VALUES ($1, $2, $3, $4, $5, $6);';
        const v2 = [id, data.names, data.surnames, data.dni, data.email, data.password];

        await client.query(q2, v2);

        const collection = mongoDb.collection('users');

        await collection.insertOne({
            _id: new UUID(id) as any,
            points: 0
        });

        const token = await generateToken({ id, dni: data.dni, email: data.email }, '30d');

        await client.query('COMMIT');

        return {
            token: token,
            member: {
                id,
                names: data.names,
                surnames: data.surnames,
                points: 0
            }
        };
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        if (error instanceof BaseError) throw error;
        else throw new DatabaseError();
    };
};

export default membersRepositoryPost;