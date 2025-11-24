# Kiến Trúc Tổng Thể - Showtime System

## Tổng Quan

Showtime là hệ thống đặt vé xem phim được xây dựng theo kiến trúc **Microservices**, sử dụng:
- **Backend**: Node.js với Express.js
- **Database**: MongoDB (Mongoose)
- **Frontend**: React.js
- **Payment**: Stripe
- **Deployment**: Kubernetes (K8s)
- **External API**: TMDB (The Movie Database) cho tìm kiếm phim

---

## Kiến Trúc Microservices

Hệ thống được chia thành **10 microservices** độc lập, mỗi service chịu trách nhiệm cho một domain cụ thể:

### 1. **auth-api** - Authentication Service
- **Chức năng**: Quản lý xác thực và phân quyền người dùng
- **Routes**: `/authentication`
- **Endpoints**:
  - `POST /authentication/login` - Đăng nhập
  - `POST /authentication/register` - Đăng ký
  - `POST /authentication/logout` - Đăng xuất
  - `PUT /authentication/update` - Cập nhật thông tin
  - `GET /authentication/protected` - Kiểm tra quyền truy cập
  - `GET /authentication/admin` - Kiểm tra quyền admin
- **Triển khai**:
  - Sử dụng JWT (jsonwebtoken) cho authentication
  - Bcrypt để hash password
  - Cookie-based session
  - Middleware authorization hỗ trợ roles: ADMIN, USER, STAFF

### 2. **user-api** - User Management Service
- **Chức năng**: Quản lý thông tin người dùng
- **Routes**: `/users`
- **Triển khai**:
  - CRUD operations cho user
  - Quản lý tickets của user
  - Tích hợp với auth-api để xác thực

### 3. **cinema-api** - Cinema Management Service
- **Chức năng**: Quản lý rạp chiếu phim
- **Routes**: `/cinemas`
- **Endpoints**:
  - `GET /cinemas` - Lấy danh sách rạp
  - `GET /cinemas/:title` - Lấy thông tin rạp theo title
  - `POST /cinemas` - Tạo rạp mới (Admin only)
  - `PUT /cinemas/:title` - Cập nhật rạp (Admin only)
- **Triển khai**:
  - Quản lý cấu trúc ghế ngồi (map.rows.type)
  - Populate với SeatType để lấy thông tin loại ghế

### 4. **movie-api** - Movie Management Service
- **Chức năng**: Quản lý phim
- **Routes**: `/movies`
- **Endpoints**:
  - `GET /movies` - Lấy danh sách phim
  - `GET /movies?screenings=true` - Lấy phim kèm lịch chiếu
  - `GET /movies/:id` - Lấy thông tin phim
  - `POST /movies` - Tạo phim mới (Admin only)
  - `PUT /movies/:id` - Cập nhật phim (Admin only)
  - `DELETE /movies/:id` - Xóa phim (Admin only)
- **Triển khai**:
  - Tích hợp với ScheduledScreening để quản lý lịch chiếu định kỳ

### 5. **screening-api** - Screening Management Service
- **Chức năng**: Quản lý lịch chiếu phim
- **Routes**: `/screenings`
- **Triển khai**:
  - Quản lý ScheduledScreening (lịch chiếu định kỳ theo ngày trong tuần)
  - Tự động tạo Screening (lịch chiếu cụ thể) dựa trên ScheduledScreening
  - Sử dụng service Weekdays để tính toán ngày chiếu
  - Quản lý bookedSeats cho mỗi screening

### 6. **seattype-api** - Seat Type Management Service
- **Chức năng**: Quản lý loại ghế ngồi
- **Routes**: `/seattypes`
- **Triển khai**:
  - CRUD operations cho SeatType
  - Quản lý giá vé theo loại ghế
  - Tích hợp với Cinema map

### 7. **ticket-api** - Ticket Management Service
- **Chức năng**: Quản lý vé đã mua
- **Routes**: `/tickets`
- **Endpoints**:
  - `GET /tickets` - Lấy danh sách vé của user
  - `GET /tickets/:id` - Lấy thông tin vé cụ thể
  - `POST /tickets/:id/validate` - Xác thực vé (Staff/Admin)
- **Triển khai**:
  - Populate sâu với screening, cinema, movie, seats
  - QR Code validation cho staff

### 8. **payment-api** - Payment Processing Service
- **Chức năng**: Xử lý thanh toán
- **Routes**: `/payment`
- **Endpoints**:
  - `GET /payment/config` - Lấy Stripe public key
  - `POST /payment/create-payment-intent` - Tạo payment intent
  - `POST /payment/webhook` - Webhook từ Stripe
- **Triển khai**:
  - Tích hợp Stripe cho payment processing
  - Kiểm tra tính khả dụng của ghế trước khi thanh toán
  - Tạo Order trước khi payment
  - Sau khi payment thành công:
    - Tạo Ticket với QR Code
    - Gửi email ticket (Nodemailer)
    - Cập nhật bookedSeats trong Screening
    - Cập nhật Order status
  - Services:
    - `ScreeningValidation.js` - Validate ghế ngồi
    - `QRCode.js` - Tạo QR code cho ticket
    - `Nodemailer.js` - Gửi email ticket
    - `Tickets.js` - Xử lý ticket
    - `Datetime.js` - Xử lý datetime
    - `TransformNumber.js` - Chuyển đổi số tiền

### 9. **search-api** - Movie Search Service
- **Chức năng**: Tìm kiếm phim từ TMDB
- **Routes**: `/search`
- **Endpoints**:
  - `GET /search/movie?name=...` - Tìm kiếm phim trên TMDB
