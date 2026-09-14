# 🎭 Báo Cáo Tiến Độ Tập Văn Nghệ Sinh Viên (Chi Đoàn K65)

Ứng dụng web quản lý và theo dõi tiến độ tập luyện văn nghệ trực quan, hiện đại dành cho Ban cán sự Chi Đoàn & Đội văn nghệ Sinh viên. 

Dự án tích hợp đầy đủ hệ thống quản lý mục tiêu tuần, nhật ký từng buổi tập, bảng ghi chú chuyên sâu, hệ thống CMS quản trị cấu hình chương trình và hỗ trợ đồng bộ dữ liệu Cloud qua **Supabase** (với cơ chế dự phòng **LocalStorage Fallback**).

---

## 📸 Tổng Quan Giao Diện

Ứng dụng được thiết kế theo phong cách **Glassmorphic UI**, hỗ trợ giao diện đáp ứng linh hoạt (Responsive Design) trên cả máy tính, tablet và điện thoại di động:

- **Desktop / Laptop**: Thanh điều hướng Tabs linh hoạt ở Header, giao diện bảng điều khiển đa cột.
- **Mobile Device**: Thanh điều hướng dạng Bottom Navigation Bar tiện lợi ở góc dưới màn hình.

---

## ✨ Các Tính Năng Chính

Ứng dụng được chia thành **5 Phân khu chức năng chính (Tabs)**:

### 1. 📊 Tổng Quan (Dashboard Overview)
- **Countdown Banner**: Đếm ngược số ngày còn lại đến ngày biểu diễn chính thức kèm mục tiêu chung.
- **Circular Gauge Progress Chart**: Biểu đồ hình tròn hiển thị tổng phần trăm hoàn thành tiết mục.
- **Quick Metrics Cards**: Thống kê nhanh về số tuần đạt, số buổi tập đã ghi, tổng sĩ số sinh viên và số lượng sinh viên/nhóm cần hỗ trợ gấp.
- **Weekly Progress Bar Chart**: Biểu đồ cột biểu diễn tiến độ chi tiết qua từng tuần tập luyện.
- **Việc Ưu Tiên Buổi Sau**: Danh mục công việc cần gấp rút xử lý trong buổi tập kế tiếp (Cho phép Thêm/Sửa/Xóa).

### 2. 📅 Mục Tiêu Tuần (Weekly Goals)
- Lập kế hoạch tập luyện rõ ràng cho từng tuần (Nội dung tập, đối tượng phụ trách, tiêu chí đánh giá).
- **Thanh Kéo Slider Progress**: Cho phép cập nhật phần trăm hoàn thành của từng tuần trực tiếp.
- **Bộ Lọc Trạng Thái (Status Filter)**: Lọc mục tiêu theo *Tất cả*, *Đạt (Hoàn thành)*, *Đang thực hiện*, *Cần hỗ trợ*, *Chưa bắt đầu*.
- Hỗ trợ Thêm/Sửa/Xóa mục tiêu tuần dễ dàng.

### 3. 📖 Nhật Ký Buổi Tập (Practice Logs)
- Ghi chép chi tiết kết quả sau mỗi buổi tập (Số sinh viên tham gia, nội dung đã tập, điểm chưa đạt, sinh viên cần hỗ trợ, người cập nhật).
- **Hộp Tìm Kiếm Thông Minh (Live Search)**: Tìm kiếm nhật ký theo nội dung, tên người ghi hoặc ngày tập.
- Hỗ trợ chỉnh sửa và xóa nhật ký buổi tập.

### 4. 📌 Ghi Chú Tập Trung (Focused Notes)
Quản lý danh sách ghi chú kiểm tra (Checklist) được phân chia theo 5 chuyên mục trọng tâm:
1. 🎵 **Nhạc & Âm thanh**: Bản phối khí, thời lượng, giảm âm lượng, USB chép nhạc gửi BTC.
2. 👟 **Động tác & Đội hình**: Vị trí đứng 4 mốc đội hình, điểm nhấn giơ cờ đoàn, khoảng cách đứng.
3. 👗 **Trang phục & Đạo cụ**: Đồng phục sinh viên, dải lụa cờ đoàn, phụ kiện cài áo.
4. ⏰ **Lịch tập & Biểu diễn**: Lịch tập định kỳ, tổng duyệt cấp Trường, thời gian diễn chính thức.
5. 🩺 **Sức khỏe & Sĩ số**: Theo dõi sinh viên ốm dậy, chấn thương nhẹ để phân công vị trí phù hợp.

### 5. ⚙️ CMS Quản Trị Cấu Hình (Program Settings)
Bảng quản trị cho phép Ban cán sự lớp tùy chỉnh toàn bộ thông số dự án:
- Tên chương trình / tiết mục văn nghệ.
- Tên đơn vị / Chi đoàn.
- Tổng số thành viên (Sĩ số sinh viên).
- Trưởng nhóm / Phụ trách chuyên môn.
- Ngày biểu diễn chính thức.
- Trạng thái chung của chương trình.
- Mục tiêu chung & Tiêu chí hoàn thành tiết mục.

---

## ⚡ Cơ Chế Lưu Trữ & Đồng Bộ Dữ Liệu (Hybrid Data Layer)

