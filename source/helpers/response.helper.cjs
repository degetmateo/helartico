const BaseError = require("../errors/base.error.cjs");
const responses = require("../static/responses.cjs");

module.exports.responseOk = (res, statusCode = 200, data) => {
    return res.status(statusCode).json({ data });
};

module.exports.responseError = (res, error) => {
    if (error instanceof BaseError) return res.status(error.statusCode).json({ error });
    else return res.status(responses.INTERNAL_SERVER_ERROR).json({ error: { message: 'Ha ocurrido un error inesperado.' } });
};