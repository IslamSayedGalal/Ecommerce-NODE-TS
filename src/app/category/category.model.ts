import { Schema, model } from "mongoose";
import { CategoryInterface } from "./category.interface";



const categorySchema = new Schema<CategoryInterface>(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);


export const CategoryModel = model<CategoryInterface>("Category", categorySchema);
