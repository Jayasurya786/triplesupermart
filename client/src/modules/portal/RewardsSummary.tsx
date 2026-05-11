import { StatCard } from "@/components/ui/StatCard";

export function RewardsSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard label="Available Points" value="12,480" />
      <StatCard label="Next Reward" value="$20 Voucher" />
      <StatCard label="Tier Progress" value="82%" />
    </div>
  );
}
