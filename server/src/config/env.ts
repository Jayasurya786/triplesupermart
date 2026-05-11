import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const candidateEnvPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../.env"),
  path.resolve(process.cwd(), "../../.env"),
];

for (const envPath of candidateEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGO_URI ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "change_me",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? "change_me",
  jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES ?? "15m",
  jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES ?? "7d",
  otpTtlMinutes: Number(process.env.OTP_TTL_MINUTES ?? 10),
  clientOrigin: process.env.CLIENT_ORIGIN ?? "",
  cookieSecure: process.env.COOKIE_SECURE === "true",
};
