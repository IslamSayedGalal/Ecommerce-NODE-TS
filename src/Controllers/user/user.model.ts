import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Role, UserInterface } from "../../types/user/user.interface";

const userSchema = new Schema<UserInterface>(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "Please provide your phone"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    profileImage: String,
    passwordChangedAt: Date,
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    active: {
      type: Boolean,
      default: true,
    },
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    addressesList: [
      {
        id: { type: Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],

    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, +process.env.BCRYPT_SALT);
  next();
});

userSchema.methods.comparePassword = async function ( this: UserInterface, password: string) {
  if (!this.password) return false;

  return await bcrypt.compare(password, this.password);
};

userSchema.methods.createToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};

export const UserModel = model<UserInterface>("User", userSchema);
