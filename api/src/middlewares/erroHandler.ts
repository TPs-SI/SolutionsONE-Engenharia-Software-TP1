import { Response, Request, NextFunction } from "express";
import statusCodes from "../../utils/constants/statusCodes";

import { TokenError } from "../../errors/TokenError";
import { QueryError } from "../../errors/QueryError";
import { InvalidParamError } from "../../errors/InvalidParamError";
import { NotAuthorizedError } from "../../errors/NotAuthorizedError";
import { InvalidRouteError } from "../../errors/InvalidRouteError";
import { LoginError } from "../../errors/LoginError";
import { PermissionError } from "../../errors/PermissionError";

function errorHandler(error: any, req:Request, res: Response, next: NextFunction){
    let message: string = error.message;
    let status: number = statusCodes.INTERNAL_SERVER_ERROR;

    if (error instanceof NotAuthorizedError) {
        status = statusCodes.FORBIDDEN;
    }

    if (error instanceof InvalidRouteError) {
        status = statusCodes.NOT_FOUND;
    }

    if (error instanceof PermissionError) {
        status = statusCodes.FORBIDDEN;
    }

    if (error instanceof InvalidParamError) {
        status = statusCodes.BAD_REQUEST;
    }

    if (error instanceof LoginError) {
        status = statusCodes.UNAUTHORIZED;
    }

    if (error instanceof TokenError) {
        status = statusCodes.NOT_FOUND;
    }

    if (error instanceof QueryError) {
        status = statusCodes.BAD_REQUEST;
    }

    res.status(status).json({error: message});
}

export default errorHandler;