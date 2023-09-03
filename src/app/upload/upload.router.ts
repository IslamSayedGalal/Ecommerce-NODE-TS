import { Router } from "express";
import { uploadImage, uploadFile } from "./upload.controller";
import { uploadDisk, uploadMemory } from "../../middlewares/upload.middleWare";
import { protectedMiddleware } from "../../middlewares/protected.middleware";

const routerUpload = Router();

// upload image
routerUpload.route("/image?").post( uploadMemory.single("image"), uploadImage);

// upload file
routerUpload.route("/file").post(protectedMiddleware, uploadDisk.single("file"), uploadFile);

export default routerUpload;
