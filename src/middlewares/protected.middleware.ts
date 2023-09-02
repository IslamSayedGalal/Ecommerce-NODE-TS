import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { ApiError } from "../utils/ApiError";
import {User} from "../Controllers/user/user.model";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/jwt/jwt";

export const protectedMiddleware = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const authorization = req.headers.authorization;
        const isTokenExist = authorization && authorization.startsWith("Bearer")? true : false;
        if(!isTokenExist){
            return next(
                new ApiError("You are not authorized", StatusCodes.UNAUTHORIZED)
            );
        }
        const token = authorization!.split(" ")[1];
        const JWT_SECRET = process.env.JWT_SECRET!;
        const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
        const user = await User.findById(payload._id);
        if (!user) {
            return next(new ApiError("User Not Found", StatusCodes.NOT_FOUND));
        }
        const passwordChangedAt = new Date(user.passwordChangedAt).getDate();
        const tokenCreationTime = payload.iat!;

        const isSafeToContinue = tokenCreationTime > passwordChangedAt;

        if (!isSafeToContinue) {
        return next(
            new ApiError(
            "session expired, please signin again",
            StatusCodes.UNAUTHORIZED
            )
        );
        }

        req.user = user;
        return next();
    }
)
