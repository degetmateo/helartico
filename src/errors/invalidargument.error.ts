import { RESPONSES } from "../static/responses.js";
import BaseError from "./base.error.js";

export default class InvalidArgumentError extends BaseError {
    constructor (message?: string) {
        super(message || 'Hay un error con los datos recibidos.', RESPONSES.NOT_ACCEPTABLE);
    };
};