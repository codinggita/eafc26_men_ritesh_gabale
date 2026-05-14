import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUrl: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/indian_law_api",
  jwtSecret: process.env.JWT_SECRET || "change-this-secret-in-env",
  jwtExpiresInSeconds: Number(process.env.JWT_EXPIRES_IN_SECONDS) || 60 * 60 * 24,
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000,
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 120
};
