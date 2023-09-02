import { Router } from "express";
import routerUpload from "./src/Controllers/upload/upload.router";
import routerAuth from "./src/Controllers/auth/auth.router";


const router = Router();


router.use("/upload", routerUpload);
router.use("/auth", routerAuth);

export default router;
