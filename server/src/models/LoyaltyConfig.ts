import { Schema, model, type Document } from "mongoose";

export interface LoyaltyConfigDocument extends Document {
  pointsPerDollar: number;
  redemptionStep: number;
  welcomeBonus: number;
  birthdayBonus: number;
}

const LoyaltyConfigSchema = new Schema<LoyaltyConfigDocument>(
  {
    pointsPerDollar: { type: Number, required: true, default: 1 },
    redemptionStep: { type: Number, required: true, default: 100 },
    welcomeBonus: { type: Number, required: true, default: 200 },
    birthdayBonus: { type: Number, required: true, default: 500 },
  },
  { timestamps: true }
);

export const LoyaltyConfigModel = model<LoyaltyConfigDocument>("LoyaltyConfig", LoyaltyConfigSchema);
