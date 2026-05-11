import crypto from "crypto";
import { env } from "../config/env";
import { ApiError } from "../utils/apiError";
import * as otpRepository from "../repositories/otpRepository";
import * as userRepository from "../repositories/userRepository";

type OtpPurpose = "registration" | "password_reset";

export async function requestOtp(email: string, purpose: OtpPurpose) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const code = String(crypto.randomInt(100000, 1000000));
  const expiresAt = new Date(Date.now() + env.otpTtlMinutes * 60 * 1000);

  await otpRepository.create({ email, code, purpose, expiresAt });
  return { message: "OTP generated" };
}

export async function verifyOtp(email: string, code: string, purpose: OtpPurpose) {
  const record = await otpRepository.findValid(email, code, purpose);
  if (!record) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  await otpRepository.consume(record.id);
  return { message: "OTP verified" };
}
