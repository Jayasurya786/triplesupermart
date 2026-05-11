import { StatCard } from "@/components/ui/StatCard";

interface AnalyticsOverviewProps {
  activeMembers: number;
  monthlyRedemptions: number;
  offerEngagementPct: number;
  activeOffers: number;
  totalCampaigns: number;
}

const numberFmt = new Intl.NumberFormat("en-US");

export function AnalyticsOverview({
  activeMembers,
  monthlyRedemptions,
  offerEngagementPct,
  activeOffers,
  totalCampaigns,
}: AnalyticsOverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard label="Active Members" value={numberFmt.format(activeMembers)} />
      <StatCard label="Monthly Redemptions" value={numberFmt.format(monthlyRedemptions)} />
      <StatCard label="Offer Engagement" value={`${offerEngagementPct.toFixed(1)}%`} />
      <StatCard label="Active Offers" value={numberFmt.format(activeOffers)} />
      <StatCard label="Reward Campaigns" value={numberFmt.format(totalCampaigns)} />
    </div>
  );
}
