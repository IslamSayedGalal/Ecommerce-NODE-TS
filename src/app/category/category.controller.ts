import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from "../../utils/factory";
import { CategoryModel } from "./category.model";

export const GetAllCategories = getAll(CategoryModel);
export const GetOneCategory = getOne(CategoryModel);
export const CreateOneCategory = createOne(CategoryModel);
export const UpdateOneCategory = updateOne(CategoryModel);
export const DeleteOneCategory = deleteOne(CategoryModel);


