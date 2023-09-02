import { Router } from "express";
import { register, login } from "./auth.controller";
import { registerValidator, loginValidator } from "./auth.validator";


const routerAuth = Router();

routerAuth.route("/register").post(registerValidator, register);
routerAuth.route("/login").post(loginValidator, login);

export default routerAuth;
