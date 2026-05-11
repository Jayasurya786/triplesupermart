import { asyncHandler } from "../utils/asyncHandler";
import { CustomerModel } from "../models/Customer";
import { RedeemedRewardModel } from "../models/RedeemedReward";
import { OfferModel } from "../models/Offer";
import { RewardCampaignModel } from "../models/RewardCampaign";
import { redeemedRewardRepository } from "../repositories/redeemedRewardRepository";

export const getAnalytics = asyncHandler(async (_req, res) => {
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWindow = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    activeMembers,
    monthlyRedemptions,
    monthlyUniqueRedeemers,
    activeOffers,
    totalCampaigns,
    monthlyMembers,
    monthlyRedemptionStats,
    campaignPerformance,
    baseMembers,
  ] = await Promise.all([
    CustomerModel.countDocuments(),
    RedeemedRewardModel.countDocuments({ redeemedDate: { $gte: startOfCurrentMonth } }),
    RedeemedRewardModel.distinct("customerId", { redeemedDate: { $gte: startOfCurrentMonth } }),
    OfferModel.countDocuments({ active: true }),
    RewardCampaignModel.countDocuments(),
    CustomerModel.aggregate<{ month: string; count: number }>([
      { $match: { createdAt: { $gte: startOfWindow } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, month: "$_id", count: 1 } },
      { $sort: { month: 1 } },
    ]),
    RedeemedRewardModel.aggregate<{ month: string; redemptions: number; uniqueRedeemers: number }>([
      { $match: { redeemedDate: { $gte: startOfWindow } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$redeemedDate" } },
          redemptions: { $sum: 1 },
          uniqueCustomers: { $addToSet: "$customerId" },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          redemptions: 1,
          uniqueRedeemers: { $size: "$uniqueCustomers" },
        },
      },
      { $sort: { month: 1 } },
    ]),
    RedeemedRewardModel.aggregate<{ title: string; redemptions: number }>([
      {
        $group: {
          _id: "$campaignTitle",
          redemptions: { $sum: 1 },
        },
      },
      { $sort: { redemptions: -1 } },
      { $limit: 6 },
      { $project: { _id: 0, title: "$_id", redemptions: 1 } },
    ]),
    CustomerModel.countDocuments({ createdAt: { $lt: startOfWindow } }),
  ]);

  const monthKeys = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const monthLabel = (key: string) => {
    const [year, month] = key.split("-").map(Number);
    return new Date(year, (month ?? 1) - 1, 1).toLocaleString("en-US", { month: "short" });
  };

  const memberMap = new Map(monthlyMembers.map((item) => [item.month, item.count]));
  const redemptionMap = new Map(monthlyRedemptionStats.map((item) => [item.month, item.redemptions]));
  const uniqueRedeemerMap = new Map(monthlyRedemptionStats.map((item) => [item.month, item.uniqueRedeemers]));

  let runningMembers = baseMembers;
  const membersByMonth = monthKeys.map((key) => {
    runningMembers += memberMap.get(key) ?? 0;
    return { month: monthLabel(key), count: runningMembers };
  });

  const redemptionsByMonth = monthKeys.map((key) => ({
    month: monthLabel(key),
    count: redemptionMap.get(key) ?? 0,
  }));

  const engagementByMonth = monthKeys.map((key, index) => {
    const uniqueRedeemers = uniqueRedeemerMap.get(key) ?? 0;
    const membersForMonth = membersByMonth[index]?.count ?? 0;
    const pct = membersForMonth > 0 ? Number(((uniqueRedeemers / membersForMonth) * 100).toFixed(1)) : 0;
    return { month: monthLabel(key), pct };
  });

  const offerEngagementPct =
    activeMembers > 0 ? Number(((monthlyUniqueRedeemers.length / activeMembers) * 100).toFixed(1)) : 0;

  res.status(200).json({
    summary: {
      activeMembers,
      monthlyRedemptions,
      offerEngagementPct,
      activeOffers,
      totalCampaigns,
    },
    trends: {
      membersByMonth,
      redemptionsByMonth,
      engagementByMonth,
    },
    campaignPerformance,
  });
});

export const getRedeemedRewards = asyncHandler(async (req, res) => {
  const {
    limit = 50,
    offset = 0,
    customerId,
    campaignTitle,
    status,
    redeemedFrom,
    redeemedTo,
    sortBy = 'redeemedDate',
    sortOrder = 'desc'
  } = req.query;

  const options = {
    limit: parseInt(limit as string, 10),
    offset: parseInt(offset as string, 10),
    customerId: customerId as string,
    campaignTitle: campaignTitle as string,
    status: status as string,
    redeemedFrom: redeemedFrom ? new Date(redeemedFrom as string) : undefined,
    redeemedTo: redeemedTo ? new Date(redeemedTo as string) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as 'asc' | 'desc'
  };

  const { rewards, total } = await redeemedRewardRepository.findAll(options);
  const customerIds = Array.from(new Set(rewards.map((reward) => reward.customerId)));
  const customers = await CustomerModel.find({ customerId: { $in: customerIds } }).select("customerId name email phone");
  const customerMap = new Map(customers.map((customer) => [customer.customerId, customer]));

  const rewardsWithCustomers = rewards.map((reward) => ({
    ...reward.toObject(),
    customer: customerMap.get(reward.customerId)
      ? {
          name: customerMap.get(reward.customerId)?.name ?? "Unknown Customer",
          email: customerMap.get(reward.customerId)?.email,
          phone: customerMap.get(reward.customerId)?.phone ?? "",
        }
      : undefined,
  }));

  res.status(200).json({
    rewards: rewardsWithCustomers,
    total,
    limit: options.limit,
    offset: options.offset
  });
});

export const listStaff = asyncHandler(async (_req, res) => {
  res.status(200).json({ staff: [] });
});
