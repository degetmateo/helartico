const responses = require("../static/responses.cjs");
const BaseError = require("./base.error.cjs");

module.exports = class InvalidArgumentError extends BaseError {
    constructor (message) {
        super(message || 'Hay un error con los datos recibidos.', responses.NOT_ACCEPTABLE);
    };
};