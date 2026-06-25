import { RESPONSES } from "../static/responses.js";

export default class BaseError extends Error {
    statusCode;

    constructor (message: string, statusCode: number) {
        super();
        this.message = message || 'Ha ocurrido un error inesperado.';
        this.statusCode = statusCode || RESPONSES.INTERNAL_SERVER_ERROR;
    };
};