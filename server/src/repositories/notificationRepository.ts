import { NotificationModel, type NotificationDocument } from "../models/Notification";

export const notificationRepository = {
  async findByCustomerId(customerId: string): Promise<NotificationDocument[]> {
    return NotificationModel.find({ customerId }).sort({ createdAt: -1 });
  },

  async findUnreadByCustomerId(customerId: string): Promise<NotificationDocument[]> {
    return NotificationModel.find({ customerId, isRead: false }).sort({ createdAt: -1 });
  },

  async findById(id: string): Promise<NotificationDocument | null> {
    return NotificationModel.findById(id);
  },

  async create(data: Partial<NotificationDocument>): Promise<NotificationDocument> {
    const notification = new NotificationModel(data);
    return notification.save();
  },

  async markAsRead(id: string): Promise<NotificationDocument | null> {
    return NotificationModel.findByIdAndUpdate(id, { isRead: true }, { new: true });
  },

  async markAsUnread(id: string): Promise<NotificationDocument | null> {
    return NotificationModel.findByIdAndUpdate(id, { isRead: false }, { new: true });
  },

  async markAllAsRead(customerId: string): Promise<any> {
    return NotificationModel.updateMany({ customerId }, { isRead: true });
  },

  async delete(id: string): Promise<NotificationDocument | null> {
    return NotificationModel.findByIdAndDelete(id);
  },

  async deleteAll(customerId: string): Promise<any> {
    return NotificationModel.deleteMany({ customerId });
  },
};
