const Ticket = require("../models/Ticket");
const Screening = require("../models/Screening");
const ScheduledScreening = require("../models/ScheduledScreening");
const Movie = require("../models/Movie");
const Cinema = require("../models/Cinema");

/**
 * Tính tổng doanh thu toàn hệ thống
 * @returns {Promise<number>} Tổng doanh thu
 */
const getTotalRevenue = async () => {
  try {
    const result = await Ticket.aggregate([
      {
        $unwind: "$seats",
      },
      {
        $lookup: {
          from: "seattypes",
          localField: "seats.type",
          foreignField: "_id",
          as: "seatType",
        },
      },
      {
        $unwind: "$seatType",
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$seatType.price" },
        },
      },
    ]);

    return result.length > 0 ? result[0].totalRevenue : 0;
  } catch (error) {
    console.error("Error calculating total revenue:", error);
    throw error;
  }
};

/**
 * Tính doanh thu theo từng rạp
 * @returns {Promise<Array>} Mảng các object { cinemaId, cinemaTitle, revenue }
 */
const getRevenueByCinema = async () => {
  try {
    const result = await Ticket.aggregate([
      {
        $lookup: {
          from: "screenings",
          localField: "screening",
          foreignField: "_id",
          as: "screening",
        },
      },
      {
        $unwind: "$screening",
      },
      {
        $lookup: {
          from: "scheduledscreenings",
          localField: "screening.scheduledScreening",
          foreignField: "_id",
          as: "scheduledScreening",
        },
      },
      {
        $unwind: "$scheduledScreening",
      },
      {
        $lookup: {
          from: "cinemas",
          localField: "scheduledScreening.cinema",
          foreignField: "_id",
          as: "cinema",
        },
      },
      {
        $unwind: "$cinema",
      },
      {
        $unwind: "$seats",
      },
      {
        $lookup: {
          from: "seattypes",
          localField: "seats.type",
          foreignField: "_id",
          as: "seatType",
        },
      },
      {
        $unwind: "$seatType",
      },
      {
        $group: {
          _id: "$cinema._id",
          cinemaTitle: { $first: "$cinema.title" },
          revenue: { $sum: "$seatType.price" },
        },
      },
      {
        $project: {
          _id: 0,
          cinemaId: "$_id",
          cinemaTitle: 1,
          revenue: 1,
        },
      },
      {
        $sort: { revenue: -1 },
      },
    ]);

    return result;
  } catch (error) {
    console.error("Error calculating revenue by cinema:", error);
    throw error;
  }
};

/**
 * Tính doanh thu theo thời gian (ngày/tuần/tháng)
 * @param {string} filter - 'daily', 'weekly', hoặc 'monthly'
 * @returns {Promise<Array>} Mảng các object { date, revenue }
 */
