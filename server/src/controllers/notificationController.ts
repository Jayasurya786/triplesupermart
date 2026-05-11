import { asyncHandler } from "../utils/asyncHandler";
import { notificationRepository } from "../repositories/notificationRepository";
import { ApiError } from "../utils/apiError";

export const getNotifications = asyncHandler(async (req, res) => {
  const customerId = req.user?.customerId;
  if (!customerId) {
    res.status(400).json({ message: "Customer ID required" });
    return;
  }

  const notifications = await notificationRepository.findByCustomerId(customerId);
  res.status(200).json({ notifications });
});

export const getUnreadNotifications = asyncHandler(async (req, res) => {
  const customerId = req.user?.customerId;
  if (!customerId) {
    res.status(400).json({ message: "Customer ID required" });
    return;
  }

  const notifications = await notificationRepository.findUnreadByCustomerId(customerId);
  res.status(200).json({ notifications });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  
  const notification = await notificationRepository.markAsRead(notificationId);
  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  res.status(200).json({ notification });
});

export const markAsUnread = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  
  const notification = await notificationRepository.markAsUnread(notificationId);
  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  res.status(200).json({ notification });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  const customerId = req.user?.customerId;
  if (!customerId) {
    res.status(400).json({ message: "Customer ID required" });
    return;
  }

  await notificationRepository.markAllAsRead(customerId);
  res.status(200).json({ message: "All notifications marked as read" });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  
  const notification = await notificationRepository.delete(notificationId);
  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  res.status(200).json({ message: "Notification deleted" });
});

export const deleteAllNotifications = asyncHandler(async (req, res) => {
  const customerId = req.user?.customerId;
  if (!customerId) {
    res.status(400).json({ message: "Customer ID required" });
    return;
  }

  await notificationRepository.deleteAll(customerId);
  res.status(200).json({ message: "All notifications deleted" });
});
