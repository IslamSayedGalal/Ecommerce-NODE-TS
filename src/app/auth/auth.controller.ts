import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import { UserModel } from "../user/user.model";
// import { response } from "../../utils/Response";
import { ApiError } from "../../utils/ApiError";
import { sendEmail } from "../../utils/SendEmail";
import {
  RegisterInterface,
  LoginInterface,
  ForgetPasswordInterface,
  VerifyPasswordResetCodeInterface,
  ResetPasswordInterface,
} from "./auth.interface";

export const register = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, phone, email, password } = req.body as RegisterInterface;

    const user = await UserModel.create({ name, phone, email, password });

    const token = user.createToken();

    res.status(StatusCodes.CREATED).json({
      message: "Register successfully",
      data: {
        token
      },
    });
  }
);

export const login = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body as LoginInterface;

    const user = await UserModel.findOne({
      $or: [{ email: username }, { phone: username }],
    }).select("password");

    if (!user) {
      return next(
        new ApiError("email or password not correct", StatusCodes.NOT_FOUND)
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(
        new ApiError("email or password not correct", StatusCodes.BAD_REQUEST)
      );
    }

    const token = user.createToken();

    res.status(StatusCodes.OK).json({
      message: "Login successfully",
      data: {
        token
      },
    });
  }
);

export const forgetPassword = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body as ForgetPasswordInterface;

    // 1) Get User By Email
    const user = await UserModel.findOne({
      $or: [{ email: username }, { phone: username }],
    });

    if (!user) {
      return next(
        new ApiError(
          `There Is No User With That ${req.body.username}`,
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 2) If user exist, Generate Hash Random Reset Code (6 digits), and save it in dataBase
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    // Save Hashed Password Reset Code Into DataBase
    user.passwordResetCode = hashedResetCode;

    // Add Expiration Time For Code Reset Password (5 min)
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetVerified = false;

    await user.save();

    // 3) send the reset code via email
    const messageBody = `Hi ${
      user.name.split(" ")[0]
    },\n Verification Code (${resetCode})`;

    // Send Email
    try {
      await sendEmail({
        email: user.email,
        subject: "Your Code For Reset Password (Valid For 5 min)",
        message: messageBody,
      });
    } catch (err) {
      user.passwordResetCode = undefined;
      user.passwordResetExpires = undefined;
      user.passwordResetVerified = undefined;

      await user.save();
      return next(
        new ApiError(
          "There Is An Error In Sending Email",
          StatusCodes.BAD_REQUEST
        )
      );
    }

    res.status(StatusCodes.OK).json({
      message: "Code Send Successfully",
      data: {
        email: user.email
      },
    });
  }
);

export const verifyPasswordResetCode = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { resetCode }: any = req.body as VerifyPasswordResetCodeInterface;
    // 1) Get User Based On Reset Code
    const hashedResetCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    const user = await UserModel.findOne({
      passwordResetCode: hashedResetCode,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new ApiError(
          `There Is No User With That ${req.body.username}`,
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 2) Reset Code Valid
    user.passwordResetVerified = true;
    await user.save();

    res.status(StatusCodes.OK).json({
      message: "Verified",
      data: {
        email: user.email
      },
    });
  }
);

export const resetPassword = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, newPassword }: any = req.body as ResetPasswordInterface;
    // 1) Get User Based On Email
    const user = await UserModel.findOne({
      $or: [{ email: username }, { phone: username }],
    });

    if (!user) {
      return next(
        new ApiError(
          `There Is No User With Email ${req.body.email}`,
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 2) Check If Reset Code Verified
    if (!user.passwordResetVerified) {
      return next(
        new ApiError("Reset Code Not Verified", StatusCodes.NOT_FOUND)
      );
    }

    user.password = newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    // 3) Generate Token
    const token = user.createToken();
    res.status(StatusCodes.OK).json({
      message: "Change Password Successfully",
      data: {
        token
      },
    });
  }
);


export const getMe = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(StatusCodes.OK).json({
      message: "Get Me Successfully",
      data: {
        user: req.user
      },
    });
  }
)

