import { Router } from "express";
import {
	getRevenueSummary,
	getDailyOrderAndRevenue,
} from "@/controllers/revenue.controller";
import { validateRequest } from "@/middlewares/validate.middleware";
import { dailyRevenueQuerySchema } from "@/schemas/revenue.schema";

const revenueRouter: Router = Router();

revenueRouter.get("/summary", getRevenueSummary);
revenueRouter.get(
	"/daily",
	validateRequest(dailyRevenueQuerySchema),
	getDailyOrderAndRevenue
);

export { revenueRouter };
