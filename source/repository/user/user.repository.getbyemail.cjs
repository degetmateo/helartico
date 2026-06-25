const { pg } = require("../../database/pg.cjs");
const BaseError = require("../../errors/base.error.cjs");
const DatabaseError = require("../../errors/database.error.cjs");

module.exports.userRepositoryGetByEmail = async (email) => {
    try {
        const q = 'SELECT * FROM member WHERE email = $1;';
        const v = [email];
        const r = await pg.query(q, v);
        return r.rows[0];
    } catch (error) {
        console.error(error);
        if (error instanceof BaseError) throw error;
        else throw new DatabaseError('Ha ocurrido un error inesperado.');  
    };
};