import { asyncHandler } from "../utils/asyncHandler";
import * as loyaltyService from "../services/loyaltyService";
import { rewardCampaignRepository } from "../repositories/rewardCampaignRepository";
import { redeemedRewardRepository } from "../repositories/redeemedRewardRepository";
import { ApiError } from "../utils/apiError";

export const getLoyaltyStatus = asyncHandler(async (req, res) => {
  const status = await loyaltyService.getStatus(req.user?.customerId);
  res.status(200).json({ status });
});

export const adjustPoints = asyncHandler(async (req, res) => {
  const result = await loyaltyService.adjustPoints(req.body.customerId, req.body.points);
  res.status(200).json({ result });
});

export const getLoyaltyConfig = asyncHandler(async (_req, res) => {
  const config = await loyaltyService.getConfig();
  res.status(200).json({ config });
});

export const updateLoyaltyConfig = asyncHandler(async (req, res) => {
  const config = await loyaltyService.updateConfig(req.body);
  res.status(200).json({ config });
});

export const createRewardCampaign = asyncHandler(async (req, res) => {
  const campaign = await rewardCampaignRepository.create(req.body);
  res.status(201).json({ campaign });
});

export const updateRewardCampaign = asyncHandler(async (req, res) => {
  const campaign = await rewardCampaignRepository.update(req.params.campaignId, req.body);
  if (!campaign) {
    throw new ApiError(404, "Reward campaign not found");
  }
  res.status(200).json({ campaign });
});

export const deleteRewardCampaign = asyncHandler(async (req, res) => {
  const campaign = await rewardCampaignRepository.delete(req.params.campaignId);
  if (!campaign) {
    throw new ApiError(404, "Reward campaign not found");
  }
  res.status(200).json({ message: "Campaign deactivated" });
});

export const getRewardCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await rewardCampaignRepository.findAll();
  res.status(200).json({ campaigns });
});

export const getRedeemedRewards = asyncHandler(async (req, res) => {
  const customerId = req.user?.customerId;
  if (!customerId) {
    res.status(400).json({ message: "Customer ID required" });
    return;
  }
  
  const rewards = await redeemedRewardRepository.findByCustomerId(customerId);
  res.status(200).json({ rewards });
});

export const redeemReward = asyncHandler(async (req, res) => {
  const customerId = req.body.customerId || req.user?.customerId;
  if (!customerId) {
    res.status(400).json({ message: "Customer ID required" });
    return;
  }

  const result = await loyaltyService.redeemReward(customerId, req.body.campaignId);
  res.status(200).json({ result });
});
