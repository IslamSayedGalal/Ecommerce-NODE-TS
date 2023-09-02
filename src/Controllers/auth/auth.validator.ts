import { check, body } from "express-validator";
import { validate } from "../../middleWares/validate";
import { UserModel } from "../user/user.model";
import slugify from "slugify";

export const registerValidator = [
  check("name")
    .notEmpty()
    .withMessage("is required")
    .isString()
    .withMessage("must be string")
    .isLength({ min: 3, max: 50 })
    .withMessage("must be between 3 to 50 characters")
    .trim(),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  check("phone")
    .notEmpty()
    .withMessage("is required")
    .isMobilePhone("ar-EG")
    .withMessage("Invalid Phone Number Accepted Only EGY Numbers")
    .custom(async (value) => {
      const user = await UserModel.findOne({ phone: value });
      if (user) {
        return Promise.reject("already used");
      }
    }),
  check("email")
    .notEmpty()
    .withMessage("is required")
    .isEmail()
    .withMessage("not valid format")
    .custom(async (value) => {
      const user = await UserModel.findOne({ email: value });
      if (user) {
        return Promise.reject("already used");
      }
    }),
  check("password")
    .notEmpty()
    .withMessage("is required")
    .isString()
    .withMessage("must be string")
    .isLength({ min: 6, max: 50 })
    .withMessage("must be between 6 to 50 characters"),
  validate,
];

// login using  (email or phone)
export const loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("is required")
    .isEmail()
    .withMessage("not valid format"),
  check("password")
    .notEmpty()
    .withMessage("is required")
    .isString()
    .withMessage("must be string")
    .isLength({ min: 6, max: 50 })
    .withMessage("must be between 6 to 50 characters"),
  validate,
];
