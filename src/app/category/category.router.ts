import { Router } from "express";
import {
  GetAllCategories,
  GetOneCategory,
  CreateOneCategory,
  UpdateOneCategory,
  DeleteOneCategory,
} from "./category.controller";

const routerCategory = Router();

routerCategory.route("/").get(GetAllCategories);

routerCategory.route("/:id").get(GetOneCategory);

routerCategory.route("/").post(CreateOneCategory);

routerCategory.route("/:id").put(UpdateOneCategory);

routerCategory.route("/:id").delete(DeleteOneCategory);

export default routerCategory;
