import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import moment from "moment";

// Hàm để tính toán tổng doanh thu trong khoảng thời gian
const calculateTotalRevenue = async (start, end) => {
  const result = await Order.aggregate([
    { $match: { date: { $gte: start, $lt: end } } },
    { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
  ]);
  return result.length > 0 ? result[0].totalRevenue : 0;
};

// Lấy tóm tắt doanh thu
export const getRevenueSummary = async (req, res) => {
  try {
    const todayStart = moment().startOf("day").toDate();
    const todayEnd = moment().endOf("day").toDate();
    const yesterdayStart = moment().subtract(1, "days").startOf("day").toDate();
    const yesterdayEnd = moment().subtract(1, "days").endOf("day").toDate();
    const monthStart = moment().startOf("month").toDate();
    const lastMonthStart = moment()
      .subtract(1, "month")
      .startOf("month")
      .toDate();
    const lastMonthEnd = moment().subtract(1, "month").endOf("month").toDate();
    const yearStart = moment().startOf("year").toDate();
    const lastYearStart = moment().subtract(1, "year").startOf("year").toDate();
    const lastYearEnd = moment().subtract(1, "year").endOf("year").toDate();

    // Tính toán doanh thu
    const todayRevenue = await calculateTotalRevenue(todayStart, todayEnd);
    const yesterdayRevenue = await calculateTotalRevenue(
      yesterdayStart,
      yesterdayEnd
    );
    const monthlyRevenue = await calculateTotalRevenue(monthStart, todayEnd);
    const lastMonthRevenue = await calculateTotalRevenue(
      lastMonthStart,
      lastMonthEnd
    );
    const yearlyRevenue = await calculateTotalRevenue(yearStart, todayEnd);
    const lastYearRevenue = await calculateTotalRevenue(
      lastYearStart,
      lastYearEnd
    );

    // Thống kê tổng sản phẩm, đơn hàng và người dùng
    const totalProducts = await Product.countDocuments({ isDelete: false });
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ isDelete: false });

    // Tính toán phần trăm tăng trưởng
    const todayIncreasePercentage =
      yesterdayRevenue > 0
        ? ((todayRevenue - yesterdayRevenue) * 100) / yesterdayRevenue
        : 0;
    const monthlyIncreasePercentage =
      lastMonthRevenue > 0
        ? ((monthlyRevenue - lastMonthRevenue) * 100) / lastMonthRevenue
        : 0;
    const yearlyIncreasePercentage =
      lastYearRevenue > 0
        ? ((yearlyRevenue - lastYearRevenue) * 100) / lastYearRevenue
        : 0;

    res.status(200).json({
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
    });
  } catch (error) {
    console.error("Error fetching revenue summary:", error);
    res.status(500).json({ message: "Failed to fetch revenue summary" });
  }
};

export const getDailyOrderAndRevenue = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = moment(startDate).startOf("day").toDate();
    const end = moment(endDate).endOf("day").toDate();

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

    const categories = results.map((r) => r._id);
    const orderCounts = results.map((r) => r.orderCount);
    const revenues = results.map((r) => r.totalRevenue);

    res.status(200).json({
      series: [
        { name: "Số đơn hàng", data: orderCounts },
        { name: "Doanh thu", data: revenues },
      ],
      categories,
    });
  } catch (error) {
    console.error("Error fetching daily order and revenue:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch daily order and revenue" });
  }
};
