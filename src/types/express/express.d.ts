// express.d.ts
import express from "express";
import { UserInterface } from "../../types/user/user.interface";

declare global {
  namespace Express {
    interface Request {
      user?: UserInterface;
    }
  }
}