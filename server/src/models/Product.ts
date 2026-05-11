import { Schema, model, type Document } from "mongoose";

interface ProductDocument extends Document {
  name: string;
  category: string;
}

const ProductSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

export const ProductModel = model<ProductDocument>("Product", ProductSchema);
