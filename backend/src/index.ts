import { createServer, Server } from "http";
import "dotenv/config";
import { app } from "./app.js";
import { connectDB } from "./db/db.connect.js";

const server: Server = createServer(app);

const PORT: number = parseInt(process.env.PORT || '5001', 10);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server listening on PORT : ${PORT}`);
  });
});