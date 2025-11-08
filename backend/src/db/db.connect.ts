import "dotenv/config";

/*
 * DEPRECATED: This file is deprecated and will be removed in a future phase.
 * Use ./prisma.client.ts instead for database connections.
 * This file will be removed after all controllers are migrated to Prisma.
 * Reference: Migration from MongoDB/Mongoose to PostgreSQL/Prisma
 */

/**
 * @deprecated Use connectPrisma from prisma.client.ts instead.
 * This MongoDB connection has been removed. Please use connectPrisma for database connections.
 */
const connectDB = async (): Promise<void> => {
  console.warn("DEPRECATED: connectDB from db.connect.ts is no longer functional.");
  console.warn("Please use connectPrisma from src/db/prisma.client.ts instead.");
  console.warn("This function will be removed in a future release.");
  return;
};

export { connectDB };