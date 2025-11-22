import express, {
	Express,
	Request,
	Response,
	NextFunction,
	ErrorRequestHandler,
} from "express";
import path from "path";
import { fileURLToPath } from "url";
import { indexRouter } from "@/routes/index.route";
import { ApiResponse } from "@/utils/ApiResponse";
import cors from "cors";
import cookieParser from "cookie-parser";

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

const app: Express = express();

app.use(
	cors({
		origin: [
			"https://we-shine.vercel.app",
			"https://we-shine-admin.vercel.app",
			"http://localhost:3000",
			"http://localhost:3001",
		],
		credentials: true,
		methods: "GET,POST,PUT,PATCH,DELETE",
		allowedHeaders: "Content-Type,Authorization",
	})
);

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", indexRouter);

app.use("/*", (_req: Request, res: Response, _next: NextFunction) => {
	res.status(404).json(new ApiResponse(404, null, "No such route exists"));
});

const errorHandler: ErrorRequestHandler = (
	err: any,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	console.error(err.stack);
	res
		.status(500)
		.json(new ApiResponse(500, null, "An unexpected error occurred"));
};

app.use(errorHandler);

export { app };
