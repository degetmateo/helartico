const responses = require("../static/responses.cjs");
const BaseError = require("./base.error.cjs");

module.exports.UnauthorizedError = class extends BaseError {
    constructor (message) {
        super(message || 'No estás autorizado.', responses.UNAUTHORIZED);
    };
};