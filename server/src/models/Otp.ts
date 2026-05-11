import { Schema, model, type Document } from "mongoose";

interface OtpDocument extends Document {
  email: string;
  code: string;
  purpose: string;
  expiresAt: Date;
  consumedAt?: Date;
}

const OtpSchema = new Schema<OtpDocument>(
  {
    email: { type: String, required: true },
    code: { type: String, required: true },
    purpose: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    consumedAt: { type: Date },
  },
  { timestamps: true }
);

export const OtpModel = model<OtpDocument>("Otp", OtpSchema);
