import { Router } from "express";
import routerUpload from "./src/app/upload/upload.router";
import routerAuth from "./src/app/auth/auth.router";


const router = Router();


router.use("/upload", routerUpload);
router.use("/auth", routerAuth);

export default router;
