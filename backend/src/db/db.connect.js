import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  const MONGO_URL = process.env.MONGO_URL;

  try {
    await mongoose.connect(MONGO_URL);

    console.log("Connected to DB successfully");
  } catch (error) {
    console.warn("Database connection failed:", error.message);
    console.warn("Server will continue running without database connection for testing");
    // Don't exit the process for testing purposes
  }
};

export { connectDB };
