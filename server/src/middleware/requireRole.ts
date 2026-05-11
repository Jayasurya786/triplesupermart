import type { NextFunction, Request, Response } from "express";
import type { Role } from "../constants/roles";
import { ApiError } from "../utils/apiError";

export function requireRole(roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "Access denied"));
    }
    return next();
  };
}
