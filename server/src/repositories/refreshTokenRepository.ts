import { RefreshTokenModel } from "../models/RefreshToken";

export async function create(input: { userId: string; token: string; expiresAt: Date }) {
  return RefreshTokenModel.create(input);
}

export async function findValid(token: string) {
  return RefreshTokenModel.findOne({
    token,
    revokedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  }).exec();
}

export async function revoke(token: string) {
  return RefreshTokenModel.findOneAndUpdate(
    { token, revokedAt: { $exists: false } },
    { revokedAt: new Date() },
    { new: true }
  ).exec();
}
