import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const otpRequestSchema = z.object({
  email: z.string().email(),
  purpose: z.enum(["registration", "password_reset"]),
});

export const otpVerifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  purpose: z.enum(["registration", "password_reset"]),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  password: z.string().min(8),
});
