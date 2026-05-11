import { Schema, model, type Document } from "mongoose";

export interface NotificationDocument extends Document {
  customerId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    customerId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["info", "success", "warning", "error"], default: "info" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const NotificationModel = model<NotificationDocument>("Notification", NotificationSchema);
