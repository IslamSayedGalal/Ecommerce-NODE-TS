import { check, body } from "express-validator";
import { validate } from "../../middleWares/validate.middleWare";
import { UserModel } from "../user/user.model";
import slugify from "slugify";
import validator from "validator";

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
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("is required")
    .isString()
    .withMessage("must be string")
    .isLength({ min: 8, max: 50 })
    .withMessage("must be between 8 to 50 characters"),
  validate,
];

export const loginValidator = [
  check("username")
    .notEmpty()
    .withMessage("is required")
    .custom(async (value) => {
      const email = validator.isEmail(value);
      const phone = validator.isMobilePhone(value, "ar-EG");
      if (!email && !phone) {
        return Promise.reject("not valid format");
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("is required")
    .isString()
    .withMessage("must be string")
    .isLength({ min: 8, max: 50 })
    .withMessage("must be between 8 to 50 characters"),
  validate,
];

export const forgetPasswordValidator = [
  check("username")
    .notEmpty()
    .withMessage("is required")
    .custom(async (value) => {
      const email = validator.isEmail(value);
      const phone = validator.isMobilePhone(value, "ar-EG");
      if (!email && !phone) {
        return Promise.reject("not valid format");
      }
      return true;
    }),
  validate,
];

export const verifyPasswordResetCodeValidator = [
  check("resetCode")
    .notEmpty()
    .withMessage("is required")
    .isString()
    .withMessage("must be string")
    .isLength({ min: 6, max: 6 })
    .withMessage("must be 6 characters"),
  validate,
];

export const resetPasswordValidator = [
  check("username")
    .notEmpty()
    .withMessage("is required")
    .custom(async (value) => {
      const email = validator.isEmail(value);
      const phone = validator.isMobilePhone(value, "ar-EG");
      if (!email && !phone) {
        return Promise.reject("not valid format");
      }
      return true;
    }),
  check("newPassword")
    .notEmpty()
    .withMessage("is required")
    .isString()
    .withMessage("must be string")
    .isLength({ min: 8, max: 50 })
    .withMessage("must be between 8 to 50 characters"),
  validate,
];
