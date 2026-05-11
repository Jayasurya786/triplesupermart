import { GlassCard } from "@/components/ui/GlassCard";

const highlights = [
  {
    title: "Personalized Engagement",
    description: "Segmented member journeys with tailored rewards and offers.",
  },
  {
    title: "In-Store Experience",
    description: "Digital loyalty that complements physical store operations.",
  },
  {
    title: "Operational Control",
    description: "Admin tooling for points, tiers, and campaign governance.",
  },
];

export function Highlights() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {highlights.map((item) => (
        <GlassCard key={item.title}>
          <h3 className="text-lg font-display text-brand-800">{item.title}</h3>
          <p className="mt-3 text-sm text-brand-700">{item.description}</p>
        </GlassCard>
      ))}
    </div>
  );
}
