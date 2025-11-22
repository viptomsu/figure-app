import { PrismaClient } from "@prisma/client";

// Global type declaration to prevent multiple instances in development
declare global {
	var __prisma: PrismaClient | undefined;
}

// Prisma client singleton implementation
const prisma =
	globalThis.__prisma ||
	new PrismaClient({
		log: process.env.NODE_ENV !== "production" ? ["error", "warn"] : ["error"],
	});

// In development, save to global to prevent multiple connections during hot-reloads
if (process.env.NODE_ENV !== "production") {
	globalThis.__prisma = prisma;
}

/**
 * Connect to PostgreSQL database using Prisma
 * Tests the connection and handles errors gracefully
 */
export async function connectPrisma(): Promise<void> {
	if (!process.env.DATABASE_URL) {
		console.warn("DATABASE_URL environment variable is not defined");
		console.warn("Server will continue to run without database connection");
		return;
	}

	try {
		await prisma.$connect();
		console.log("Connected to PostgreSQL database successfully");
	} catch (error) {
		console.warn("Warning: Failed to connect to PostgreSQL database:", error);
		// Don't exit the process - allow server to run for testing
	}
}

/**
 * Disconnect from PostgreSQL database
 * Used for graceful shutdown
 */
export async function disconnectPrisma(): Promise<void> {
	try {
		await prisma.$disconnect();
		console.log("Disconnected from PostgreSQL database");
	} catch (error) {
		console.error("Error disconnecting from PostgreSQL database:", error);
	}
}

// Export the Prisma client instance
export { prisma };
