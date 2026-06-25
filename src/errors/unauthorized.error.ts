import { RESPONSES } from "../static/responses.js";
import BaseError from "./base.error.js";

export default class UnauthorizedError extends BaseError {
    constructor (message: string) {
        super(message || 'No estás autorizado.', RESPONSES.UNAUTHORIZED);
    };
};