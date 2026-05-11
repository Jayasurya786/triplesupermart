import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  getLoyaltyStatus,
  adjustPoints,
  getLoyaltyConfig,
  updateLoyaltyConfig,
  getRewardCampaigns,
  createRewardCampaign,
  updateRewardCampaign,
  deleteRewardCampaign,
  getRedeemedRewards,
  redeemReward,
} from "../controllers/loyaltyController";
import { requireRole } from "../middleware/requireRole";

export const loyaltyRoutes = Router();

loyaltyRoutes.get("/status", authenticate, getLoyaltyStatus);
loyaltyRoutes.post("/adjust", authenticate, requireRole(["admin", "staff"]), adjustPoints);
loyaltyRoutes.get("/campaigns", authenticate, getRewardCampaigns);
loyaltyRoutes.post("/campaigns", authenticate, requireRole(["admin", "staff"]), createRewardCampaign);
loyaltyRoutes.put("/campaigns/:campaignId", authenticate, requireRole(["admin", "staff"]), updateRewardCampaign);
loyaltyRoutes.delete("/campaigns/:campaignId", authenticate, requireRole(["admin", "staff"]), deleteRewardCampaign);
loyaltyRoutes.get("/config", authenticate, requireRole(["admin", "staff"]), getLoyaltyConfig);
loyaltyRoutes.put("/config", authenticate, requireRole(["admin", "staff"]), updateLoyaltyConfig);
loyaltyRoutes.get("/redeemed", authenticate, getRedeemedRewards);
loyaltyRoutes.post("/redeem", authenticate, redeemReward);
