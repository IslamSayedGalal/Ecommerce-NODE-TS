import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { ApiError } from "../utils/ApiError";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export const globalNotFoundRoute = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const error = `This Route Not Found - ${req.originalUrl}`;
    next(new ApiError(error, StatusCodes.NOT_FOUND));
  }
);

export const globalErrorHandler = ( err: ApiError, req: Request, res: Response, next: NextFunction ) => {
  const { message, name, stack, statusCodes } = err;
  const dev = process.env.NODE_ENV === "dev" ? { stack } : {};

  // predicted error
  if (statusCodes) {
    return res.status(statusCodes).json({
      statusCode: statusCodes,
      name,
      message,
      ...dev,
    });
  }


  if (name === "MongoServerError" && message.includes("E11000")) {
    const statusCode = StatusCodes.CONFLICT;
    const name = ReasonPhrases.CONFLICT;
    const message = `the value must be unique`;
    return res.status(statusCode).json({
      statusCode,
      name,
      message,
      ...dev,
    });
  }


  // unpredicted error
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    name,
    message,
    ...dev,
  });
};
