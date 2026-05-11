import mongoose from "mongoose";
import { env } from "./env";
import { CustomerModel } from "../models/Customer";

export async function connectDb() {
  if (!env.mongoUri) {
    throw new Error("MONGO_URI is not configured");
  }

  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 15_000,
      socketTimeoutMS: 45_000,
    });

    // Keep customer email uniqueness optional by enforcing the latest schema indexes.
    await CustomerModel.syncIndexes();
    console.log("MongoDB connected");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.toLowerCase().includes("tlsv1 alert internal error")) {
      throw new Error(
        "MongoDB TLS handshake failed. Check Atlas Network Access (IP whitelist), verify MONGO_URI, and ensure your system date/time is correct. " +
          "If you are behind a corporate proxy/firewall, test with MONGO_TLS_ALLOW_INVALID_CERTS=true for local debugging."
      );
    }

    throw error;
  }
}
