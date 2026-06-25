const responses = require("../static/responses.cjs");
const BaseError = require("./base.error.cjs");

module.exports.NotFoundError = class extends BaseError {
    constructor (message) {
        super(message || 'No se encontraron resultados.', responses.NOT_FOUND);
    };
};