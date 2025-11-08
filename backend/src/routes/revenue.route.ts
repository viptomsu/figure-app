import { Router, Request, Response } from "express";
import {
  getRevenueSummary,
  getDailyOrderAndRevenue,
} from "../controllers/revenue.controller.js";

const revenueRouter: Router = Router();

revenueRouter.get("/summary", getRevenueSummary);
revenueRouter.get("/daily", getDailyOrderAndRevenue);

export { revenueRouter };