// express.d.ts
import express from "express";
import { UserDocument } from "../../user/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}