import { Document } from "mongoose";

export enum Role {
    USER = "user",
    ADMIN = "admin",
    GUEST = "guest",
}


export interface UserDocument extends Document {
    name: string;
    slug: string;
    email: string;
    phone: string;
    password: string;
    profileImage: string;
    passwordChangedAt: Date;
    role: Role;
    active: boolean;
    wishlist: string[];
    addressesList: {
      id: string;
      alias: string;
      details: string;
      phone: string;
      city: string;
      postalCode: string;
    }[];
    passwordResetCode: string;
    passwordResetExpires: Date;
    passwordResetVerified: boolean;
    comparePassword: (password: string) => boolean;
    createToken: () => string;
}