import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import { UserModel } from "../user/user.model";
import { response } from "../../utils/Response";
import { ApiError } from "../../utils/ApiError";
import { sendEmail } from "../../utils/SendEmail";
import nodemailer from "nodemailer";

interface RegisterInterface {
  name: string;
  phone: string;
  email: string;
  password: string;
}

interface LoginInterface {
  username: string;
  password: string;
}

interface ForgetPasswordInterface {
  username: string;
}

export const register = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, phone, email, password } = req.body as RegisterInterface;

    const user = await UserModel.create({ name, phone, email, password });

    const token = user.createToken();

    const responseResult = response({
      data: { token },
      message: "register successfully",
      statusCode: StatusCodes.CREATED,
    });
    res.status(responseResult.statusCode).json(responseResult);
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

    const responseResult = response({
      data: { token },
      message: "login successfully",
      statusCode: StatusCodes.OK,
    });
    res.status(responseResult.statusCode).json(responseResult);
  }
);

// @desc    Forgot password
// @route   POST /api/v1/auth/forgetPassword
// @access  Public
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
    // try {
    //   // await sendEmail({
    //   //   email: user.email,
    //   //   subject: "Your Code For Reset Password (Valid For 5 min)",
    //   //   message: messageBody,
    //   // });

    //    // 1) Create Transporter (Service That Will Send Email like 'Gmail'. 'Mailgun, 'mialtrap', 'sendGrid')
    // const transporter = nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   port: Number(process.env.EMAIL_PORT),
    //   secure: true,
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // });

    // // 2) Define Email Options (Like From, To, Subject, Email Content)
    // const mailOption = {
    //     from: 'E-Commerce',
    //     to: user.email,
    //     subject: "Your Code For Reset Password (Valid For 5 min)",
    //     text: messageBody,
    // };

    // // Send Email
    // // await transporter.sendMail(mailOption);
    // await transporter.sendMail(mailOption);

    // } catch (err) {
    //   user.passwordResetCode = undefined;
    //   user.passwordResetExpires = undefined;
    //   user.passwordResetVerified = undefined;

    //   await user.save();
    //   return next(
    //     new ApiError(
    //       "There Is An Error In Sending Email",
    //       StatusCodes.INTERNAL_SERVER_ERROR
    //     )
    //   );
    // }
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    console.log(req.body);

    // 2) Define Email Options (Like From, To, Subject, Email Content)
    const mailOption = {
      name: req.body.name,
      from: req.body.from,
      to: process.env.EMAIL_USER,
      subject: ` ${req.body.subject}`,
      text: `from: ${req.body.from}
            \nMessage: ${req.body.text}
            \nPhone: ${req.body?.phone}
            \nOffer: ${req.body?.offer}
            \nSender: ${req.body.name} `,
    };

    // Send Email
    // await transporter.sendMail(mailOption);
    try {
      await transporter.sendMail(mailOption);
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

    const responseResult = response({
      data: { email: user.email },
      message: "Reset Code Send To Email",
      statusCode: StatusCodes.OK,
    });
    res.status(responseResult.statusCode).json(responseResult);
  }
);

// @desc    Verify Reset Code password
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
exports.verifyPasswordResetCode = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get User Based On Reset Code
    const hashedResetCode = crypto
      .createHash("sha256")
      .update(req.body.resetCode)
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

    res.status(200).json({ status: "Success" });
  }
);
