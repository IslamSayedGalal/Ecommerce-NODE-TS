import { Router } from "express";
import routerUpload from "./src/app/upload/upload.router";
import routerAuth from "./src/app/auth/auth.router";
import routerCategory from "./src/app/category/category.router";


const router = Router();


router.use("/upload", routerUpload);
router.use("/auth", routerAuth);
router.use("/category", routerCategory);

export default router;
