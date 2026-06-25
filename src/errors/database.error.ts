import { RESPONSES } from "../static/responses.js";
import BaseError from "./base.error.js";

export default class DatabaseError extends BaseError {
    constructor (message?: string) {
        super(message || 'Ha ocurrido un error inesperado.', RESPONSES.INTERNAL_SERVER_ERROR);
    };
};