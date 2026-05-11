import { Schema, model, type Document } from "mongoose";
import type { LoyaltyTier } from "../constants/loyalty";

export interface CustomerDocument extends Document {
  name: string;
  email?: string;
  phone: string;
  customerId: string;
  tier: LoyaltyTier;
  points: number;
}

const CustomerSchema = new Schema<CustomerDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true, unique: true, sparse: true },
    phone: { type: String, required: true },
    customerId: { type: String, required: true, unique: true, immutable: true },
    tier: { type: String, required: true, default: "Fresh" },
    points: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const CustomerModel = model<CustomerDocument>("Customer", CustomerSchema);
