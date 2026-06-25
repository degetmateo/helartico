const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/unauthorized.error.cjs');

const generateToken = (data, expiresIn) => {
    return new Promise ((resolve, reject) => {
        const payload = { data };
        jwt.sign(payload, process.env.JWT_KEY, { expiresIn }, (error, token) => {
            if (error) reject("Error al generar token.");
            resolve(token);
        });
    });
};

const validateToken = (token) => {
    try {
        const { data } = jwt.verify(token, process.env.JWT_KEY);
        return data;
    } catch (error) {
        throw new UnauthorizedError("Token invalido.");
    };
};

module.exports = {
    generateToken,
    validateToken
};