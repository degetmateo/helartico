import { Response } from "express";
import BaseError from "../errors/base.error.js";
import { RESPONSES } from "../static/responses.js";

export const responseOk = (res: Response, statusCode: number = 200, data: any) => {
    return res.status(statusCode).json({ data });
};

export const responseError = (res: Response, error: Error | BaseError) => {
    if (error instanceof BaseError) return res.status(error.statusCode).json({ error });
    else return res.status(RESPONSES.INTERNAL_SERVER_ERROR).json({ error: { message: 'Ha ocurrido un error inesperado.' } });
};