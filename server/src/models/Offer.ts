import { Schema, model, type Document } from "mongoose";

export interface OfferDocument extends Document {
  title: string;
  detail?: string;
  active: boolean;
  startsAt?: Date;
  endsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new Schema<OfferDocument>(
  {
    title: { type: String, required: true },
    detail: { type: String },
    active: { type: Boolean, default: true },
    startsAt: { type: Date },
    endsAt: { type: Date },
  },
  { timestamps: true }
);

export const OfferModel = model<OfferDocument>("Offer", OfferSchema);
