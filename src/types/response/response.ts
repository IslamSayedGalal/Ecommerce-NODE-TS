import { StatusCodes } from "http-status-codes";

export interface Response{
    data: any;
    pagination?: {
      length: number;
      totalPages: number;
      page: number;
      limit: number;
    };
    statusCode: StatusCodes;
    message: string;
}