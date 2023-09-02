import { Document, Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface UserDocument extends Document {
  name?: string;
  email: string;
  password: string;
  passwordChangedAt: Date;
  role: Role;
  verifyPassword: (password: string) => boolean;
  createToken: () => string;
}

export enum Role {
  USER = "user",
  ADMIN = "admin",
  GUEST = "guest",
}

const userSchema = new Schema<UserDocument>(
    {
        name: {
            type: String,
            required: [true, "Please tell us your name"],
        },
        email: {
            type: String,
            required: [true, "Please provide your email"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            minlength: 8,
            select: false,
        },
        passwordChangedAt: Date,
        role: {
            type: String,
            enum: Object.values(Role),
            default: Role.USER,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
}
);

userSchema.methods.verifyPassword = async function (password: string) {

    return await bcrypt.compare(password, this.password);
}

userSchema.methods.createToken = function () {

    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return token;
}

export const User = model<UserDocument>("User", userSchema);

