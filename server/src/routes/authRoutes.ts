import { Router } from "express";
import { authLimiter } from "../middleware/rateLimiter";
import { validateBody } from "../middleware/validate";
import {
  loginSchema,
  otpRequestSchema,
  otpVerifySchema,
  registerSchema,
  resetPasswordSchema,
} from "../validators/authValidators";
import {
  register,
  login,
  refresh,
  logout,
  requestOtp,
  verifyOtp,
  resetPassword,
} from "../controllers/authController";

export const authRoutes = Router();

authRoutes.post("/register", authLimiter, validateBody(registerSchema), register);
authRoutes.post("/login", authLimiter, validateBody(loginSchema), login);
authRoutes.post("/refresh", refresh);
authRoutes.post("/logout", logout);
authRoutes.post("/otp/request", authLimiter, validateBody(otpRequestSchema), requestOtp);
authRoutes.post("/otp/verify", authLimiter, validateBody(otpVerifySchema), verifyOtp);
authRoutes.post("/password/reset", authLimiter, validateBody(resetPasswordSchema), resetPassword);
