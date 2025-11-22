import { useEffect, useState } from "react";
import Container from "../../components/ui/Container";
import Content from "../../components/ui/Content";
import { BACKEND_URL } from "../../constants";
import useFetch from "../../hooks/useFetch";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import styles from "./Statistics.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [filter, setFilter] = useState("daily");
  const { fetch, isFetching } = useFetch();

  useEffect(() => {
    loadStatistics();
  }, [filter]);

  const loadStatistics = async () => {
    const res = await fetch.get(
      `${BACKEND_URL}/statistics/dashboard?filter=${filter}`
    );
    if (res.status === 200) {
      setStatistics(res.data);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  if (isFetching && !statistics) {
    return (
      <Container>
        <Content>
          <LoadingSpinner />
        </Content>
      </Container>
    );
  }

  if (!statistics) {
    return (
      <Container>
        <Content>
          <h1>Thống kê</h1>
          <p className="text-danger">Không thể tải dữ liệu thống kê</p>
        </Content>
      </Container>
    );
  }

  const {
    totalRevenue,
    revenueByCinema,
    revenueByTime,
    bookingCountByTime,
    movieStatistics,
    showtimesThisWeek,
  } = statistics;

  // Chuẩn bị dữ liệu cho Line Chart - Doanh thu theo thời gian
  const revenueLineData = {
    labels: revenueByTime?.map((item) => item.date) || [],
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: revenueByTime?.map((item) => item.revenue) || [],
        borderColor: "rgb(0, 86, 179)",
        backgroundColor: "rgba(0, 86, 179, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Chuẩn bị dữ liệu cho Line Chart - Số lượng đặt vé theo thời gian
  const bookingLineData = {
    labels: bookingCountByTime?.map((item) => item.date) || [],
    datasets: [
      {
        label: "Số lượng vé",
        data: bookingCountByTime?.map((item) => item.count) || [],
        borderColor: "rgb(40, 167, 69)",
        backgroundColor: "rgba(40, 167, 69, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Chuẩn bị dữ liệu cho Bar Chart - Doanh thu theo rạp
  const revenueBarData = {
    labels: revenueByCinema?.map((item) => item.cinemaTitle) || [],
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: revenueByCinema?.map((item) => item.revenue) || [],
        backgroundColor: [
          "rgba(0, 86, 179, 0.8)",
          "rgba(40, 167, 69, 0.8)",
          "rgba(255, 193, 7, 0.8)",
          "rgba(220, 53, 69, 0.8)",
          "rgba(108, 117, 125, 0.8)",
          "rgba(23, 162, 184, 0.8)",
          "rgba(102, 16, 242, 0.8)",
        ],
        borderColor: [
          "rgb(0, 86, 179)",
          "rgb(40, 167, 69)",
          "rgb(255, 193, 7)",
          "rgb(220, 53, 69)",
          "rgb(108, 117, 125)",
          "rgb(23, 162, 184)",
          "rgb(102, 16, 242)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // Chuẩn bị dữ liệu cho Pie Chart - Top 5 phim bán chạy
  const topMoviesPieData = {
    labels: movieStatistics?.top5?.map((item) => item.movieTitle) || [],
    datasets: [
      {
        label: "Số vé",
        data: movieStatistics?.top5?.map((item) => item.ticketCount) || [],
        backgroundColor: [
          "rgba(0, 86, 179, 0.8)",
          "rgba(40, 167, 69, 0.8)",
          "rgba(255, 193, 7, 0.8)",
          "rgba(220, 53, 69, 0.8)",
          "rgba(108, 117, 125, 0.8)",
        ],
        borderColor: [
          "rgb(0, 86, 179)",
          "rgb(40, 167, 69)",
          "rgb(255, 193, 7)",
          "rgb(220, 53, 69)",
          "rgb(108, 117, 125)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            weight: "500",
          },
          color: "#212529",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#212529",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        ticks: {
          color: "#212529",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: {
            size: 14,
            weight: "500",
          },
          color: "#212529",
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
  };

  return (
    <Container>
      <Content className={styles.content} style={{ minHeight: "70vh" }}>
        <div className={styles.header}>
          <h1>Thống kê hệ thống</h1>
          <hr />
          <div className={styles.filterGroup}>
            <label htmlFor="filter">Lọc theo thời gian: </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="daily">Theo ngày</option>
              <option value="weekly">Theo tuần</option>
              <option value="monthly">Theo tháng</option>
            </select>
          </div>
        </div>

        {/* Tổng doanh thu */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Tổng doanh thu</h2>
          <p className={styles.revenueTotal}>
            {formatCurrency(totalRevenue)}
          </p>
        </div>

        {/* Doanh thu theo rạp - Bar Chart */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Doanh thu theo rạp</h2>
          {revenueByCinema && revenueByCinema.length > 0 ? (
            <div className={styles.chartContainer}>
              <Bar data={revenueBarData} options={chartOptions} />
            </div>
          ) : (
            <p className="text-muted">Chưa có dữ liệu</p>
          )}
        </div>

        {/* Doanh thu theo thời gian - Line Chart */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Doanh thu theo thời gian</h2>
          {revenueByTime && revenueByTime.length > 0 ? (
            <div className={styles.chartContainer}>
              <Line data={revenueLineData} options={chartOptions} />
            </div>
          ) : (
            <p className="text-muted">Chưa có dữ liệu</p>
          )}
        </div>

        {/* Số lượng đặt vé theo thời gian - Line Chart */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Số lượng đặt vé theo thời gian</h2>
          {bookingCountByTime && bookingCountByTime.length > 0 ? (
            <div className={styles.chartContainer}>
              <Line data={bookingLineData} options={chartOptions} />
            </div>
          ) : (
            <p className="text-muted">Chưa có dữ liệu</p>
          )}
        </div>

        {/* Top 5 phim bán chạy - Pie Chart */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Top 5 phim bán chạy</h2>
          {movieStatistics?.top5 && movieStatistics.top5.length > 0 ? (
            <>
              <div className={styles.chartContainer}>
                <Pie data={topMoviesPieData} options={pieChartOptions} />
              </div>
              <div className={styles.movieList}>
                {movieStatistics.top5.map((item, index) => (
                  <div key={index} className={styles.movieItem}>
                    <div className={styles.movieInfo}>
                      {item.moviePoster && (
                        <img
                          src={item.moviePoster}
                          alt={item.movieTitle}
                          className={styles.moviePoster}
                        />
                      )}
                      <div>
                        <strong>{item.movieTitle}</strong>
                        <div className={styles.movieStats}>
                          <span>{item.ticketCount} vé</span>
                          <span>{formatCurrency(item.revenue)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-muted">Chưa có dữ liệu</p>
          )}
        </div>

        {/* Lịch chiếu trong tuần */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Lịch chiếu trong tuần</h2>
          {showtimesThisWeek ? (
            <div>
              <p className={styles.weekInfo}>
                Từ {formatDate(showtimesThisWeek.startDate)} đến{" "}
                {formatDate(showtimesThisWeek.endDate)}:{" "}
                <strong>{showtimesThisWeek.count} lịch chiếu</strong>
              </p>
              {showtimesThisWeek.showtimes &&
                showtimesThisWeek.showtimes.length > 0 ? (
                <div className={styles.tableContainer}>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Ngày</th>
                        <th>Giờ</th>
                        <th>Phim</th>
                        <th>Rạp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {showtimesThisWeek.showtimes.map((item, index) => (
                        <tr key={index}>
                          <td>{formatDate(item.date)}</td>
                          <td>{item.time}</td>
                          <td>{item.movieTitle}</td>
                          <td>{item.cinemaTitle}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">Không có lịch chiếu trong tuần</p>
              )}
            </div>
          ) : (
            <p className="text-muted">Chưa có dữ liệu</p>
          )}
        </div>
      </Content>
    </Container>
  );
};

export default Statistics;
