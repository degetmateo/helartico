import { pg } from "../../database/pg.js";
import BaseError from "../../errors/base.error.js";
import DatabaseError from "../../errors/database.error.js";

const membersRepositoryGetByEmail = async (email: string) => {
    try {
        const q = 'SELECT * FROM member WHERE email = $1;';
        const v = [email];
        const r = await pg.query(q, v);
        return r.rows[0];
    } catch (error) {
        console.error(error);
        if (error instanceof BaseError) throw error;
        else throw new DatabaseError();  
    };
};

export default membersRepositoryGetByEmail;