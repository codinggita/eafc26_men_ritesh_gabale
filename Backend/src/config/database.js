import mongoose from "mongoose";

import { env } from "./env.js";

export async function connectDatabase() {
  try {
    await mongoose.connect(env.mongoUrl);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}
