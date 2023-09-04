import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { matchedData, validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export const validate = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = errors.array()[0] as{
                location: string;
                path: string;
                msg: string;
                type: string;
            };
            const message = `${error.path} ${error.msg}`;
            return next(new ApiError(message, StatusCodes.BAD_REQUEST));
        }
        req.body = matchedData(req, {locations:["body"]});
        return next();
    }
)




