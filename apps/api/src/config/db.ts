import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDb() {
  try {
    console.log(`Attempting MongoDB connection...`);
    const hardcodedUri = "mongodb+srv://zerohub01_db_user:Zero_hub01@zero.tlyc3hw.mongodb.net/zero-os?retryWrites=true&w=majority&appName=ZERO";
    await mongoose.connect(hardcodedUri, { 
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000 
    }).then(() => {
      console.log('✅ MongoDB Connected Successfully');
    }).catch((err) => {
      console.error('❌ MongoDB Connection Failed:', err.message);
      process.exit(1);
    });
  } catch (error) {
    console.error("MongoDB Connection Failed! Check MongoDB Atlas Network Access (IP Whitelist). Error:", error);
    throw error;
  }
}
