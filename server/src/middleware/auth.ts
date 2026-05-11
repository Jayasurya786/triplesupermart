import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "../utils/apiError";
import type { Role } from "../constants/roles";

interface TokenPayload {
  sub: string;
  role: Role;
  customerId?: string;
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    return next(new ApiError(401, "Missing access token"));
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as TokenPayload;
    req.user = {
      id: payload.sub,
      role: payload.role,
      customerId: payload.customerId,
    };
    return next();
  } catch {
    return next(new ApiError(401, "Invalid access token"));
  }
}
