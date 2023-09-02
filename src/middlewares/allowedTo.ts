import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { matchedData, validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import {Role} from "../Controllers/user/user.model";

export const allowedTo = (...roles: Role[]) => {
    return expressAsyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const userRole = req.user!.role;
            if (!roles.includes(userRole)) {
                return next(
                    new ApiError(
                        `You are not allowed to perform this action`,
                        StatusCodes.UNAUTHORIZED
                    )
                );
            }
            return next();
        }
    );
}