- **Triển khai**:
  - Tích hợp với TMDB API (The Movie Database)
  - Lấy thông tin chi tiết phim: videos, images, credits, keywords, release_dates
  - Proxy service để frontend không cần gọi trực tiếp TMDB

### 10. **statistic-api** - Statistics Service
- **Chức năng**: Thống kê và báo cáo
- **Routes**: `/statistics`
- **Endpoints**:
  - `GET /statistics/revenue/total` - Tổng doanh thu
  - `GET /statistics/revenue/cinema` - Doanh thu theo rạp
  - `GET /statistics/revenue/time` - Doanh thu theo thời gian
  - `GET /statistics/booking/time` - Số lượng booking theo thời gian
  - `GET /statistics/tickets/movie` - Thống kê vé theo phim
  - `GET /statistics/showtimes/week` - Số lượng suất chiếu trong tuần
- **Triển khai**:
  - Aggregation queries trên MongoDB
  - Hỗ trợ Admin và Staff roles

---

## Frontend (UI)

### **ui** - React Frontend Application
- **Framework**: React 18.2.0 với React Router DOM
- **UI Library**: React Bootstrap, Bootstrap 5
- **Payment**: Stripe React components
- **Features**:
  - Public pages: Home, Movie details, Ticketshop, Cart, Login, Register
  - User pages: Dashboard, Account, Tickets
  - Staff pages: Ticket Validation, Statistics
  - Admin pages: Movies, Cinemas, Screenings, SeatTypes, Staff management
- **State Management**:
  - Context API: UserContext, FlashContext
  - Custom hooks: useAuth, useUser, useFlash, useFetch
- **Authentication**: Cookie-based với JWT
- **Routing**: Protected routes dựa trên roles

---

## Database Schema

Tất cả services chia sẻ cùng một MongoDB database (Shared Database pattern):

### Models:
- **User**: username, password, firstName, lastName, email, role, tickets[]
- **Cinema**: title, map (rows với type reference)
- **Movie**: title, description, poster, cast, ageRating, etc.
- **SeatType**: name, price, color
- **ScheduledScreening**: movie, cinema, time, weekday
- **Screening**: scheduledScreening, date, bookedSeats[]
- **Order**: screening, customer, seats[], completed
- **Ticket**: customer, datetime, seats[], screening, codeSVG

---

## Kiến Trúc Triển Khai

### Kubernetes Deployment
- Mỗi service có:
  - `Dockerfile` để build container image
  - `k8s/` folder chứa Helm charts
  - `service.mjs` script để deploy/stop service
- Deployment script: `k8s/deploy.mjs` tự động deploy tất cả services
- Service discovery: Kubernetes ClusterIP services
- Port: Mỗi service expose trên port 8000 (internal)

### Service Communication
- **Pattern**: Direct HTTP calls (synchronous)
- **Service Discovery**: Kubernetes DNS (service-name:port)
- **Authentication**: JWT tokens được truyền qua headers/cookies
- **CORS**: Configured cho frontend origin

### Environment Variables
Mỗi service cần:
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Service port (default: 4000)
- `FRONTEND_URL` - Frontend URL cho CORS
- `JWT_SECRET` - JWT secret key (cho auth services)
- `STRIPE_SECRET_KEY`, `STRIPE_PUBLIC_KEY`, `STRIPE_ENDPOINT_SECRET` (payment-api)
- `TMDB_URL`, `TMDB_KEY`, `TMDB_URL_IMG` (search-api)
- Email config cho Nodemailer (payment-api)

---

## Luồng Xử Lý Chính

### 1. Đăng Ký/Đăng Nhập
```
User → UI → auth-api → MongoDB
         ← JWT Token ←
```

### 2. Đặt Vé
```
User → UI → screening-api (lấy lịch chiếu)
       → cinema-api (lấy thông tin ghế)
       → payment-api/create-payment-intent (tạo order)
       → Stripe (thanh toán)
       → payment-api/webhook (xử lý kết quả)
       → ticket-api (tạo ticket)
       → Email (gửi vé)
```

### 3. Tìm Kiếm Phim
```
User → UI → search-api → TMDB API
         ← Movie data ←
```

### 4. Quản Lý (Admin)
```
Admin → UI → [service]-api → MongoDB
       (với JWT authentication)
```

---

## Đặc Điểm Kỹ Thuật

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC): ADMIN, USER, STAFF
- Cookie-based session management
- Middleware `authorization()` cho route protection

### Payment Flow
- Stripe Payment Intents
- Webhook-based async processing
- Order → Payment → Ticket creation flow
- QR Code generation cho tickets

### Data Consistency
- Shared database pattern (tất cả services dùng chung MongoDB)
- Mongoose populate để join data
- Transaction support cho critical operations

### Error Handling
- Try-catch blocks trong routes
- HTTP status codes
- Error messages trong response

---

## Tóm Tắt

Hệ thống Showtime là một **microservices architecture** với:
- **10 backend services** độc lập, mỗi service phục vụ một domain cụ thể
- **1 React frontend** application
- **Shared MongoDB database** cho tất cả services
- **Kubernetes deployment** với Helm charts
- **Stripe integration** cho payment processing
- **TMDB integration** cho movie search
- **JWT-based authentication** với role-based authorization

Kiến trúc này cho phép:
- **Scalability**: Mỗi service có thể scale độc lập
- **Maintainability**: Code được tách biệt theo domain
- **Flexibility**: Dễ dàng thêm/sửa/xóa services
- **Deployment**: Containerized và orchestrated với K8s

