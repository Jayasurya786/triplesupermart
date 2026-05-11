import { GlassCard } from "@/components/ui/GlassCard";

const tiers = [
  { name: "Fresh", points: "0 - 2,499", perks: "Starter perks and weekly deals" },
  { name: "Prime", points: "2,500 - 7,499", perks: "Priority offers and birthday rewards" },
  { name: "Emerald", points: "7,500+", perks: "Exclusive events and premium service" },
];

export function LoyaltyTeaser() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {tiers.map((tier) => (
        <GlassCard key={tier.name}>
          <p className="text-xs uppercase tracking-wide text-brand-600">{tier.points}</p>
          <h3 className="mt-2 text-lg font-display text-brand-800">{tier.name} Tier</h3>
          <p className="mt-2 text-sm text-brand-700">{tier.perks}</p>
        </GlassCard>
      ))}
    </div>
  );
}
