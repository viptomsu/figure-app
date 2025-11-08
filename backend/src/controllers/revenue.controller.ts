import { Request, Response } from "express";
import Order, { OrderDocument } from "../models/order.model.js";
import Product, { ProductDocument } from "../models/product.model.js";
import User, { UserDocument } from "../models/user.model.js";
import moment, { Moment } from "moment";
import { DailyRevenueQuery } from "../types/request.types.js";

// Hàm để tính toán tổng doanh thu trong khoảng thời gian
const calculateTotalRevenue = async (start: Date, end: Date): Promise<number> => {
  const result = await Order.aggregate([
    { $match: { date: { $gte: start, $lt: end } } },
    { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
  ]);
  return result.length > 0 ? result[0].totalRevenue : 0;
};

// Lấy tóm tắt doanh thu
export const getRevenueSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const todayStart: Date = moment().startOf("day").toDate();
    const todayEnd: Date = moment().endOf("day").toDate();
    const yesterdayStart: Date = moment().subtract(1, "days").startOf("day").toDate();
    const yesterdayEnd: Date = moment().subtract(1, "days").endOf("day").toDate();
    const monthStart: Date = moment().startOf("month").toDate();
    const lastMonthStart: Date = moment()
      .subtract(1, "month")
      .startOf("month")
      .toDate();
    const lastMonthEnd: Date = moment().subtract(1, "month").endOf("month").toDate();
    const yearStart: Date = moment().startOf("year").toDate();
    const lastYearStart: Date = moment().subtract(1, "year").startOf("year").toDate();
    const lastYearEnd: Date = moment().subtract(1, "year").endOf("year").toDate();

    // Tính toán doanh thu
    const todayRevenue: number = await calculateTotalRevenue(todayStart, todayEnd);
    const yesterdayRevenue: number = await calculateTotalRevenue(
      yesterdayStart,
      yesterdayEnd
    );
    const monthlyRevenue: number = await calculateTotalRevenue(monthStart, todayEnd);
    const lastMonthRevenue: number = await calculateTotalRevenue(
      lastMonthStart,
      lastMonthEnd
    );
    const yearlyRevenue: number = await calculateTotalRevenue(yearStart, todayEnd);
    const lastYearRevenue: number = await calculateTotalRevenue(
      lastYearStart,
      lastYearEnd
    );

    // Thống kê tổng sản phẩm, đơn hàng và người dùng
    const totalProducts: number = await Product.countDocuments({ isDelete: false });
    const totalOrders: number = await Order.countDocuments();
    const totalUsers: number = await User.countDocuments({ isDelete: false });

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

    res.status(200).json(revenueSummary);
  } catch (error) {
    console.error("Error fetching revenue summary:", error);
    res.status(500).json({ message: "Failed to fetch revenue summary" });
  }
};

export const getDailyOrderAndRevenue = async (req: Request<{}, any, any, DailyRevenueQuery>, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ message: "startDate and endDate are required" });
      return;
    }

    const start: Date = moment(startDate).startOf("day").toDate();
    const end: Date = moment(endDate).endOf("day").toDate();

    const results = await Order.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: { $add: ["$date", 7 * 60 * 60 * 1000] }, // Chuyển date sang UTC+7
            },
          },
          orderCount: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const categories: string[] = results.map((r) => r._id);
    const orderCounts: number[] = results.map((r) => r.orderCount);
    const revenues: number[] = results.map((r) => r.totalRevenue);

    const responseData = {
      series: [
        { name: "Số đơn hàng", data: orderCounts },
        { name: "Doanh thu", data: revenues },
      ],
      categories,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching daily order and revenue:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch daily order and revenue" });
  }
};