import { Router } from "express";
import {
  register,
  login,
  forgetPassword,
  verifyPasswordResetCode,
  resetPassword,
  getMe,
} from "./auth.controller";
import {
  registerValidator,
  loginValidator,
  forgetPasswordValidator,
  verifyPasswordResetCodeValidator,
  resetPasswordValidator,
} from "./auth.validator";
import { protectedMiddleWare } from "../../middleWares/protected.middleWare";

const routerAuth = Router();


routerAuth
  .route("/register")
  .post(registerValidator, register);
routerAuth
  .route("/login")
  .post(loginValidator, login);
routerAuth
  .route("/forgetPassword")
  .post(forgetPasswordValidator, forgetPassword);
routerAuth
  .route("/verifyPasswordResetCode")
  .post(verifyPasswordResetCodeValidator, verifyPasswordResetCode);
routerAuth
  .route("/resetCode")
  .put(resetPasswordValidator, resetPassword);


routerAuth
  .route("/getMe")
  .get(protectedMiddleWare, getMe);


export default routerAuth;
