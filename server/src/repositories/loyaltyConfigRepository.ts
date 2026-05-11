import { LoyaltyConfigModel } from "../models/LoyaltyConfig";

export const loyaltyConfigRepository = {
  async findOne() {
    let config = await LoyaltyConfigModel.findOne().exec();
    if (!config) {
      config = await LoyaltyConfigModel.create({});
    }
    return config;
  },

  async update(data: Partial<{
    pointsPerDollar: number;
    redemptionStep: number;
    welcomeBonus: number;
    birthdayBonus: number;
  }>) {
    return LoyaltyConfigModel.findOneAndUpdate(
      {},
      data,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec();
  },
};
