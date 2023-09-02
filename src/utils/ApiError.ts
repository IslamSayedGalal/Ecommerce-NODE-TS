import { StatusCodes, getReasonPhrase } from "http-status-codes";

export class ApiError extends Error {
    constructor( message:string, public statusCodes: StatusCodes){
        super(message);
        this.name = getReasonPhrase(statusCodes);
    }
}