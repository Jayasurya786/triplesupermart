export const loyaltyTiers = ["Fresh", "Prime", "Emerald"] as const;
export type LoyaltyTier = (typeof loyaltyTiers)[number];
