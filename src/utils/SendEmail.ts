import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import nodemailer from "nodemailer";

export const sendEmail = async( {email, subject, message}: any)=>{

    // 1) Create Transporter (Service That Will Send Email like 'Gmail'. 'Mailgun, 'mialtrap', 'sendGrid')
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });


    // 2) Define Email Options (Like From, To, Subject, Email Content)
    const mailOption = {
        from: 'E-Commerce',
        to: email,
        subject: subject,
        text: message,
    };

    // Send Email
    // await transporter.sendMail(mailOption);
    try {
        await transporter.sendMail(mailOption);
    } catch (err) {
        console.log("error")
    }
}
