const express = require("express");
const router = express.Router();

const { authorization } = require("../services/Authentication");
const { ROLES } = require("../constants");
const authAdmin = authorization([ROLES.ADMIN]);
const authStaffAdmin = authorization([ROLES.ADMIN, ROLES.STAFF]);

const {
  getTotalRevenue,
  getRevenueByCinema,
  getRevenueByTime,
  getBookingCountByTime,
  getTicketStatisticsByMovie,
  getShowtimesCountInWeek,
} = require("../services/Statistics");

// BASIC URL /statistics

/**
 * GET /statistics/revenue/total
 * Lấy tổng doanh thu toàn hệ thống
 * 
 * @returns {Object} { data: { totalRevenue: number } }
 * 
 * Authentication: Admin, Staff
 */
router.get("/revenue/total", authStaffAdmin, async (req, res) => {
  console.log("GET /statistics/revenue/total");
  try {
    const totalRevenue = await getTotalRevenue();
    res.status(200).json({
      data: {
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Error getting total revenue:", error);
    res.status(500).json({
      message: "Lỗi khi lấy tổng doanh thu",
      error: error.message,
    });
  }
});

/**
 * GET /statistics/revenue/by-cinema
 * Lấy doanh thu theo từng rạp
 * 
 * @returns {Object} { data: Array<{ cinemaId: string, cinemaTitle: string, revenue: number }> }
 * 
 * Authentication: Admin, Staff
 */
router.get("/revenue/by-cinema", authStaffAdmin, async (req, res) => {
  console.log("GET /statistics/revenue/by-cinema");
  try {
    const revenueByCinema = await getRevenueByCinema();
    res.status(200).json({
      data: revenueByCinema,
    });
  } catch (error) {
    console.error("Error getting revenue by cinema:", error);
    res.status(500).json({
      message: "Lỗi khi lấy doanh thu theo rạp",
      error: error.message,
    });
  }
});

/**
 * GET /statistics/revenue/by-time?filter=daily|weekly|monthly
 * Lấy doanh thu theo thời gian (ngày/tuần/tháng)
 * 
 * @param {string} filter - 'daily', 'weekly', hoặc 'monthly' (default: 'daily')
 * 
 * @returns {Object} { 
 *   data: Array<{ date: string, revenue: number, ticketCount: number }>,
 *   filter: string 
 * }
 * 
 * Authentication: Admin, Staff
 */
router.get("/revenue/by-time", authStaffAdmin, async (req, res) => {
  const { filter = "daily" } = req.query;
  console.log(`GET /statistics/revenue/by-time?filter=${filter}`);

  // Validate filter parameter
  if (!["daily", "weekly", "monthly"].includes(filter)) {
    return res.status(400).json({
      message: "Filter không hợp lệ. Chỉ chấp nhận: daily, weekly, monthly",
    });
  }

  try {
    const revenueByTime = await getRevenueByTime(filter);
    res.status(200).json({
      data: revenueByTime,
      filter,
    });
  } catch (error) {
    console.error("Error getting revenue by time:", error);
    res.status(500).json({
      message: "Lỗi khi lấy doanh thu theo thời gian",
      error: error.message,
    });
  }
});

/**
 * GET /statistics/bookings/by-time?filter=daily|weekly|monthly
 * Lấy số lượng đặt vé theo thời gian (ngày/tuần/tháng)
 * 
 * @param {string} filter - 'daily', 'weekly', hoặc 'monthly' (default: 'daily')
 * 
 * @returns {Object} { 
 *   data: Array<{ date: string, count: number }>,
 *   filter: string 
 * }
 * 
 * Authentication: Admin, Staff
 */
router.get("/bookings/by-time", authStaffAdmin, async (req, res) => {
  const { filter = "daily" } = req.query;
  console.log(`GET /statistics/bookings/by-time?filter=${filter}`);

  // Validate filter parameter
  if (!["daily", "weekly", "monthly"].includes(filter)) {
    return res.status(400).json({
      message: "Filter không hợp lệ. Chỉ chấp nhận: daily, weekly, monthly",
    });
  }

  try {
    const bookingCount = await getBookingCountByTime(filter);
    res.status(200).json({
      data: bookingCount,
      filter,
    });
  } catch (error) {
    console.error("Error getting booking count by time:", error);
    res.status(500).json({
      message: "Lỗi khi lấy số lượng đặt vé theo thời gian",
      error: error.message,
    });
  }
});

/**
 * GET /statistics/movies/tickets
 * Lấy thống kê số lượng vé đã đặt theo từng phim (bao gồm top 5 phim bán chạy)
 * 
 * @returns {Object} { 
 *   data: { 
 *     allMovies: Array<{ movieId, movieTitle, moviePoster, ticketCount, revenue }>,
 *     top5: Array<{ movieId, movieTitle, moviePoster, ticketCount, revenue }>
 *   }
 * }
 * 
 * Authentication: Admin, Staff
 */
router.get("/movies/tickets", authStaffAdmin, async (req, res) => {
  console.log("GET /statistics/movies/tickets");
  try {
    const movieStatistics = await getTicketStatisticsByMovie();
    res.status(200).json({
      data: movieStatistics,
    });
  } catch (error) {
    console.error("Error getting ticket statistics by movie:", error);
    res.status(500).json({
      message: "Lỗi khi lấy thống kê vé theo phim",
      error: error.message,
    });
  }
});

/**
 * GET /statistics/showtimes/week
 * Lấy số lượng lịch chiếu trong tuần (đầu tuần → cuối tuần)
 * 
 * @returns {Object} { 
 *   data: { 
 *     startDate: string,
 *     endDate: string,
 *     count: number,
 *     showtimes: Array<{ id, date, time, movieTitle, cinemaTitle }>
 *   }
 * }
 * 
 * Authentication: Admin, Staff
 */
router.get("/showtimes/week", authStaffAdmin, async (req, res) => {
  console.log("GET /statistics/showtimes/week");
  try {
    const showtimesData = await getShowtimesCountInWeek();
    res.status(200).json({
      data: showtimesData,
    });
  } catch (error) {
    console.error("Error getting showtimes count in week:", error);
    res.status(500).json({
      message: "Lỗi khi lấy số lượng lịch chiếu trong tuần",
      error: error.message,
    });
  }
});

/**
 * GET /statistics/dashboard
 * Lấy tất cả thống kê cho dashboard trong một request
 * 
 * @param {string} filter - 'daily', 'weekly', hoặc 'monthly' (optional, default: 'daily')
 * 
 * @returns {Object} { 
 *   data: {
 *     totalRevenue: number,
 *     revenueByCinema: Array,
 *     revenueByTime: Array,
 *     bookingCountByTime: Array,
 *     movieStatistics: { allMovies: Array, top5: Array },
 *     showtimesThisWeek: { startDate, endDate, count, showtimes: Array }
 *   },
 *   filter: string
 * }
 * 
 * Authentication: Admin, Staff
 */
router.get("/dashboard", authStaffAdmin, async (req, res) => {
  const { filter = "daily" } = req.query;
  console.log(`GET /statistics/dashboard?filter=${filter}`);

  // Validate filter parameter
  if (!["daily", "weekly", "monthly"].includes(filter)) {
    return res.status(400).json({
      message: "Filter không hợp lệ. Chỉ chấp nhận: daily, weekly, monthly",
    });
  }

  try {
    // Execute all queries in parallel for better performance
    const [
      totalRevenue,
      revenueByCinema,
      revenueByTime,
      bookingCountByTime,
      movieStatistics,
      showtimesThisWeek,
    ] = await Promise.all([
      getTotalRevenue(),
      getRevenueByCinema(),
      getRevenueByTime(filter),
      getBookingCountByTime(filter),
      getTicketStatisticsByMovie(),
      getShowtimesCountInWeek(),
    ]);

    res.status(200).json({
      data: {
        totalRevenue,
        revenueByCinema,
        revenueByTime,
        bookingCountByTime,
        movieStatistics,
        showtimesThisWeek,
      },
      filter,
    });
  } catch (error) {
    console.error("Error getting dashboard statistics:", error);
    res.status(500).json({
      message: "Lỗi khi lấy thống kê dashboard",
      error: error.message,
    });
  }
});

module.exports = router;
