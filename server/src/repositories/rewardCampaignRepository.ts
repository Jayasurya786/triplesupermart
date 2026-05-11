import { RewardCampaignModel } from "../models/RewardCampaign";

export const rewardCampaignRepository = {
  async findAll() {
    return await RewardCampaignModel.find({ active: true }).sort({ createdAt: -1 });
  },

  async findById(id: string) {
    return await RewardCampaignModel.findById(id);
  },

  async create(data: any) {
    const campaign = new RewardCampaignModel(data);
    return await campaign.save();
  },

  async update(id: string, data: any) {
    return await RewardCampaignModel.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id: string) {
    return await RewardCampaignModel.findByIdAndUpdate(id, { active: false }, { new: true });
  },
};
