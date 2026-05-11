import { Schema, model, type Document } from "mongoose";

interface LoyaltyTierDocument extends Document {
  name: string;
  minPoints: number;
  benefits: string[];
}

const LoyaltyTierSchema = new Schema<LoyaltyTierDocument>(
  {
    name: { type: String, required: true },
    minPoints: { type: Number, required: true },
    benefits: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const LoyaltyTierModel = model<LoyaltyTierDocument>("LoyaltyTier", LoyaltyTierSchema);
