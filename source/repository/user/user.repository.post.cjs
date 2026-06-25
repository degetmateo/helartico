const uuid = require('uuid');

const { pg } = require("../../database/pg.cjs");
const BaseError = require("../../errors/base.error.cjs");
const ConflictError = require("../../errors/conflict.error.cjs");
const DatabaseError = require("../../errors/database.error.cjs");
const mongo = require('../../database/mongo.cjs');
const { UUID } = require('mongodb');
const { generateToken } = require('../../helpers/jwt.cjs');

module.exports.userRepositoryPost = async (data) => {
    let client;
    try {   
        const q1 = 'SELECT * FROM member WHERE email = $1;';
        const v1 = [data.email];
        
        client = await pg.connect();

        await client.query('BEGIN');

        const r1 = await client.query(q1, v1);
        if (r1[0]) throw new ConflictError('Ya existe un usuario con esos datos.');

        const id = uuid.v7();
        const q2 = 'INSERT INTO member (id, names, surnames, dni, email, password) VALUES ($1, $2, $3, $4, $5, $6);';
        const v2 = [id, data.names, data.surnames, data.dni, data.email, data.password];

        await client.query(q2, v2);

        const collection = mongo.db.collection('users');

        await collection.insertOne({
            _id: new UUID(id),
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