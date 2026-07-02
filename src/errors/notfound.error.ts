import { RESPONSES } from "../static/responses.js";
import BaseError from "./base.error.js";

export default class NotFoundError extends BaseError {
    constructor (message: string) {
        super(message || 'No se encontraron resultados.', RESPONSES.NOT_FOUND);
    };
};