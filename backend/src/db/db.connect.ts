import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async (): Promise<void> => {
  const MONGO_URL = process.env.MONGO_URL;

  if (!MONGO_URL) {
    console.warn("MONGO_URL environment variable is not defined");
    console.warn("Server will continue running without database connection for testing");
    return;
  }

  try {
    await mongoose.connect(MONGO_URL);

    console.log("Connected to DB successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.warn("Database connection failed:", errorMessage);
    console.warn("Server will continue running without database connection for testing");
    // Don't exit the process for testing purposes
  }
};

export { connectDB };