import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { RewardCampaignModel } from "./server/src/models/RewardCampaign";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const MONGO_URI = process.env.MONGO_URI || "";

const sampleCampaigns = [
  {
    title: "$20 Fresh Produce Voucher",
    description: "Redeemable on all fresh vegetables and fruits",
    pointsRequired: 2000,
    discount: 20,
    expiryDate: new Date("2026-06-30"),
    badge: "hot",
    icon: "🥬",
    bgColor: "from-green-100 to-green-200",
    active: true,
  },
  {
    title: "Free Household Essentials Bundle",
    description: "Get a bundle of popular household items",
    pointsRequired: 3500,
    discount: 0,
    expiryDate: new Date("2026-07-15"),
    badge: "new",
    icon: "🏠",
    bgColor: "from-blue-100 to-blue-200",
    active: true,
  },
  {
    title: "$50 Shopping Voucher",
    description: "Valid on all categories except tobacco",
    pointsRequired: 5000,
    discount: 50,
    expiryDate: new Date("2026-05-20"),
    badge: "limited",
    icon: "🛍️",
    bgColor: "from-red-100 to-red-200",
    active: true,
  },
  {
    title: "Double Points Weekend Pass",
    description: "Earn 2x points on all purchases for one weekend",
    pointsRequired: 1500,
    discount: 0,
    expiryDate: new Date("2026-06-10"),
    badge: "hot",
    icon: "⭐",
    bgColor: "from-yellow-100 to-yellow-200",
    active: true,
  },
  {
    title: "$15 Bakery Credit",
    description: "Use for any bakery items including bread and pastries",
    pointsRequired: 1200,
    discount: 15,
    expiryDate: new Date("2026-08-30"),
    badge: "new",
    icon: "🍞",
    bgColor: "from-orange-100 to-orange-200",
    active: true,
  },
  {
    title: "Free Milk & Dairy Bundle",
    description: "Get a selection of premium dairy products",
    pointsRequired: 2500,
    discount: 30,
    expiryDate: new Date("2026-07-25"),
    badge: "hot",
    icon: "🥛",
    bgColor: "from-pink-100 to-pink-200",
    active: true,
  },
];

async function seedCampaigns() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing campaigns
    await RewardCampaignModel.deleteMany({});
    console.log("Cleared existing campaigns");

    // Insert new campaigns
    const result = await RewardCampaignModel.insertMany(sampleCampaigns);
    console.log(`Successfully seeded ${result.length} reward campaigns`);

    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding campaigns:", error);
    process.exit(1);
  }
}

seedCampaigns();
