import { useEffect, useState } from "react";
import { Gift, Sparkles, TrendingUp, ArrowRight, Clock, Diamond, Star, Zap, Leaf, Package } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import Loader from "@/components/ui/Loader";
import { apiFetch } from "@/api/client";

interface RewardCampaign {
  _id: string;
  title: string;
  description: string;
  pointsRequired: number;
  discount: number;
  expiryDate: string;
  badge: "hot" | "new" | "limited";
  icon: string;
  bgColor: string;
}

interface RedeemedReward {
  _id: string;
  customerId: string;
  campaignTitle: string;
  pointsUsed: number;
  redeemedDate: string;
  expiryDate: string;
  status: "active" | "expired" | "used";
}

interface LoyaltyStatus {
  customerId: string;
  tier: string;
  points: number;
}

const tierGoals = {
  Fresh: 2500,
  Prime: 7500,
  Emerald: Infinity,
};

const getIconComponent = (icon: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    "🎁": <Gift className="h-6 w-6" />,
    "💎": <Diamond className="h-6 w-6" />,
    "🌟": <Star className="h-6 w-6" />,
    "⚡": <Zap className="h-6 w-6" />,
    "🍃": <Leaf className="h-6 w-6" />,
    "📦": <Package className="h-6 w-6" />,
  };
  return iconMap[icon] || <Gift className="h-6 w-6" />;
};

