import { RESPONSES } from "../static/responses.js";
import BaseError from "./base.error.js";

export default class ConflictError extends BaseError {
    constructor (message: string) {
        super(message || 'Existe un conflicto.', RESPONSES.CONFLICT);
    };
};