const getRevenueByTime = async (filter = "daily") => {
  try {
    // Build date formatting expression based on filter
    let dateFormatExpr;
    switch (filter) {
      case "daily":
        dateFormatExpr = { $dateToString: { format: "%Y-%m-%d", date: "$datetime" } };
        break;
      case "weekly":
        dateFormatExpr = {
          $concat: [
            { $toString: { $isoWeekYear: "$datetime" } },
            "-W",
            { $toString: { $isoWeek: "$datetime" } },
          ],
        };
        break;
      case "monthly":
        dateFormatExpr = { $dateToString: { format: "%Y-%m", date: "$datetime" } };
        break;
      default:
        dateFormatExpr = { $dateToString: { format: "%Y-%m-%d", date: "$datetime" } };
    }

    // First, calculate revenue per ticket, then group by date
    const result = await Ticket.aggregate([
      {
        $unwind: "$seats",
      },
      {
        $lookup: {
          from: "seattypes",
          localField: "seats.type",
          foreignField: "_id",
          as: "seatType",
        },
      },
      {
        $unwind: "$seatType",
      },
      {
        // First group by ticket to calculate revenue per ticket
        $group: {
          _id: "$_id",
          ticketRevenue: { $sum: "$seatType.price" },
          datetime: { $first: "$datetime" },
        },
      },
      {
        // Add formatted date field
        $addFields: {
          dateFormatted: dateFormatExpr,
        },
      },
      {
        // Then group by date to sum revenue and count tickets
        $group: {
          _id: "$dateFormatted",
          revenue: { $sum: "$ticketRevenue" },
          ticketCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          revenue: 1,
          ticketCount: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    return result;
  } catch (error) {
    console.error("Error calculating revenue by time:", error);
    throw error;
  }
};

/**
 * Đếm số lượng đặt vé theo thời gian (ngày/tuần/tháng)
 * @param {string} filter - 'daily', 'weekly', hoặc 'monthly'
 * @returns {Promise<Array>} Mảng các object { date, count }
 */
const getBookingCountByTime = async (filter = "daily") => {
  try {
    let dateFormat;

    switch (filter) {
      case "daily":
        dateFormat = { $dateToString: { format: "%Y-%m-%d", date: "$datetime" } };
        break;
      case "weekly":
        dateFormat = {
          $concat: [
            { $toString: { $isoWeekYear: "$datetime" } },
            "-W",
            { $toString: { $isoWeek: "$datetime" } },
          ],
        };
        break;
      case "monthly":
        dateFormat = { $dateToString: { format: "%Y-%m", date: "$datetime" } };
        break;
      default:
        dateFormat = { $dateToString: { format: "%Y-%m-%d", date: "$datetime" } };
    }

    const result = await Ticket.aggregate([
      {
        $group: {
          _id: dateFormat,
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    return result;
  } catch (error) {
    console.error("Error calculating booking count by time:", error);
    throw error;
  }
};

/**
 * Thống kê số lượng vé đã đặt theo từng phim (bao gồm top 5)
 * @returns {Promise<Object>} { allMovies: Array, top5: Array }
 */
const getTicketStatisticsByMovie = async () => {
  try {
    const result = await Ticket.aggregate([
      {
        $lookup: {
          from: "screenings",
          localField: "screening",
          foreignField: "_id",
          as: "screening",
        },
      },
      {
        $unwind: "$screening",
      },
      {
        $lookup: {
          from: "scheduledscreenings",
          localField: "screening.scheduledScreening",
          foreignField: "_id",
          as: "scheduledScreening",
        },
      },
      {
        $unwind: "$scheduledScreening",
      },
      {
        $lookup: {
          from: "movies",
          localField: "scheduledScreening.movie",
          foreignField: "_id",
          as: "movie",
        },
      },
      {
        $unwind: "$movie",
      },
      {
        $group: {
          _id: "$movie._id",
          movieTitle: { $first: "$movie.title" },
          moviePoster: { $first: "$movie.media.images.poster" },
          ticketCount: { $sum: 1 },
          revenue: {
            $sum: {
              $reduce: {
                input: "$seats",
                initialValue: 0,
                in: {
                  $add: [
                    "$$value",
                    { $ifNull: ["$$this.type.price", 0] },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          movieId: "$_id",
          movieTitle: 1,
          moviePoster: 1,
          ticketCount: 1,
          revenue: 1,
        },
      },
      {
        $sort: { ticketCount: -1 },
      },
    ]);

    // Separate top 5 and all movies
    const top5 = result.slice(0, 5);
    const allMovies = result;

    return {
      allMovies,
      top5,
    };
  } catch (error) {
    console.error("Error calculating ticket statistics by movie:", error);
    throw error;
  }
};

/**
 * Đếm số lượng lịch chiếu trong tuần (đầu tuần → cuối tuần)
 * @returns {Promise<Object>} { startDate: string, endDate: string, count: number, showtimes: Array }
 */
const getShowtimesCountInWeek = async () => {
  try {
    // Get start and end of current week (Monday to Sunday)
    const now = new Date();
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const result = await Screening.aggregate([
      {
        $match: {
          date: {
            $gte: startOfWeek,
            $lte: endOfWeek,
          },
        },
      },
      {
        $lookup: {
          from: "scheduledscreenings",
          localField: "scheduledScreening",
          foreignField: "_id",
          as: "scheduledScreening",
        },
      },
      {
        $unwind: "$scheduledScreening",
      },
      {
        $lookup: {
          from: "movies",
          localField: "scheduledScreening.movie",
          foreignField: "_id",
          as: "movie",
        },
      },
      {
        $unwind: "$movie",
      },
      {
        $lookup: {
          from: "cinemas",
          localField: "scheduledScreening.cinema",
          foreignField: "_id",
          as: "cinema",
        },
      },
      {
        $unwind: "$cinema",
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          showtimes: {
            $push: {
              id: "$_id",
              date: "$date",
              time: "$scheduledScreening.time",
              movieTitle: "$movie.title",
              cinemaTitle: "$cinema.title",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          count: 1,
          showtimes: 1,
        },
      },
    ]);

    const count = result.length > 0 ? result[0].count : 0;
    const showtimes = result.length > 0 ? result[0].showtimes : [];

    return {
      startDate: startOfWeek.toISOString().split("T")[0],
      endDate: endOfWeek.toISOString().split("T")[0],
      count,
      showtimes: showtimes.sort((a, b) => new Date(a.date) - new Date(b.date)),
    };
  } catch (error) {
    console.error("Error calculating showtimes count in week:", error);
    throw error;
  }
};

/**
 * Tính tổng số vé đã bán theo từng phim (tối ưu hơn)
 * Sử dụng lookup để lấy giá từ SeatType
 */
const getTicketCountByMovie = async () => {
  try {
    const result = await Ticket.aggregate([
      {
        $lookup: {
          from: "screenings",
          localField: "screening",
          foreignField: "_id",
          as: "screening",
        },
      },
      {
        $unwind: "$screening",
      },
      {
        $lookup: {
          from: "scheduledscreenings",
          localField: "screening.scheduledScreening",
          foreignField: "_id",
          as: "scheduledScreening",
        },
      },
      {
        $unwind: "$scheduledScreening",
      },
      {
        $lookup: {
          from: "movies",
          localField: "scheduledScreening.movie",
          foreignField: "_id",
          as: "movie",
        },
      },
      {
        $unwind: "$movie",
      },
      {
        $unwind: "$seats",
      },
      {
        $lookup: {
          from: "seattypes",
          localField: "seats.type",
          foreignField: "_id",
          as: "seatType",
        },
      },
      {
        $unwind: "$seatType",
      },
      {
        $group: {
          _id: "$movie._id",
          movieTitle: { $first: "$movie.title" },
          moviePoster: { $first: "$movie.media.images.poster" },
          ticketCount: { $sum: 1 },
          revenue: { $sum: "$seatType.price" },
        },
      },
      {
        $project: {
          _id: 0,
          movieId: "$_id",
          movieTitle: 1,
          moviePoster: 1,
          ticketCount: 1,
          revenue: 1,
        },
      },
      {
        $sort: { ticketCount: -1 },
      },
    ]);

    const top5 = result.slice(0, 5);

    return {
      allMovies: result,
      top5,
    };
  } catch (error) {
    console.error("Error calculating ticket count by movie:", error);
    throw error;
  }
};

module.exports = {
  getTotalRevenue,
  getRevenueByCinema,
  getRevenueByTime,
  getBookingCountByTime,
  getTicketStatisticsByMovie: getTicketCountByMovie, // Using optimized version
  getShowtimesCountInWeek,
};
