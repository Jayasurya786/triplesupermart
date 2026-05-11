import { notificationRepository } from "../repositories/notificationRepository";

type NotificationType = "info" | "success" | "warning" | "error";

export async function createNotification(input: {
  customerId: string;
  title: string;
  message: string;
  type?: NotificationType;
}) {
  return notificationRepository.create({
    customerId: input.customerId,
    title: input.title,
    message: input.message,
    type: input.type ?? "info",
    isRead: false,
  });
}

export async function createWelcomeNotification(customerId: string) {
  return createNotification({
    customerId,
    title: "Welcome to Triple N Supermart",
    message: "Your customer portal is ready. Start shopping to earn loyalty points.",
    type: "success",
  });
}

export async function createRedeemSuccessNotification(input: {
  customerId: string;
  campaignTitle: string;
  pointsUsed: number;
  remainingPoints: number;
}) {
  return createNotification({
    customerId: input.customerId,
    title: "Reward Redeemed",
    message: `You redeemed ${input.campaignTitle} for ${input.pointsUsed} points. Remaining balance: ${input.remainingPoints}.`,
    type: "success",
  });
}
