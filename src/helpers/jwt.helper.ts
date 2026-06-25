import jwt from 'jsonwebtoken';
import unauthorizedError from '../errors/unauthorized.error.js';

const generateToken = (data: any, expiresIn: any) => {
    return new Promise ((resolve, reject) => {
        const payload = { data };
        jwt.sign(payload, process.env.JWT_KEY, { expiresIn }, (error, token) => {
            if (error) reject("Error al generar token.");
            resolve(token);
        });
    });
};

const validateToken = (token: string) => {
    try {
        const { data } = jwt.verify(token, process.env.JWT_KEY) as any;
        return data;
    } catch (error) {
        throw new unauthorizedError("Token invalido.");
    };
};

export {
    generateToken,
    validateToken
};