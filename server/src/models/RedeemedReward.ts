import { Schema, model, type Document } from "mongoose";

export interface RedeemedRewardDocument extends Document {
  customerId: string;
  campaignTitle: string;
  pointsUsed: number;
  redeemedDate: Date;
  expiryDate: Date;
  status: "active" | "expired" | "used";
}

const RedeemedRewardSchema = new Schema<RedeemedRewardDocument>(
  {
    customerId: { type: String, required: true, index: true },
    campaignTitle: { type: String, required: true },
    pointsUsed: { type: Number, required: true },
    redeemedDate: { type: Date, required: true, default: Date.now },
    expiryDate: { type: Date, required: true },
    status: { type: String, enum: ["active", "expired", "used"], default: "active" },
  },
  { timestamps: true }
);

export const RedeemedRewardModel = model<RedeemedRewardDocument>("RedeemedReward", RedeemedRewardSchema);