Ứng dụng hỗ trợ cơ chế lưu trữ kép linh hoạt:

1. **Supabase Cloud Database**:
   - Tự động kết nối với Supabase qua API Key được cấu hình trong `.env` hoặc `window.ENV_*`.
   - Lưu trữ dữ liệu thực thời gian thực (Realtime Cloud Sync) trên PostgreSQL.
   - Bảo mật dòng dữ liệu với Row Level Security (RLS) policies.
2. **LocalStorage Fallback Mode**:
   - Nếu chưa cấu hình Supabase hoặc mất kết nối mạng, ứng dụng tự động chuyển sang lưu trữ trên `LocalStorage` của trình duyệt.
   - Cho phép hoạt động ngoại tuyến (Offline-First) 100% mà không bị gián đoạn hay mất dữ liệu.
   - Nút **Reset dữ liệu** giúp khôi phục về trạng thái mẫu ban đầu bất cứ lúc nào.

---

## 🧪 Hệ Thống Automated Test Runner Suite

Ứng dụng được tích hợp sẵn một bộ **Kiểm Thử Tự Động (Auto Test Runner)** chạy trực tiếp trên trình duyệt:

- Tự động kích hoạt khi mở ứng dụng qua **Live Server** (`localhost`, `127.0.0.1`) hoặc khi thêm tham số `?test=auto` vào URL.
- Thực thi tự động **9 Test Cases** kiểm thử toàn diện:
  1. `TC-01`: Kiểm tra Render Header & Thông tin Lớp/Tiết mục.
  2. `TC-02`: Kiểm tra Chuyển đổi giữa 5 Navigation Tabs.
  3. `TC-03`: Kiểm tra Form CMS Quản trị Cấu hình.
  4. `TC-04`: Kiểm tra Công thức tính Tiến độ Tổng thể.
  5. `TC-05`: Kiểm tra Slider Cập nhật % Mục tiêu Tuần.
  6. `TC-06`: Kiểm tra Thêm mới Nhật ký Buổi tập.
  7. `TC-07`: Kiểm tra Sửa & Xóa Nhật ký Buổi tập.
  8. `TC-08`: Kiểm tra Checkbox Ghi chú Tập trung.
  9. `TC-09`: Kiểm tra Supabase Store & LocalStorage Fallback.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: HTML5, Vanilla JavaScript (ES6+), CSS3 (Custom Glassmorphism & Micro-animations).
- **Styling UI Framework**: [Tailwind CSS CDN](https://tailwindcss.com/)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Visual & Charts**: [Chart.js](https://www.chartjs.org/) (Doughnut Gauge Chart & Bar Chart), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti), [GSAP](https://greensock.com/gsap/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Supabase JS Client v2)
- **Environment**: Client-side `.env` Loader (`env-loader.js`)

---

## 📁 Cấu Trúc Thư Mục

```text
BaoCaoCongViec/
├── index.html              # Giao diện HTML chính (5 Tabs, Modals & Mobile Bottom Nav)
├── styles.css              # Custom Styles, Glassmorphism UI & Keyframe Animations
├── app.js                  # Logic xử lý giao diện, State Management & Event Handling
├── env-loader.js           # Bộ nạp biến môi trường từ file .env
├── supabase-config.js      # Tích hợp Supabase Data Layer & LocalStorage Fallback
├── schema.sql              # File cấu trúc bảng PostgreSQL & Seed Data cho Supabase
├── test-runner.js          # Bộ kiểm thử tự động 9 test cases tích hợp trên trình duyệt
├── .env                    # Chứa Supabase URL & Anon Key (không commit thông tin nhạy cảm)
├── .env.example            # File mẫu cấu hình biến môi trường
└── README.md               # Tài liệu hướng dẫn sử dụng & triển khai dự án
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Khởi chạy Ứng dụng Trực tiếp (Chế độ LocalStorage Fallback)
Bạn không bắt buộc phải cài đặt Node.js hay Build tool:
1. Mở file `index.html` trực tiếp bằng trình duyệt web (Chrome, Edge, Firefox...).
2. Hoặc sử dụng tiện ích **Live Server** trên VS Code / Antigravity IDE để khởi chạy tại `http://127.0.0.1:5500`.

### 2. Cấu hình Kết nối Supabase Cloud (Tùy chọn)
Nếu muốn đồng bộ dữ liệu qua đám mây cho nhiều thành viên cùng xem:
1. Tạo một project mới trên [Supabase.com](https://supabase.com/).
2. Đổ toàn bộ nội dung file `schema.sql` vào mục **SQL Editor** trên Supabase Dashboard và nhấn **Run** để khởi tạo các bảng & dữ liệu mẫu.
3. Tạo file `.env` tại thư mục gốc (hoặc sao chép từ `.env.example`) và điền thông số:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. F5 lại ứng dụng. Màn hình Console sẽ thông báo `⚡ Supabase Client initialized successfully`.

---

## 📝 Giấy Phép & Tác Quyền

Dự án được xây dựng cho công tác quản lý hoạt động phong trào văn nghệ của Sinh viên Chi Đoàn K65. Hỗ trợ phát triển và duy trì bởi Ban cán sự Chi Đoàn.
