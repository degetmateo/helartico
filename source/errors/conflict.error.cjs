const responses = require("../static/responses.cjs");
const BaseError = require("./base.error.cjs");

module.exports = class ConflictError extends BaseError {
    constructor (message) {
        super(message || 'Existe un conflicto..', responses.CONFLICT);
    };
};