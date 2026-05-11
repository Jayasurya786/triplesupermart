import type { Handler } from "@netlify/functions";
import serverless from "serverless-http";
import { app } from "../../server/src/app";
import { connectDb } from "../../server/src/config/db";

const expressHandler = serverless(app);

let connectionPromise: Promise<void> | null = null;

async function ensureDatabaseConnection() {
  if (!connectionPromise) {
    connectionPromise = connectDb().catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }

  await connectionPromise;
}

export const handler: Handler = async (event, context) => {
  await ensureDatabaseConnection();
  return (await expressHandler(event, context)) as any;
};

export const config = {
  path: ["/api/v1", "/api/v1/*"],
};
