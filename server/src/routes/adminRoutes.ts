import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";
import { getAnalytics, listStaff, getRedeemedRewards } from "../controllers/adminController";

export const adminRoutes = Router();

adminRoutes.use(authenticate, requireRole(["admin", "staff"]));
adminRoutes.get("/analytics", getAnalytics);
adminRoutes.get("/redemptions", getRedeemedRewards);
adminRoutes.get("/staff", listStaff);
