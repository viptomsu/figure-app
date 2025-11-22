import { createServer, Server } from "http";
import "dotenv/config";
import { app } from "@/app";
import { connectPrisma } from "@/db/prisma.client";

const server: Server = createServer(app);

const PORT: number = parseInt(process.env.PORT || "8080", 10);

connectPrisma().then(() => {
	server.listen(PORT, () => {
		console.log(`Server listening on PORT : ${PORT}`);
	});
});
