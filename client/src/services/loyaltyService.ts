import { apiFetch } from "@/api/client";

export interface LoyaltyConfig {
  _id: string;
  pointsPerDollar: number;
  redemptionStep: number;
  welcomeBonus: number;
  birthdayBonus: number;
}

export interface RewardCampaignRecord {
  _id: string;
  title: string;
  description: string;
  pointsRequired: number;
  discount: number;
  expiryDate: string;
  badge: "hot" | "new" | "limited";
  icon: string;
  bgColor: string;
  active: boolean;
  createdAt?: string;
}

export async function getLoyaltyConfig() {
  return apiFetch<{ config: LoyaltyConfig }>("/loyalty/config");
}

export async function updateLoyaltyConfig(payload: Partial<Omit<LoyaltyConfig, "_id">>) {
  return apiFetch<{ config: LoyaltyConfig }>("/loyalty/config", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function adjustPoints(customerId: string, points: number) {
  return apiFetch<{ result: { _id: string; points: number } }>("/loyalty/adjust", {
    method: "POST",
    body: JSON.stringify({ customerId, points }),
  });
}

export async function listRewardCampaigns() {
  return apiFetch<{ campaigns: RewardCampaignRecord[] }>("/loyalty/campaigns");
}

export async function createRewardCampaign(payload: {
  title: string;
  description: string;
  pointsRequired: number;
  discount: number;
  expiryDate: string;
  badge: "hot" | "new" | "limited";
  icon: string;
  bgColor: string;
  active?: boolean;
}) {
  return apiFetch<{ campaign: RewardCampaignRecord }>("/loyalty/campaigns", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateRewardCampaign(campaignId: string, payload: Partial<Omit<RewardCampaignRecord, "_id">>) {
  return apiFetch<{ campaign: RewardCampaignRecord }>(`/loyalty/campaigns/${campaignId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteRewardCampaign(campaignId: string) {
  return apiFetch<{ message: string }>(`/loyalty/campaigns/${campaignId}`, {
    method: "DELETE",
  });
}

export async function redeemReward(customerId: string, campaignId: string) {
  return apiFetch<{ result: { redeemedReward: any; remainingPoints: number } }>("/loyalty/redeem", {
    method: "POST",
    body: JSON.stringify({ customerId, campaignId }),
  });
}
