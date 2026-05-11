import { PageHeader } from "@/components/ui/PageHeader";
import OfferCard from "@/components/common/OfferCard";
import { Seo } from "@/seo/Seo";
import { Star, Gift, Users, Cake, type LucideIcon } from "lucide-react";

interface PerkItem {
  title: string;
  detail: string;
  icon: LucideIcon;
}

const perks: PerkItem[] = [
  {
    title: "Points System",
    detail: "Earn points on every in-store spend.",
    icon: Star,
  },
  {
    title: "Reward Campaigns",
    detail: "Targeted offers for seasonal campaigns.",
    icon: Gift,
  },
  {
    title: "Referral Rewards",
    detail: "Invite friends and unlock bonuses.",
    icon: Users,
  },
  {
    title: "Birthday Rewards",
    detail: "Celebrate with exclusive perks.",
    icon: Cake,
  },
];

export function LoyaltyPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 md:px-10 py-12 md:py-16">
      <Seo title="Loyalty Program" description="Points, tiers, and personalized rewards for members." />
      <PageHeader
        title="Loyalty Program"
        description="Flexible tiers, rewarding campaigns, and premium experiences designed for loyal shoppers."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {perks.map((perk) => (
          <OfferCard
            key={perk.title}
            title={perk.title}
            detail={perk.detail}
            icon={perk.icon}
          />
        ))}
      </div>
    </div>
  );
}
