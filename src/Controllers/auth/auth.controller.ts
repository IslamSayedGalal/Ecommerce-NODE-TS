import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { UserModel } from "../user/user.model";
import { response } from "../../utils/Response";
import { ApiError } from "../../utils/ApiError";

interface RegisterInterface {
  name: string;
  phone: string;
  email: string;
  password: string;
}

interface LoginInterface {
  username: string;
  password: string;
}

export const register = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, phone, email, password } = req.body as RegisterInterface;

    const user = await UserModel.create({ name, phone, email, password });

    const token = user.createToken();

    const responseResult = response({
      data: { token },
      message: "register successfully",
      statusCode: StatusCodes.CREATED,
    });
    res.status(responseResult.statusCode).json(responseResult);
  }
);

export const login = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body as LoginInterface;

    const user = await UserModel.findOne({$or: [{email: username}, {phone: username}]});

    if (!user) {
      return next(
        new ApiError("email or password not correct", StatusCodes.NOT_FOUND)
      );
    }

    const isMatch = user.comparePassword(password);
    if (!isMatch) {
      return next(
        new ApiError("email or password not correct", StatusCodes.BAD_REQUEST)
      );
    }

    const token = user.createToken();

    const responseResult = response({
      data: { token },
      message: "login successfully",
      statusCode: StatusCodes.OK,
    });
    res.status(responseResult.statusCode).json(responseResult);
    
  }
);
