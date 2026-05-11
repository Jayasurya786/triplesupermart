import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  getNotifications,
  getUnreadNotifications,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../controllers/notificationController";

export const notificationRoutes = Router();

notificationRoutes.get("/", authenticate, getNotifications);
notificationRoutes.get("/unread", authenticate, getUnreadNotifications);
notificationRoutes.put("/:notificationId/read", authenticate, markAsRead);
notificationRoutes.put("/:notificationId/unread", authenticate, markAsUnread);
notificationRoutes.put("/mark-all/read", authenticate, markAllAsRead);
notificationRoutes.delete("/:notificationId", authenticate, deleteNotification);
notificationRoutes.delete("/", authenticate, deleteAllNotifications);
