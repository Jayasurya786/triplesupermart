import { ApiError } from "../utils/apiError";
import * as customerRepository from "../repositories/customerRepository";
import { loyaltyConfigRepository } from "../repositories/loyaltyConfigRepository";
import { rewardCampaignRepository } from "../repositories/rewardCampaignRepository";
import { redeemedRewardRepository } from "../repositories/redeemedRewardRepository";
import { createRedeemSuccessNotification } from "./notificationService";

export async function getStatus(customerId?: string) {
  if (!customerId) {
    throw new ApiError(400, "Customer ID is required");
  }

  const customer = await customerRepository.findByCustomerId(customerId);
  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  return {
    customerId: customer.customerId,
    tier: customer.tier,
    points: customer.points,
  };
}

export async function adjustPoints(customerId: string, points: number) {
  const customer = await customerRepository.adjustPoints(customerId, points);
  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  return customer;
}

export async function getConfig() {
  return loyaltyConfigRepository.findOne();
}

export async function updateConfig(data: Partial<{
  pointsPerDollar: number;
  redemptionStep: number;
  welcomeBonus: number;
  birthdayBonus: number;
}>) {
  if (data.pointsPerDollar !== undefined && data.pointsPerDollar <= 0) {
    throw new ApiError(400, "Points per dollar must be greater than zero");
  }

  if (data.redemptionStep !== undefined && data.redemptionStep <= 0) {
    throw new ApiError(400, "Redemption step must be greater than zero");
  }

  return loyaltyConfigRepository.update(data);
}

export async function redeemReward(customerId: string, campaignId: string) {
  // Get customer
  const customer = await customerRepository.findByCustomerId(customerId);
  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  // Get campaign
  const campaign = await rewardCampaignRepository.findById(campaignId);
  if (!campaign) {
    throw new ApiError(404, "Reward campaign not found");
  }

  if (!campaign.active) {
    throw new ApiError(400, "Reward campaign is not active");
  }

  // Check if customer has enough points
  if (customer.points < campaign.pointsRequired) {
    throw new ApiError(400, "Insufficient points for this reward");
  }

  // Check if campaign has expired
  if (new Date(campaign.expiryDate) < new Date()) {
    throw new ApiError(400, "Reward campaign has expired");
  }

  // Deduct points from customer
  await customerRepository.adjustPoints(customerId, -campaign.pointsRequired);

  // Calculate expiry date (30 days from now for redeemed rewards)
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);

  // Create redeemed reward record
  const redeemedReward = await redeemedRewardRepository.create({
    customerId,
    campaignTitle: campaign.title,
    pointsUsed: campaign.pointsRequired,
    expiryDate,
  });

  const remainingPoints = customer.points - campaign.pointsRequired;

  // Fire-and-forget notification for portal updates
  try {
    await createRedeemSuccessNotification({
      customerId,
      campaignTitle: campaign.title,
      pointsUsed: campaign.pointsRequired,
      remainingPoints,
    });
  } catch {
    // Notification creation should not block redemption success
  }

  return {
    redeemedReward,
    remainingPoints,
  };
}
