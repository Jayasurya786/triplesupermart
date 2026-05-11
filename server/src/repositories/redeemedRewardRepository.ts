import { RedeemedRewardModel, type RedeemedRewardDocument } from "../models/RedeemedReward";

export const redeemedRewardRepository = {
  async findByCustomerId(customerId: string): Promise<RedeemedRewardDocument[]> {
    return RedeemedRewardModel.find({ customerId }).sort({ redeemedDate: -1 });
  },

  async findById(id: string): Promise<RedeemedRewardDocument | null> {
    return RedeemedRewardModel.findById(id);
  },

  async findAll(options: {
    limit?: number;
    offset?: number;
    customerId?: string;
    campaignTitle?: string;
    status?: string;
    redeemedFrom?: Date;
    redeemedTo?: Date;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{ rewards: RedeemedRewardDocument[]; total: number }> {
    const {
      limit = 50,
      offset = 0,
      customerId,
      campaignTitle,
      status,
      redeemedFrom,
      redeemedTo,
      sortBy = 'redeemedDate',
      sortOrder = 'desc'
    } = options;

    const filter: any = {};
    if (customerId) filter.customerId = customerId;
    if (campaignTitle) filter.campaignTitle = { $regex: campaignTitle, $options: 'i' };
    if (status) filter.status = status;
    if (redeemedFrom || redeemedTo) {
      filter.redeemedDate = {};
      if (redeemedFrom) filter.redeemedDate.$gte = redeemedFrom;
      if (redeemedTo) filter.redeemedDate.$lte = redeemedTo;
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [rewards, total] = await Promise.all([
      RedeemedRewardModel.find(filter)
        .sort(sort)
        .limit(limit)
        .skip(offset),
      RedeemedRewardModel.countDocuments(filter)
    ]);

    return { rewards, total };
  },

  async create(data: Partial<RedeemedRewardDocument>): Promise<RedeemedRewardDocument> {
    const reward = new RedeemedRewardModel(data);
    return reward.save();
  },

  async update(id: string, data: Partial<RedeemedRewardDocument>): Promise<RedeemedRewardDocument | null> {
    return RedeemedRewardModel.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id: string): Promise<RedeemedRewardDocument | null> {
    return RedeemedRewardModel.findByIdAndDelete(id);
  },
};
