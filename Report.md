PHẦN 1 – MỞ ĐẦU
Prompt 1.1 – Lý do chọn đề tài

Hãy viết phần 1.1 Lý do chọn đề tài cho báo cáo hệ thống đặt vé xem phim Showtime, văn phong chuyên nghiệp, dài 1–1.5 trang.

Prompt 1.2 – Mục tiêu nghiên cứu

Hãy viết phần 1.2 Mục tiêu nghiên cứu gồm mục tiêu tổng quát và mục tiêu chi tiết.

Prompt 1.3 – Phạm vi hệ thống

Viết phần 1.3 Phạm vi hệ thống, chia phạm vi theo: chức năng – người dùng – kỹ thuật.

Prompt 1.4 – Phương pháp nghiên cứu

Hãy viết phần 1.4 Phương pháp nghiên cứu cho báo cáo Showtime.

Prompt 1.5 – Cấu trúc báo cáo

Viết phần 1.5 Cấu trúc báo cáo, mô tả nội dung từng chương.

PHẦN 2 – KHẢO SÁT & PHÂN TÍCH YÊU CẦU
Prompt 2.1 – Khảo sát hệ thống tương tự

Viết phần 2.1 Khảo sát hệ thống đặt vé hiện có (CGV, Galaxy, Lotte…), nêu điểm mạnh/yếu.

Prompt 2.2 – Yêu cầu chức năng và phi chức năng

Viết phần 2.2 Yêu cầu hệ thống gồm:

Yêu cầu chức năng (FR)

Yêu cầu phi chức năng (NFR)

Các vai trò người dùng

Prompt 2.3 – Danh sách Use Case chi tiết

Viết 2.3 Mô tả Use Case chi tiết cho hệ thống Showtime, mỗi use case có:

Tên

Actor

Mô tả

Preconditions / Postconditions

Normal / Alternate flow

PHẦN 3 – SƠ ĐỒ UML (CÓ YÊU CẦU GEN CODE PlantUML)
Prompt 3.1 – Sơ đồ Use Case tổng thể (PlantUML)

Hãy viết phần 3.1 Sơ đồ Use Case tổng thể cho hệ thống Showtime.
Sau phần mô tả, hãy gen mã PlantUML để tôi có thể paste vào PlainUML.

Prompt 3.2 – Use Case chi tiết + Class Diagram (PlantUML)

Hãy viết phần 3.2 + 3.3, gồm:

Giải thích sơ đồ lớp (Class Diagram)

Mô tả các lớp: User, Movie, Cinema, Screening, Ticket, Order, SeatType…
Sau phần mô tả, hãy gen mã PlantUML cho Class Diagram, đúng chuẩn UML, paste được vào PlainUML.

Prompt 3.3 – 5 Sơ đồ tuần tự (Sequence Diagram – PlantUML)

Hãy viết phần 3.4 Sơ đồ tuần tự cho 5 quy trình:

Đăng nhập

Lấy lịch chiếu

Đặt vé + thanh toán Stripe

Nhận email ticket

Staff kiểm tra QR code

Với mỗi mục:

Viết mô tả luồng hoạt động

Gen mã PlantUML sequence diagram để paste vào PlainUML

PHẦN 4 – THIẾT KẾ KIẾN TRÚC
Prompt 4.1 – Kiến trúc tổng thể

Hãy viết phần 4.1 Kiến trúc tổng thể của hệ thống Showtime, mô tả kiến trúc microservices.

Prompt 4.2 – Mô tả chi tiết 10 microservices

Hãy viết phần 4.2 Các Microservices cho hệ thống Showtime, mô tả đầy đủ 10 service (auth-api đến statistic-api), gồm:

Chức năng

Endpoint

Luồng xử lý

Kết nối với service khác

Prompt 4.3 – Thiết kế Frontend

Viết phần 4.3 Kiến trúc Frontend React, mô tả cấu trúc UI, flow thanh toán, quản lý session.

Prompt 4.4 – Kiến trúc database

Viết phần 4.4 Kiến trúc Database, mô tả ERD, các schema MongoDB và quan hệ.

Prompt 4.5 – Quy trình xử lý quan trọng

Viết phần 4.5 Quy trình xử lý cho:

Login

Booking

Payment webhook

Ticket creation

PHẦN 5 – TRIỂN KHAI HỆ THỐNG
Prompt 5.1 – Backend

Viết phần 5.1 Backend Implementation, mô tả folder, middleware, sample API.

Prompt 5.2 – Frontend

Viết phần 5.2 Frontend Implementation, mô tả cấu trúc, component chính.

Prompt 5.3 – Docker

Viết phần 5.3 Triển khai Docker, mô tả Dockerfile, build, image structure.

Prompt 5.4 – Kubernetes

Viết phần 5.4 Triển khai Kubernetes, mô tả Helm charts, scaling, ClusterIP, ingress.

PHẦN 6 – ĐÁNH GIÁ & HẠN CHẾ
Prompt 6.1 – Ưu điểm

Viết phần 6.1 Ưu điểm của hệ thống Showtime.

Prompt 6.2 – Hạn chế

Viết phần 6.2 Hạn chế, tập trung vào Shared DB + Stripe webhook.

PHẦN 7 – KẾT LUẬN & HƯỚNG PHÁT TRIỂN
Prompt 7.1 – Kết luận

Viết phần 7.1 Kết luận cho báo cáo.

Prompt 7.2 – Hướng phát triển

Viết phần 7.2 Hướng phát triển hệ thống Showtime.

PHỤ LỤC
Prompt PL.1 – Phụ lục mã nguồn

Tạo phụ lục mã nguồn (20–30 đoạn code minh họa backend + frontend).

Prompt PL.2 – Phụ lục UML

Gom toàn bộ code PlantUML vào một phụ lục.