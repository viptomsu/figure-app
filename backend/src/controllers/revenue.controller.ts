import { Request, Response } from "express";
import { Decimal } from "@prisma/client/runtime/library";
import moment from "moment";
import { DailyRevenueQuery } from "@/types/request.types";
import { prisma } from "@/db/prisma.client";
import { ApiResponse } from "@/utils/ApiResponse";

// Hàm để tính toán tổng doanh thu trong khoảng thời gian
const calculateTotalRevenue = async (
	start: Date,
	end: Date
): Promise<number> => {
	const result = await prisma.order.aggregate({
		where: {
			date: {
				gte: start,
				lte: end,
			},
		},
		_sum: {
			totalPrice: true,
		},
	});
	return result._sum.totalPrice ? result._sum.totalPrice.toNumber() : 0;
};

// Lấy tóm tắt doanh thu
export const getRevenueSummary = async (
	_req: Request,
	res: Response
): Promise<void> => {
	try {
		const todayStart: Date = moment().startOf("day").toDate();
		const todayEnd: Date = moment().endOf("day").toDate();
		const yesterdayStart: Date = moment()
			.subtract(1, "days")
			.startOf("day")
			.toDate();
		const yesterdayEnd: Date = moment()
			.subtract(1, "days")
			.endOf("day")
			.toDate();
		const monthStart: Date = moment().startOf("month").toDate();
		const lastMonthStart: Date = moment()
			.subtract(1, "month")
			.startOf("month")
			.toDate();
		const lastMonthEnd: Date = moment()
			.subtract(1, "month")
			.endOf("month")
			.toDate();
		const yearStart: Date = moment().startOf("year").toDate();
		const lastYearStart: Date = moment()
			.subtract(1, "year")
			.startOf("year")
			.toDate();
		const lastYearEnd: Date = moment()
			.subtract(1, "year")
			.endOf("year")
			.toDate();

		// Tính toán doanh thu
		const todayRevenue: number = await calculateTotalRevenue(
			todayStart,
			todayEnd
		);
		const yesterdayRevenue: number = await calculateTotalRevenue(
			yesterdayStart,
			yesterdayEnd
		);
		const monthlyRevenue: number = await calculateTotalRevenue(
			monthStart,
			todayEnd
		);
		const lastMonthRevenue: number = await calculateTotalRevenue(
			lastMonthStart,
			lastMonthEnd
		);
		const yearlyRevenue: number = await calculateTotalRevenue(
			yearStart,
			todayEnd
		);
		const lastYearRevenue: number = await calculateTotalRevenue(
			lastYearStart,
			lastYearEnd
		);

		// Thống kê tổng sản phẩm, đơn hàng và người dùng
		const totalProducts: number = await prisma.product.count({
			where: { isDelete: false },
		});
		const totalOrders: number = await prisma.order.count();
		const totalUsers: number = await prisma.user.count({
			where: { isDelete: false },
		});

		// Tính toán phần trăm tăng trưởng
		const todayIncreasePercentage: number =
			yesterdayRevenue > 0
				? ((todayRevenue - yesterdayRevenue) * 100) / yesterdayRevenue
				: 0;
		const monthlyIncreasePercentage: number =
			lastMonthRevenue > 0
				? ((monthlyRevenue - lastMonthRevenue) * 100) / lastMonthRevenue
				: 0;
		const yearlyIncreasePercentage: number =
			lastYearRevenue > 0
				? ((yearlyRevenue - lastYearRevenue) * 100) / lastYearRevenue
				: 0;

		const revenueSummary = {
			todayRevenue,
			yesterdayRevenue,
			todayIncreasePercentage,
			monthlyRevenue,
			lastMonthRevenue,
			monthlyIncreasePercentage,
			yearlyRevenue,
			lastYearRevenue,
			yearlyIncreasePercentage,
			totalProducts,
			totalOrders,
			totalUsers,
		};

		res
			.status(200)
			.json(
				new ApiResponse(200, revenueSummary, "Lấy tóm tắt doanh thu thành công")
			);
	} catch (error) {
		console.error("Error fetching revenue summary:", error);
		res
			.status(500)
			.json(new ApiResponse(500, null, "Lỗi khi lấy tóm tắt doanh thu"));
	}
};

export const getDailyOrderAndRevenue = async (
	req: Request<{}, any, any, DailyRevenueQuery>,
	res: Response
): Promise<void> => {
	try {
		const { startDate, endDate } = req.query;

		const start: Date = moment(startDate).startOf("day").toDate();
		const end: Date = moment(endDate).endOf("day").toDate();

		const results = await prisma.$queryRaw<
			Array<{ day: Date; orderCount: bigint; totalRevenue: Decimal }>
		>`
      SELECT
        DATE_TRUNC('day', "date" AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Bangkok') AS day,
        COUNT(*)::bigint AS "orderCount",
        SUM("totalPrice")::decimal AS "totalRevenue"
      FROM "Order"
      WHERE "date" >= ${start} AND "date" <= ${end}
      GROUP BY day
      ORDER BY day ASC
    `;

		const categories: string[] = results.map((r) =>
			moment(r.day).format("YYYY-MM-DD")
		);
		const orderCounts: number[] = results.map((r) => Number(r.orderCount));
		const revenues: number[] = results.map((r) => r.totalRevenue.toNumber());

		const responseData = {
			series: [
				{ name: "Số đơn hàng", data: orderCounts },
				{ name: "Doanh thu", data: revenues },
			],
			categories,
		};

		res
			.status(200)
			.json(
				new ApiResponse(
					200,
					responseData,
					"Lấy thống kê doanh thu theo ngày thành công"
				)
			);
	} catch (error) {
		console.error("Error fetching daily order and revenue:", error);
		res
			.status(500)
			.json(
				new ApiResponse(500, null, "Lỗi khi lấy thống kê doanh thu theo ngày")
			);
	}
};
