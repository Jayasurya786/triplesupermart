import { Schema, model, type Document } from "mongoose";

interface RewardCampaignDocument extends Document {
  title: string;
  description: string;
  pointsRequired: number;
  discount: number;
  expiryDate: Date;
  badge: "hot" | "new" | "limited";
  icon: string;
  bgColor: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RewardCampaignSchema = new Schema<RewardCampaignDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    pointsRequired: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    expiryDate: { type: Date, required: true },
    badge: { type: String, enum: ["hot", "new", "limited"], default: "new" },
    icon: { type: String, default: "🎁" },
    bgColor: { type: String, default: "from-blue-100 to-blue-200" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const RewardCampaignModel = model<RewardCampaignDocument>("RewardCampaign", RewardCampaignSchema);
