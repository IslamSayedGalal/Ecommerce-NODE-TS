import { Router } from "express";
import { uploadImage, uploadFile } from "./upload.controller";
import { uploadDisk, uploadMemory } from "../../middleWares/upload.middleWare";
import { protectedMiddleWare } from "../../middleWares/protected.middleWare";

const routerUpload = Router();

// upload image
routerUpload.route("/image?").post( uploadMemory.single("image"), uploadImage);

// upload file
routerUpload.route("/file").post( protectedMiddleWare, uploadDisk.single("file"), uploadFile);

export default routerUpload;
