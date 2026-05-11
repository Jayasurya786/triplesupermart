import { apiFetch } from "@/api/client";

export interface AdminAnalyticsResponse {
  summary: {
    activeMembers: number;
    monthlyRedemptions: number;
    offerEngagementPct: number;
    activeOffers: number;
    totalCampaigns: number;
  };
  trends: {
    membersByMonth: Array<{ month: string; count: number }>;
    redemptionsByMonth: Array<{ month: string; count: number }>;
    engagementByMonth: Array<{ month: string; pct: number }>;
  };
  campaignPerformance: Array<{ title: string; redemptions: number }>;
}

export async function getAdminAnalytics() {
  return apiFetch<AdminAnalyticsResponse>("/admin/analytics");
}