export function PortalRewardsPage() {
  const [campaigns, setCampaigns] = useState<RewardCampaign[]>([]);
  const [redeemedRewards, setRedeemedRewards] = useState<RedeemedReward[]>([]);
  const [loyaltyStatus, setLoyaltyStatus] = useState<LoyaltyStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchAllData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [campaignsData, rewardsData, statusData] = await Promise.all([
          apiFetch<{ campaigns: RewardCampaign[] }>("/loyalty/campaigns"),
          apiFetch<{ rewards: RedeemedReward[] }>("/loyalty/redeemed"),
          apiFetch<{ status: LoyaltyStatus }>("/loyalty/status"),
        ]);

        if (active) {
          setCampaigns(campaignsData.campaigns);
          setRedeemedRewards(rewardsData.rewards);
          setLoyaltyStatus(statusData.status);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to fetch rewards data");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchAllData();
    return () => {
      active = false;
    };
  }, []);

  const currentPoints = loyaltyStatus?.points ?? 0;
  const tierGoal = loyaltyStatus ? tierGoals[loyaltyStatus.tier as keyof typeof tierGoals] : tierGoals.Fresh;
  const pointsToNextTier = tierGoal === Infinity ? 0 : Math.max(0, tierGoal - currentPoints);

  const totalRedeemed = redeemedRewards.length;
  const tierLabel = loyaltyStatus?.tier ?? "Fresh";

  const canRedeem = (pointsRequired: number) => currentPoints >= pointsRequired;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.32em] text-brand-600">Rewards</p>
        <h2 className="text-2xl sm:text-3xl font-display text-brand-900">Discover your loyalty benefits</h2>
        <p className="max-w-2xl text-sm text-slate-600">Browse active campaigns, redeem your latest rewards, and track your points growth.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <GlassCard>
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 p-4 w-fit">
              <Sparkles className="h-6 w-6 text-brand-700" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Points Balance</p>
              <p className="mt-3 text-3xl sm:text-4xl font-bold text-brand-900 break-words">{currentPoints.toLocaleString()}</p>
              <p className="mt-2 text-xs text-slate-600">Available to redeem</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 p-4 w-fit">
              <TrendingUp className="h-6 w-6 text-emerald-700" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Your Tier</p>
              <p className="mt-3 text-3xl sm:text-4xl font-bold text-brand-900 break-words">{tierLabel}</p>
              <p className="mt-2 text-xs text-slate-600">{pointsToNextTier === 0 ? "Highest tier unlocked" : `${pointsToNextTier.toLocaleString()} pts to next`}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-fuchsia-100 to-fuchsia-50 p-4 w-fit">
              <Gift className="h-6 w-6 text-fuchsia-700" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Redeemed</p>
              <p className="mt-3 text-3xl sm:text-4xl font-bold text-brand-900">{totalRedeemed}</p>
              <p className="mt-2 text-xs text-slate-600">Total rewards claimed</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-white p-5 text-sm text-rose-700 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <p>{error}</p>
          </div>
        </div>
      )}

      <GlassCard>
        <div className="space-y-6">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Tier Progression</p>
              <h3 className="mt-2 text-2xl font-bold text-brand-900">{tierLabel} member journey</h3>
            </div>
            <div className="max-w-full rounded-full bg-gradient-to-br from-brand-100 to-emerald-100 px-4 py-2 inline-flex items-center gap-2">
              <span className="text-xs font-bold text-brand-700">
                {pointsToNextTier === 0 ? "🏆 Top Tier!" : `${pointsToNextTier.toLocaleString()}`}
              </span>
              {pointsToNextTier > 0 && <span className="text-xs text-slate-600">points left</span>}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col items-start gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
              <span className="font-semibold text-slate-900 break-words">{currentPoints.toLocaleString()} / {tierGoal === Infinity ? "∞" : tierGoal.toLocaleString()} points</span>
              <span className="text-xs font-semibold text-brand-600">{tierGoal === Infinity ? "100%" : `${Math.min(100, Math.round((currentPoints / tierGoal) * 100))}%`}</span>
            </div>
            <div className="relative h-4 overflow-hidden rounded-full bg-gradient-to-r from-slate-100 to-slate-50 shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-brand-600 via-emerald-500 to-brand-500 shadow-lg transition-all duration-500 ease-out" 
                style={{ width: `${tierGoal === Infinity ? 100 : Math.min(100, Math.round((currentPoints / tierGoal) * 100))}%` }} 
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 flex items-start gap-3">
              <div className="rounded-xl bg-brand-100 p-2.5 text-brand-600 flex-shrink-0">
                <ArrowRight className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-900">Earn faster</p>
                <p className="text-xs text-slate-600 mt-1">Every purchase brings you closer to rewards.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 flex items-start gap-3">
              <div className="rounded-xl bg-slate-100 p-2.5 text-slate-600 flex-shrink-0">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-900">Check expiry</p>
                <p className="text-xs text-slate-600 mt-1">Redeem before campaigns expire.</p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="space-y-6">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Active Campaigns</p>
              <h3 className="mt-2 text-2xl font-bold text-brand-900">Rewards ready for you</h3>
            </div>
            <div className="rounded-full bg-gradient-to-br from-fuchsia-100 to-rose-100 p-3">
              <Gift className="h-5 w-5 text-fuchsia-700" />
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : campaigns.length === 0 ? (
            <div className="py-12 text-center">
              <Gift className="h-8 w-8 mx-auto mb-3 text-slate-300" />
              <p className="text-slate-600 font-medium">No active campaigns right now.</p>
              <p className="text-xs text-slate-500 mt-2">Check back soon for new rewards!</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => {
                const available = canRedeem(campaign.pointsRequired);
                return (
                  <div
                    key={campaign._id}
                    className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ease-out transform hover:-translate-y-1.5 will-change-transform cursor-pointer ${
                      available
                        ? "border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-[0_10px_30px_-10px_rgba(5,150,105,0.2)]"
                        : "border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.1)]"
                    } hover:shadow-[0_20px_50px_-15px_rgba(${available ? "5,150,105" : "15,23,42"},0.3)]`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative p-5 flex flex-col h-full">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 ${
                          available 
                            ? "bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-700 group-hover:shadow-lg group-hover:shadow-emerald-200"
                            : "bg-gradient-to-br from-slate-100 to-slate-50 text-slate-500"
                        }`}>
                          {getIconComponent(campaign.icon)}
                        </div>
                        {campaign.badge && (
                          <div className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-[0.1em] ${
                            campaign.badge === "hot"
                              ? "bg-rose-100 text-rose-700"
                              : campaign.badge === "new"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}>
                            {campaign.badge}
                          </div>
                        )}
                      </div>

                      <div className="flex-grow">
                        <h4 className={`font-bold text-base leading-snug line-clamp-2 ${available ? "text-slate-900" : "text-slate-700"}`}>
                          {campaign.title}
                        </h4>
                        <p className="text-xs text-slate-600 mt-2 line-clamp-2">{campaign.description}</p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-200/50 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                        <div className="text-xs">
                          <p className="text-slate-500 font-medium">Points required</p>
                          <p className={`font-bold text-sm mt-1 ${available ? "text-emerald-700" : "text-slate-700"}`}>
                            {campaign.pointsRequired.toLocaleString()}
                          </p>
                        </div>
                        <div className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-300 ${
                          available
                            ? "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200"
                            : "bg-slate-100 text-slate-500"
                        }`}>
                          {available ? "✓ Ready" : "🔒 Locked"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </GlassCard>

      {redeemedRewards.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Recent Redemptions</p>
              <h3 className="mt-2 text-2xl font-bold text-brand-900">Your claimed rewards</h3>
            </div>
            <div className="rounded-full bg-gradient-to-br from-brand-100 to-emerald-100 px-4 py-2">
              <span className="text-sm font-bold text-brand-700">{redeemedRewards.length} claimed</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {redeemedRewards.map((reward) => (
              <GlassCard key={reward._id}>
                <div className="flex flex-col gap-4 h-full">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-grow">
                      <p className="font-bold text-brand-900 line-clamp-2">{reward.campaignTitle}</p>
                      <p className="text-xs text-slate-600 mt-2">Redeemed on {new Date(reward.redeemedDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <Gift className="h-5 w-5 text-fuchsia-600" />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/50 flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs font-semibold text-slate-600">Points Used</span>
                    <span className="text-sm font-bold text-brand-700">{reward.pointsUsed.toLocaleString()} pts</span>
                  </div>

                  <div className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] self-start mt-auto ${
                    reward.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : reward.status === "used"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    {reward.status === "active" ? "✓ Active" : reward.status === "used" ? "✓ Used" : "Expired"}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
