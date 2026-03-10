import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDb() {
  try {
    console.log(`Attempting MongoDB connection...`);
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 });
    // eslint-disable-next-line no-console
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed! Check MongoDB Atlas Network Access (IP Whitelist). Error:", error);
    throw error;
  }
}
