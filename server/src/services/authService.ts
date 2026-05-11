import bcrypt from "bcryptjs";
import { ApiError } from "../utils/apiError";
import * as userRepository from "../repositories/userRepository";
import * as customerService from "./customerService";
import * as tokenService from "./tokenService";
import * as otpService from "./otpService";
import { createWelcomeNotification } from "./notificationService";

interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export async function register(input: RegisterInput) {
  const existing = await userRepository.findByEmail(input.email);
  if (existing) {
    throw new ApiError(409, "Email already registered");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const customer = await customerService.createCustomer({
    name: input.name,
    email: input.email,
    phone: input.phone,
  });

  const user = await userRepository.create({
    name: input.name,
    email: input.email,
    phone: input.phone,
    passwordHash,
    role: "customer",
    customerId: customer.customerId,
  });

  // Fire-and-forget customer welcome notification
  try {
    await createWelcomeNotification(customer.customerId);
  } catch {
    // Notification creation should not block registration flow
  }

  const userId = user.id ?? user._id.toString();
  const tokens = await tokenService.issueTokens({
    id: userId,
    role: user.role,
    customerId: user.customerId,
  });

  return {
    user: userRepository.sanitizeUser(user),
    ...tokens,
  };
}

export async function login(input: LoginInput) {
  const user = await userRepository.findByEmail(input.email);
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const userId = user.id ?? user._id.toString();
  const tokens = await tokenService.issueTokens({
    id: userId,
    role: user.role,
    customerId: user.customerId,
  });
  return {
    user: userRepository.sanitizeUser(user),
    ...tokens,
  };
}

export async function refresh(refreshToken?: string) {
  if (!refreshToken) {
    throw new ApiError(400, "Missing refresh token");
  }

  return tokenService.rotateRefreshToken(refreshToken);
}

export async function logout(refreshToken?: string) {
  if (!refreshToken) return;
  await tokenService.revokeRefreshToken(refreshToken);
}

export async function resetPassword(email: string, code: string, password: string) {
  await otpService.verifyOtp(email, code, "password_reset");
  const user = await userRepository.findByEmail(email);
  if (!user) throw new ApiError(404, "User not found");
  const passwordHash = await bcrypt.hash(password, 10);
  const userId = user.id ?? user._id.toString();
  await userRepository.updatePassword(userId, passwordHash);
}
