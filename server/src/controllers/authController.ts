import { asyncHandler } from "../utils/asyncHandler";
import { env } from "../config/env";
import * as authService from "../services/authService";
import * as otpService from "../services/otpService";

function setRefreshCookie(res: { cookie: Function }, refreshToken?: string) {
  if (!refreshToken) return;
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: "lax",
    path: "/api/v1/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  setRefreshCookie(res, result.refreshToken);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  setRefreshCookie(res, result.refreshToken);
  res.status(200).json(result);
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.body?.refreshToken || req.cookies?.refreshToken;
  const result = await authService.refresh(token);
  setRefreshCookie(res, result.refreshToken);
  res.status(200).json(result);
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.body?.refreshToken || req.cookies?.refreshToken;
  await authService.logout(token);
  res.clearCookie("refreshToken", { path: "/api/v1/auth/refresh" });
  res.status(204).send();
});

export const requestOtp = asyncHandler(async (req, res) => {
  const result = await otpService.requestOtp(req.body.email, req.body.purpose);
  res.status(200).json(result);
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const result = await otpService.verifyOtp(req.body.email, req.body.code, req.body.purpose);
  res.status(200).json(result);
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body.email, req.body.code, req.body.password);
  res.status(200).json({ message: "Password updated" });
});
