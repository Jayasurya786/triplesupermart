import mongoose from "mongoose";
import { NotificationModel } from "./server/src/models/Notification";
import dotenv from "dotenv";

dotenv.config();

async function seedNotifications() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/triplen";
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Clear existing notifications
    await NotificationModel.deleteMany({});
    console.log("Cleared existing notifications");

    const notifications = [
      {
        customerId: "CUST001",
        title: "Welcome Bonus",
        message: "You've earned 500 bonus points! Start shopping to earn more.",
        type: "success",
        isRead: false,
      },
      {
        customerId: "CUST001",
        title: "Limited Time Offer",
        message: "Fresh produce is on sale this weekend! Get 20% extra points.",
        type: "info",
        isRead: false,
      },
      {
        customerId: "CUST001",
        title: "Points Expiring Soon",
        message: "You have 1000 points expiring in 30 days. Redeem them now!",
        type: "warning",
        isRead: true,
      },
      {
        customerId: "CUST001",
        title: "Tier Upgrade Available",
        message: "You're just 520 points away from Prime Tier!",
        type: "info",
        isRead: true,
      },
      {
        customerId: "CUST001",
        title: "Payment Successful",
        message: "Your reward redemption of $10 Voucher has been confirmed.",
        type: "success",
        isRead: true,
      },
    ];

    const result = await NotificationModel.insertMany(notifications);
    console.log(`Successfully seeded ${result.length} notifications`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding notifications:", error);
    process.exit(1);
  }
}

seedNotifications();
