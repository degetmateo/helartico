const responses = require("../static/responses.cjs");
const BaseError = require("./base.error.cjs");

module.exports = class DatabaseError extends BaseError {
    constructor (message) {
        super(message || 'Ha ocurrido un error inesperado.', responses.INTERNAL_SERVER_ERROR);
    };
};