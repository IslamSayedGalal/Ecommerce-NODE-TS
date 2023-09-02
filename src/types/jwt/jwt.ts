import { JwtPayload as Payload } from "jsonwebtoken";

export interface JwtPayload extends Payload {
  _id: string;
}