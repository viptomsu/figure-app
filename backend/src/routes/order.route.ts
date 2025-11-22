import { Router } from "express";
import {
	createOrder,
	getAllOrders,
	getOrdersByUserId,
	changeOrderStatus,
} from "@/controllers/order.controller";
import { checkAuth } from "@/middlewares/auth.middleware";
import { validateRequest } from "@/middlewares/validate.middleware";
import {
	createOrderSchema,
	orderFilterSchema,
	userOrderFilterSchema,
	changeOrderStatusSchema,
} from "@/schemas/order.schema";

const orderRouter: Router = Router();

orderRouter.post(
	"/create",
	checkAuth,
	validateRequest(createOrderSchema),
	createOrder
);

orderRouter.get(
	"/all",
	checkAuth,
	validateRequest(orderFilterSchema),
	getAllOrders
);

orderRouter.get(
	"/user/:userId",
	checkAuth,
	validateRequest(userOrderFilterSchema),
	getOrdersByUserId
);

orderRouter.put(
	"/:orderId/status",
	checkAuth,
	validateRequest(changeOrderStatusSchema),
	changeOrderStatus
);

export { orderRouter };
