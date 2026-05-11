import { OtpModel } from "../models/Otp";

export async function create(input: {
  email: string;
  code: string;
  purpose: string;
  expiresAt: Date;
}) {
  return OtpModel.create(input);
}

export async function findValid(email: string, code: string, purpose: string) {
  return OtpModel.findOne({
    email,
    code,
    purpose,
    consumedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  }).exec();
}

export async function consume(id: string) {
  return OtpModel.findByIdAndUpdate(id, { consumedAt: new Date() }, { new: true }).exec();
}
