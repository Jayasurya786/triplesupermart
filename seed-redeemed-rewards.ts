import mongoose from "mongoose";
import { RedeemedRewardModel } from "./server/src/models/RedeemedReward";
import dotenv from "dotenv";

dotenv.config();

async function seedRedeemedRewards() {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/triplen";
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Clear existing redeemed rewards
    await RedeemedRewardModel.deleteMany({});
    console.log("Cleared existing redeemed rewards");

    // Get john's customer ID - we'll need to find it from the User model
    // For now, we'll use the expected customerId format
    const customerIds = [
      "CUST001", // John Doe's customer ID (from previous seed)
    ];

    const redeemedRewards = [
      {
        customerId: "CUST001",
        campaignTitle: "$10 Voucher",
        pointsUsed: 500,
        redeemedDate: new Date("2026-04-15"),
        expiryDate: new Date("2026-05-15"),
        status: "active",
      },
      {
        customerId: "CUST001",
        campaignTitle: "Free Coffee Voucher",
        pointsUsed: 200,
        redeemedDate: new Date("2026-03-20"),
        expiryDate: new Date("2026-04-20"),
        status: "active",
      },
      {
        customerId: "CUST001",
        campaignTitle: "$20 Fresh Produce Voucher",
        pointsUsed: 2000,
        redeemedDate: new Date("2026-02-10"),
        expiryDate: new Date("2026-03-10"),
        status: "expired",
      },
    ];

    const result = await RedeemedRewardModel.insertMany(redeemedRewards);
    console.log(`Successfully seeded ${result.length} redeemed rewards`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding redeemed rewards:", error);
    process.exit(1);
  }
}

seedRedeemedRewards();
