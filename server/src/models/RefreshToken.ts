import { Schema, model, type Document } from "mongoose";

interface RefreshTokenDocument extends Document {
  userId: string;
  token: string;
  expiresAt: Date;
  revokedAt?: Date;
}

const RefreshTokenSchema = new Schema<RefreshTokenDocument>(
  {
    userId: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date },
  },
  { timestamps: true }
);

export const RefreshTokenModel = model<RefreshTokenDocument>("RefreshToken", RefreshTokenSchema);
