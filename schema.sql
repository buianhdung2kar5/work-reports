-- ============================================================
-- SCHEMAS POSTGRESQL CHUẨN CHO SUPABASE (DÀNH CHO SINH VIÊN)
-- Dự án: Báo Cáo Tiến Độ Tập Văn Nghệ Sinh Viên (Chi Đoàn K65)
-- ============================================================

-- 1. KÍCH HOẠT EXTENSION UUID (NẾU CHƯA CÓ)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. HÀM TỰ ĐỘNG CẬP NHẬT UPDATED_AT TIMESTAMP
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- BẢNG 1: OVERVIEW (Thông tin dự án văn nghệ Sinh viên)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS overview (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  show_name VARCHAR(255) NOT NULL DEFAULT 'Vũ Điệu Tuổi Trẻ - Chào Tân Sinh Viên',
  class_name VARCHAR(100) NOT NULL DEFAULT 'Chi Đoàn CNTT K65',
  teachers TEXT NOT NULL DEFAULT 'Trưởng nhóm: Nguyễn Văn Nam & Phó nhóm: Trần Thị Hương',
  total_members INTEGER NOT NULL DEFAULT 35,
  performance_date DATE NOT NULL DEFAULT '2026-10-20',
  general_goal TEXT NOT NULL,
  completion_criteria TEXT NOT NULL,
  overall_status VARCHAR(50) NOT NULL DEFAULT 'Đang tập' 
    CHECK (overall_status IN ('Chưa bắt đầu', 'Đang tập', 'Cần hỗ trợ', 'Đạt', 'Hoàn thành')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- BẢNG 2: PRIORITIES (Việc ưu tiên buổi tập tiếp theo)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS priorities (
  id VARCHAR(100) PRIMARY KEY,
  task TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  sort_order SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- BẢNG 3: WEEKLY_GOALS (Kế hoạch & Mục tiêu theo tuần)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS weekly_goals (
  id VARCHAR(50) PRIMARY KEY,
  week_label VARCHAR(100) NOT NULL,
  timeframe VARCHAR(100) NOT NULL,
  goal TEXT NOT NULL,
  content TEXT NOT NULL,
  target_group VARCHAR(255) NOT NULL DEFAULT 'Toàn đội',
  criteria TEXT NOT NULL,
  progress SMALLINT NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status VARCHAR(50) NOT NULL DEFAULT 'Chưa bắt đầu' 
    CHECK (status IN ('Chưa bắt đầu', 'Đang thực hiện', 'Cần hỗ trợ', 'Đạt')),
  notes TEXT,
  sort_order SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- BẢNG 4: PRACTICE_LOGS (Nhật ký sau mỗi buổi tập)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS practice_logs (
  id VARCHAR(100) PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  session_num INTEGER NOT NULL CHECK (session_num > 0),
  content TEXT NOT NULL,
  attendance VARCHAR(50) NOT NULL DEFAULT '35/35',
  result TEXT,
  progress SMALLINT NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  issues TEXT,
  support_needed TEXT,
  next_tasks TEXT,
  author VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- BẢNG 5: FOCUSED_NOTES (Ghi chú tập trung)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS focused_notes (
  id BIGSERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL 
    CHECK (category IN ('music', 'formation', 'costumes', 'schedule', 'health')),
  item_text TEXT NOT NULL,
  is_checked BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- TRIGGERS & RLS POLICIES
-- ------------------------------------------------------------
ALTER TABLE overview ENABLE ROW LEVEL SECURITY;
ALTER TABLE priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE focused_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all overview" ON overview;
DROP POLICY IF EXISTS "Allow public all priorities" ON priorities;
DROP POLICY IF EXISTS "Allow public all weekly_goals" ON weekly_goals;
DROP POLICY IF EXISTS "Allow public all practice_logs" ON practice_logs;
DROP POLICY IF EXISTS "Allow public all focused_notes" ON focused_notes;

CREATE POLICY "Allow public all overview" ON overview FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all priorities" ON priorities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all weekly_goals" ON weekly_goals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all practice_logs" ON practice_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all focused_notes" ON focused_notes FOR ALL USING (true) WITH CHECK (true);

-- ------------------------------------------------------------
-- SEED DATA
-- ------------------------------------------------------------
INSERT INTO overview (show_name, class_name, teachers, total_members, performance_date, general_goal, completion_criteria, overall_status)
VALUES (
  'Vũ Điệu Tuổi Trẻ - Chào Tân Sinh Viên',
  'Chi Đoàn CNTT K65',
  'Trưởng nhóm: Nguyễn Văn Nam & Phó nhóm: Trần Thị Hương',
  35,
  '2026-10-20',
  'Thuộc toàn bộ bài hát phối khí mới, di chuyển chuyển khối đội hình 4 hàng ngang, thực hiện đều động tác múa hiện đại, biểu diễn tự tin tại Hội trường A.',
  '95% sinh viên nhớ đúng vị trí đội hình, thuộc bài hát, trang phục đạo cụ đầy đủ, duyệt cấp Đoàn hội đạt điểm xuất sắc.',
  'Đang tập'
) ON CONFLICT DO NOTHING;

INSERT INTO priorities (id, task, author, date, sort_order) VALUES
('p-1', 'Luyện hát nhóm nhỏ cho sinh viên Nam.', 'Trưởng nhóm Nam', '2026-10-02', 1),
('p-2', 'Tổ chức tập bổ sung 30 phút cho nhóm múa nam.', 'Phó nhóm Hương', '2026-10-07', 2),
('p-3', 'Dán băng dính vạch mốc di chuyển trên sàn nhà thể thao.', 'Trưởng nhóm Nam', '2026-10-12', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO weekly_goals (id, week_label, timeframe, goal, content, target_group, criteria, progress, status, notes, sort_order) VALUES
('w1', 'Tuần 1', '01/10 - 05/10/2026', 'Thuộc lời bài hát & Khớp nhạc nền bài 1', 'Luyện giọng hát theo tông nhạc mới, nhún chân nhịp nhàng, khớp vị trí đứng khởi động.', 'Toàn chi đoàn (35 sinh viên)', '90% sinh viên thuộc đúng lời và giữ đúng tiết tấu.', 100, 'Đạt', 'Các thành viên tiếp thu lời bài hát tốt.', 1),
('w2', 'Tuần 2', '06/10 - 10/10/2026', 'Tập động tác tay & Di chuyển chuyển khối', 'Động tác múa hiện đại tay trái tay phải, di chuyển từ 2 hàng ngang sang 2 hàng dọc.', 'Toàn chi đoàn (35 sinh viên)', '85% sinh viên đi chuyển khối đúng nhịp nhạc đoạn 1.', 75, 'Đang thực hiện', 'Nhóm nam cần hỗ trợ thêm thời gian thao tác uốn sóng tay.', 2),
('w3', 'Tuần 3', '11/10 - 15/10/2026', 'Ghép đội hình 4 hàng & Chuyển đoạn bài 2', 'Đội hình hình thoi -> 4 hàng ngang, kết hợp đạo cụ lụa cờ đoàn.', 'Nhóm múa chính (12 sinh viên)', 'Chuyển đội hình mượt mà không va chạm, chuẩn mốc nhạc.', 50, 'Cần hỗ trợ', 'Sinh viên Hoàng và sinh viên Tuấn cần ôn lại vị trí hàng 3.', 3),
('w4', 'Tuần 4', '16/10 - 19/10/2026', 'Tổng duyệt sân khấu Hội trường & Khớp đèn', 'Khớp hệ thống âm thanh ánh sáng sân khấu lớn, mặc trang phục biểu diễn chính thức.', 'Toàn chi đoàn (35 sinh viên)', 'Trình diễn tự tin, không trễ nhịp, hoàn tất tổng duyệt.', 0, 'Chưa bắt đầu', 'Tổng duyệt chính thức lúc 14h00 ngày 19/10 tại Hội trường A.', 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO practice_logs (id, date, session_num, content, attendance, result, progress, issues, support_needed, next_tasks, author) VALUES
('log-1', '2026-10-02', 1, 'Tập hát ca khúc chủ đề & Khớp nhịp giai điệu', '35/35', 'Toàn đội thuộc lời nhanh, hát đúng tông.', 90, 'Sinh viên Nam chưa tự tin hát to ở đoạn cao trào.', 'Sinh viên Nam', 'Luyện hát nhóm nhỏ cho sinh viên Nam.', 'Trưởng nhóm Nam'),
('log-2', '2026-10-07', 2, 'Tập tổ hợp động tác tay & Khớp hàng 1, 2', '33/35', 'Nhóm nữ múa rất đúng nhịp và đều.', 70, 'Thao tác tay còn hơi cứng ở nhóm nam.', 'Nhóm múa nam (Tuấn, Huy, An)', 'Tổ chức tập bổ sung 30 phút cho nhóm múa nam.', 'Phó nhóm Hương'),
('log-3', '2026-10-12', 3, 'Chuyển đội hình từ 2 hàng dọc sang 4 hàng ngang', '34/35', 'Hoàn thành 60% tiến trình chuyển khối.', 55, 'Hàng 3 và hàng 4 bị chen nhau khi chuyển hướng trái.', 'Nhóm múa nam (Hoàng, Tuấn)', 'Dán băng dính vạch mốc di chuyển trên sàn nhà thể thao.', 'Trưởng nhóm Nam')
ON CONFLICT (id) DO NOTHING;

INSERT INTO focused_notes (category, item_text, is_checked, sort_order) VALUES
('music', 'Bản phối khí ca khúc tuổi trẻ: Thời lượng chuẩn 4 phút 15 giây.', true, 1),
('music', 'Hạ âm lượng ở phút 2:30 để ban cán sự phát biểu dẫn thoại.', false, 2),
('music', 'Đã chép bản âm thanh USB gửi Ban tổ chức Hội đồng trường.', true, 3),
('formation', '4 mốc đội hình: Khởi đầu (Tập trung) -> 2 Hàng ngang -> Hình thoi -> Kết thúc (Tạo hình ngọn lửa).', true, 1),
('formation', 'Điểm nhấn: Giơ cờ đoàn đồng loạt ở giây thứ 45.', false, 2),
('formation', 'Lưu ý khoảng cách đứng của sinh viên Tuấn và Hoàng.', false, 3),
('costumes', '35 bộ trang phục đồng phục sinh viên: Đã đặt may xong.', true, 1),
('costumes', '35 dải lụa cờ đoàn: Đã chuẩn bị đủ.', true, 2),
('costumes', 'Phụ kiện cài áo cho thành viên: Hạn hoàn thành 15/10.', false, 3),
('schedule', 'Lịch tập chính: 17h30 - 19h00 các ngày Thứ 2, 4, 6 tại Nhà thể thao.', true, 1),
('schedule', 'Tổng duyệt cấp Trường: 14h00 chiều 19/10 tại Hội trường A.', false, 2),
('schedule', 'Biểu diễn chính thức: 19h30 tối ngày 20/10/2026.', false, 3),
('health', 'Sinh viên Hoàng mới ốm dậy, sắp xếp nghỉ giữa giờ tập.', true, 1),
('health', 'Sinh viên An bị chấn thương nhẹ ở cổ chân, phân công múa vị trí đứng yên.', true, 2)
ON CONFLICT DO NOTHING;
