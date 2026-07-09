import * as uuid from 'uuid';
import ConflictError from '../../errors/conflict.error.js';
import { pg } from '../../database/pg.js';
import { mongoDb } from '../../database/mongo.js';
import { UUID } from 'mongodb';
import { generateMemberToken } from '../../helpers/jwt.helper.js';
import { PoolClient } from 'pg';
import BaseError from '../../errors/base.error.js';
import DatabaseError from '../../errors/database.error.js';

const membersRepositoryPost = async (data: {
    names: string;
    surnames: string;
    email: string;
    dni: string;
    phone: string;
    password: string;
}) => {
    let client: PoolClient = {} as PoolClient;
    try {   
        const q1 = 'SELECT * FROM member WHERE email = $1;';
        const v1 = [data.email];
        
        client = await pg.connect();

        await client.query('BEGIN');

        const r1 = await client.query(q1, v1);
        if (r1.rows[0]) throw new ConflictError('Ya existe un usuario con esos datos.');

        const _id = uuid.v7();
        const q2 = 'INSERT INTO member (_id, dni, email, password, phone, role) VALUES ($1, $2, $3, $4, $5, $6);';
        const v2 = [_id, data.dni, data.email, data.password, data.phone, 'member'];

        await client.query(q2, v2);

        const collection = mongoDb.collection('members');

        await collection.insertOne({
            _id: new UUID(_id) as any,
            names: data.names,
            surnames: data.surnames,
            dni: data.dni,
            points: 0
        });

        const token = await generateMemberToken({ _id, dni: data.dni, email: data.email, role: 'member' });

        await client.query('COMMIT');

        return {
            token: token,
            member: {
                _id,
                names: data.names,
                surnames: data.surnames,
                points: 0,
                role: 'member'
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