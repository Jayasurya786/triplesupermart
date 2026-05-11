import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Gift, ShieldCheck, CreditCard, TrendingUp, ArrowRight, CalendarDays } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { GlassCard } from "@/components/ui/GlassCard";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { apiFetch } from "@/api/client";

interface LoyaltyStatus {
  customerId: string;
  tier: string;
  points: number;
}

interface RedeemedReward {
  _id: string;
  campaignTitle: string;
  pointsUsed: number;
  redeemedDate: string;
  status: "active" | "expired" | "used";
}

const tierThresholds = [
  { tier: "Fresh", next: 2500 },
  { tier: "Prime", next: 7500 },
  { tier: "Emerald", next: Infinity },
];

function formatPoints(value: number) {
  return value.toLocaleString();
}

function getNextTier(tier: string) {
  return tierThresholds.find((entry) => entry.tier === tier) ?? tierThresholds[0];
}

export function PortalDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<LoyaltyStatus | null>(null);
  const [recentRewards, setRecentRewards] = useState<RedeemedReward[]>([]);
  const [campaignsCount, setCampaignsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
          const [statusRes, rewardsRes, campaignsRes] = await Promise.all([
            apiFetch<{ status: LoyaltyStatus }>("/loyalty/status"),
            apiFetch<{ rewards: RedeemedReward[] }>("/loyalty/redeemed"),
            apiFetch<{ campaigns: { _id: string }[] }>("/loyalty/campaigns"),
          ]);

          if (!active) return;
          setStatus(statusRes.status);
          setRecentRewards(rewardsRes.rewards.slice(0, 3));
          setCampaignsCount(Array.isArray(campaignsRes.campaigns) ? campaignsRes.campaigns.length : 0);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load loyalty data");
      } finally {
        if (!active) return;
        setLoading(false);
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, []);

  const currentPoints = status?.points ?? 0;
  const activeTier = status?.tier ?? "Fresh";
  const nextTier = getNextTier(activeTier);
  const progress = nextTier.next === Infinity ? 100 : Math.min(100, Math.round((currentPoints / nextTier.next) * 100));
  const pointsToNextTier = nextTier.next === Infinity ? 0 : Math.max(0, nextTier.next - currentPoints);

  const summaryCards = [
    {
      label: "Available Points",
      value: formatPoints(currentPoints),
      icon: <Sparkles className="h-5 w-5 text-brand-600" />,
      accent: "bg-brand-50 text-brand-700",
    },
    {
      label: "Current Tier",
      value: `${activeTier} Tier`,
      icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />,
      accent: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Rewards Redeemed",
      value: formatPoints(recentRewards.length),
      icon: <Gift className="h-5 w-5 text-fuchsia-600" />,
      accent: "bg-fuchsia-50 text-fuchsia-700",
    },
  ];

  const activityItems = [
    { title: "Grocery purchase", detail: "+320 pts", status: "success" },
    { title: "Redeemed reward", detail: "-1,500 pts", status: "neutral" },
    { title: "Birthday bonus", detail: "+100 pts", status: "success" },
  ];

  const heroSummary = useMemo(
    () => [
      {
        label: "Member ID",
        value: status?.customerId ?? user?.customerId ?? "TNS0000",
        icon: <CreditCard className="h-5 w-5 text-slate-700" />,
      },
      {
        label: "Next milestone",
        value: pointsToNextTier === 0 ? "Max tier reached" : `${formatPoints(pointsToNextTier)} pts left`,
        icon: <TrendingUp className="h-5 w-5 text-emerald-700" />,
      },
      {
        label: "Rewards available",
        value: campaignsCount.toString(),
        icon: <Gift className="h-5 w-5 text-fuchsia-700" />,
      },
    ],
    [pointsToNextTier, recentRewards.length, status?.customerId, user?.customerId]
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <GlassCard>
          <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Customer Portal</p>
                <h1 className="mt-3 text-2xl sm:text-3xl font-display text-brand-900">
                  Hi, {user?.name ?? "Valued Member"}.
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                  Your loyalty dashboard brings together your points, tier progress, rewards, and card details in one modern view.
                </p>
              </div>
              <div className="w-full md:w-auto rounded-3xl border border-brand-100 bg-brand-50/80 px-5 py-4 text-center shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-brand-600">Member ID</p>
                <p className="mt-2 text-lg font-semibold text-brand-900">{status?.customerId ?? user?.customerId ?? "TNS0000"}</p>
                <p className="mt-1 text-xs text-brand-600">Loyalty account</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {summaryCards.map((card) => (
                <div key={card.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${card.accent}`}>
                    {card.icon}
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.28em] text-slate-500">{card.label}</p>
                  <p className="mt-3 text-2xl sm:text-3xl font-semibold text-slate-900 break-words">{card.value}</p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard>
            <div className="space-y-4">
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-brand-600">Tier Progress</p>
                  <h2 className="mt-2 text-2xl font-semibold text-brand-900">{activeTier} Tier</h2>
                </div>
                <div className="max-w-full rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700 break-words">
                  {pointsToNextTier === 0 ? "Max tier reached" : `${formatPoints(pointsToNextTier)} pts to next`}
                </div>
              </div>

              <div className="rounded-3xl bg-slate-100 p-4">
                <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
                  <span>{formatPoints(currentPoints)} pts</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="grid gap-3">
                {heroSummary.map((item) => (
                  <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-3 text-brand-900">
                      {item.icon}
                      <div>
                        <p className="text-sm font-semibold">{item.label}</p>
                        <p className="text-xs text-slate-600">{item.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-brand-600">Latest Activity</p>
                  <h2 className="mt-2 text-xl font-semibold text-brand-900">Recent points history</h2>
                </div>
                <CalendarDays className="h-5 w-5 text-brand-600" />
              </div>

              <div className="space-y-3">
                {activityItems.map((item) => (
                  <div key={item.title} className="flex flex-col items-start gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <div>
                      <p className="text-sm font-semibold text-brand-900">{item.title}</p>
                      <p className="text-xs text-slate-600">{item.status === "success" ? "Completed" : "Updated"}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "success" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}`}>
                      {item.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <GlassCard>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Keep growing</p>
            <h2 className="mt-2 text-2xl font-semibold text-brand-900">Your loyalty journey is moving in the right direction.</h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              Earn more points with every visit, unlock higher-tier rewards, and redeem your best offers in one place.
            </p>
          </div>
          <button
            onClick={() => navigate('/portal/rewards')}
            className="inline-flex w-full sm:w-auto sm:shrink-0 items-center gap-3 rounded-2xl sm:rounded-full border border-brand-100 bg-brand-50 px-4 py-3 shadow-sm hover:brightness-105 transition"
            aria-label="See available rewards"
          >
            <Gift className="h-5 w-5 text-fuchsia-600" />
            <div className="text-left">
              <p className="text-sm font-semibold text-brand-900">See available rewards</p>
              <p className="text-xs text-slate-600">Tap into exclusive member offers.</p>
            </div>
          </button>
        </div>
      </GlassCard>

      {error && (
        <ErrorMessage error={error} title="Unable to load dashboard" className="mt-6" />
      )}
    </div>
  );
}
