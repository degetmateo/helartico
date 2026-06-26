import { Request, Response, NextFunction } from "express";
import UnauthorizedError from "../errors/unauthorized.error.js";
import { validateToken } from "./jwt.helper.js";
import { responseError } from "./response.helper.js";

const authorizeRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const headers = req.headers;
        const authorization = headers['authorization'];
        if (!authorization) throw new UnauthorizedError();
        const token = authorization.split(' ')[1];
        if (!token) throw new UnauthorizedError();
        const data = validateToken(token);
        if (data.type != 'request') throw new UnauthorizedError();
        req.member = data;
        next();
    } catch (error) {
        responseError(res, new UnauthorizedError('No estás autorizado para realizar esta acción.'));
    };
};

export {
    authorizeRequest
};