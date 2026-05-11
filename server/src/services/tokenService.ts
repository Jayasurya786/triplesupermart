import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { durationToMs } from "../utils/time";
import { ApiError } from "../utils/apiError";
import * as refreshTokenRepository from "../repositories/refreshTokenRepository";
import * as userRepository from "../repositories/userRepository";
import type { Role } from "../constants/roles";

interface TokenUser {
  id: string;
  role: Role;
  customerId?: string;
}

export async function issueTokens(user: TokenUser) {
  const accessToken = jwt.sign(
    { sub: user.id, role: user.role, customerId: user.customerId },
    env.jwtSecret,
    { expiresIn: env.jwtAccessExpires as SignOptions["expiresIn"] }
  );

  const refreshToken = jwt.sign({ sub: user.id }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpires as SignOptions["expiresIn"],
  });

  const expiresAt = new Date(Date.now() + durationToMs(env.jwtRefreshExpires, 7 * 24 * 60 * 60 * 1000));
  await refreshTokenRepository.create({ userId: user.id, token: refreshToken, expiresAt });

  return { accessToken, refreshToken };
}

export async function rotateRefreshToken(refreshToken: string) {
  const stored = await refreshTokenRepository.findValid(refreshToken);
  if (!stored) {
    throw new ApiError(401, "Invalid refresh token");
  }

  let payload: { sub: string };
  try {
    payload = jwt.verify(refreshToken, env.jwtRefreshSecret) as { sub: string };
  } catch {
    throw new ApiError(401, "Invalid refresh token");
  }

  const user = await userRepository.findById(payload.sub);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await refreshTokenRepository.revoke(refreshToken);
  const userId = user.id ?? user._id.toString();
  return issueTokens({ id: userId, role: user.role, customerId: user.customerId });
}

export async function revokeRefreshToken(refreshToken: string) {
  await refreshTokenRepository.revoke(refreshToken);
}
