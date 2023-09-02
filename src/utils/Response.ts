import { getReasonPhrase } from "http-status-codes";
import { Response } from "../types/response/response";

export const response =({message, data, statusCode, pagination}:Response)=>{
    return {
        statusCode,
        name: getReasonPhrase(statusCode),
        message,
        pagination,
        data,
    }
}