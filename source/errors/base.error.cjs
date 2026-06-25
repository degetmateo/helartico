const responses = require("../static/responses.cjs");

module.exports = class BaseError extends Error {
    statusCode;

    constructor (message, statusCode) {
        super();
        this.message = message || 'Ha ocurrido un error inesperado.';
        this.statusCode = statusCode || responses.INTERNAL_SERVER_ERROR;
    };
};