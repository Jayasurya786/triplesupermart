import { Schema, model, type Document } from "mongoose";
import type { Role } from "../constants/roles";

export interface UserDocument extends Document {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: Role;
  customerId?: string;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, default: "customer" },
    customerId: { type: String },
  },
  { timestamps: true }
);

export const UserModel = model<UserDocument>("User", UserSchema);
