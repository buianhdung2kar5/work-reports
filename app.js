/**
 * Báo Cáo Tiến Độ Tập Văn Nghệ Sinh Viên - Logic & Interactivity
 * Dành cho sinh viên Đại học / Cao đẳng (Chi Đoàn / Đội Văn Nghệ)
 * Tích hợp lưu trữ đồng bộ Supabase Cloud & LocalStorage Fallback.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'ART_PROGRESS_STUDENT_APP_V3';

  // Dữ liệu mặc định ban đầu dành cho Sinh viên
  const INITIAL_DATA = {
    overview: {
      showName: "Vũ Điệu Tuổi Trẻ - Chào Tân Sinh Viên",
      className: "Chi Đoàn CNTT K65",
      teachers: "Nguyễn Văn Nam & Trần Thị Hương",
      totalMembers: 35,
      performanceDate: "2026-10-20",
      generalGoal: "Thuộc toàn bộ bài hát phối khí mới, di chuyển chuyển khối đội hình 4 hàng ngang, thực hiện đều động tác múa hiện đại, biểu diễn tự tin tại Hội trường A.",
      completionCriteria: "95% sinh viên nhớ đúng vị trí đội hình, thuộc bài hát, trang phục đạo cụ đầy đủ, duyệt cấp Đoàn hội đạt điểm xuất sắc.",
      overallStatus: "Đang tập"
    },
    priorities: [
      { id: "p-1", task: "Luyện hát nhóm nhỏ cho sinh viên Nam.", author: "Trưởng nhóm Nam", date: "2026-10-02" },
      { id: "p-2", task: "Tổ chức tập bổ sung 30 phút cho nhóm múa nam.", author: "Phó nhóm Hương", date: "2026-10-07" },
      { id: "p-3", task: "Dán băng dính vạch mốc di chuyển trên sàn nhà thể thao.", author: "Trưởng nhóm Nam", date: "2026-10-12" }
    ],
    weeklyGoals: [
      {
        id: "w1",
        weekLabel: "Tuần 1",
        timeframe: "01/10 - 05/10/2026",
        goal: "Thuộc lời bài hát & Khớp nhạc nền bài 1",
        content: "Luyện giọng hát theo tông nhạc mới, nhún chân nhịp nhàng, khớp vị trí đứng khởi động.",
        targetGroup: "Toàn chi đoàn (35 sinh viên)",
        criteria: "90% sinh viên thuộc đúng lời và giữ đúng tiết tấu.",
        progress: 100,
        status: "Đạt",
        notes: "Các thành viên tiếp thu lời bài hát tốt."
      },
      {
        id: "w2",
        weekLabel: "Tuần 2",
        timeframe: "06/10 - 10/10/2026",
        goal: "Tập động tác tay & Di chuyển chuyển khối",
        content: "Động tác múa hiện đại tay trái tay phải, di chuyển từ 2 hàng ngang sang 2 hàng dọc.",
        targetGroup: "Toàn chi đoàn (35 sinh viên)",
        criteria: "85% sinh viên đi chuyển khối đúng nhịp nhạc đoạn 1.",
        progress: 75,
        status: "Đang thực hiện",
        notes: "Nhóm nam cần hỗ trợ thêm thời gian thao tác uốn sóng tay."
      },
      {
        id: "w3",
        weekLabel: "Tuần 3",
        timeframe: "11/10 - 15/10/2026",
        goal: "Ghép đội hình 4 hàng & Chuyển đoạn bài 2",
        content: "Đội hình hình thoi -> 4 hàng ngang, kết hợp đạo cụ lụa cờ đoàn.",
        targetGroup: "Nhóm múa chính (12 sinh viên)",
        criteria: "Chuyển đội hình mượt mà không va chạm, chuẩn mốc nhạc.",
        progress: 50,
        status: "Cần hỗ trợ",
        notes: "Sinh viên Hoàng và sinh viên Tuấn cần ôn lại vị trí hàng 3."
      },
      {
        id: "w4",
        weekLabel: "Tuần 4",
        timeframe: "16/10 - 19/10/2026",
        goal: "Tổng duyệt sân khấu Hội trường & Khớp đèn",
        content: "Khớp hệ thống âm thanh ánh sáng sân khấu lớn, mặc trang phục biểu diễn chính thức.",
        targetGroup: "Toàn chi đoàn (35 sinh viên)",
        criteria: "Trình diễn tự tin, không trễ nhịp, hoàn tất tổng duyệt.",
        progress: 0,
        status: "Chưa bắt đầu",
        notes: "Tổng duyệt chính thức lúc 14h00 ngày 19/10 tại Hội trường A."
      }
    ],
    logs: [
      {
        id: "log-1",
        date: "2026-10-02",
        sessionNum: 1,
        content: "Tập hát ca khúc chủ đề & Khớp nhịp giai điệu",
        attendance: "35/35",
        result: "Toàn đội thuộc lời nhanh, hát đúng tông.",
        progress: 90,
        issues: "Sinh viên Nam chưa tự tin hát to ở đoạn cao trào.",
        supportNeeded: "Sinh viên Nam",
        nextTasks: "Luyện hát nhóm nhỏ cho sinh viên Nam.",
        author: "Trưởng nhóm Nam"
      },
      {
        id: "log-2",
        date: "2026-10-07",
        sessionNum: 2,
        content: "Tập tổ hợp động tác tay & Khớp hàng 1, 2",
        attendance: "33/35",
        result: "Nhóm nữ múa rất đúng nhịp và đều.",
        progress: 70,
        issues: "Thao tác tay còn hơi cứng ở nhóm nam.",
        supportNeeded: "Nhóm múa nam (Tuấn, Huy, An)",
        nextTasks: "Tổ chức tập bổ sung 30 phút cho nhóm múa nam.",
        author: "Phó nhóm Hương"
      },
      {
        id: "log-3",
        date: "2026-10-12",
        sessionNum: 3,
        content: "Chuyển đội hình từ 2 hàng dọc sang 4 hàng ngang",
        attendance: "34/35",
        result: "Hoàn thành 60% tiến trình chuyển khối.",
        progress: 55,
        issues: "Hàng 3 và hàng 4 bị chen nhau khi chuyển hướng trái.",
        supportNeeded: "Nhóm múa nam (Hoàng, Tuấn)",
        nextTasks: "Dán băng dính vạch mốc di chuyển trên sàn nhà thể thao.",
        author: "Trưởng nhóm Nam"
      }
    ],
    notes: {
      music: [
        { id: 1, text: "Bản phối khí ca khúc tuổi trẻ: Thời lượng chuẩn 4 phút 15 giây.", checked: true },
        { id: 2, text: "Hạ âm lượng ở phút 2:30 để ban cán sự phát biểu dẫn thoại.", checked: false },
        { id: 3, text: "Đã chép bản âm thanh USB gửi Ban tổ chức Hội đồng trường.", checked: true }
      ],
      formation: [
        { id: 1, text: "4 mốc đội hình: Khởi đầu (Tập trung) -> 2 Hàng ngang -> Hình thoi -> Kết thúc (Tạo hình ngọn lửa).", checked: true },
        { id: 2, text: "Điểm nhấn: Giơ cờ đoàn đồng loạt ở giây thứ 45.", checked: false },
        { id: 3, text: "Lưu ý khoảng cách đứng của sinh viên Tuấn và Hoàng.", checked: false }
      ],
      costumes: [
        { id: 1, text: "35 bộ trang phục đồng phục sinh viên: Đã đặt may xong.", checked: true },
        { id: 2, text: "35 dải lụa cờ đoàn: Đã chuẩn bị đủ.", checked: true },
        { id: 3, text: "Phụ kiện cài áo cho thành viên: Hạn hoàn thành 15/10.", checked: false }
      ],
      schedule: [
        { id: 1, text: "Lịch tập chính: 17h30 - 19h00 các ngày Thứ 2, 4, 6 tại Nhà thể thao.", checked: true },
        { id: 2, text: "Tổng duyệt cấp Trường: 14h00 chiều 19/10 tại Hội trường A.", checked: false },
        { id: 3, text: "Biểu diễn chính thức: 19h30 tối ngày 20/10/2026.", checked: false }
      ],
      health: [
        { id: 1, text: "Sinh viên Hoàng mới ốm dậy, sắp xếp nghỉ giữa giờ tập.", checked: true },
        { id: 2, text: "Sinh viên An bị chấn thương nhẹ ở cổ chân, phân công múa vị trí đứng yên.", checked: true }
      ]
    }
  };

  // Global State
  let appState = loadState();
  let gaugeChart = null;
  let weeklyBarChart = null;

  // DOM Elements
  const tabBtns = document.querySelectorAll('.tab-btn, .tab-btn-mobile');
  const tabContents = document.querySelectorAll('.tab-content');
  const modalLog = document.getElementById('modal-log');
  const modalWeek = document.getElementById('modal-week');
  const modalPriority = document.getElementById('modal-priority');
  
  const formLog = document.getElementById('form-practice-log');
  const formWeek = document.getElementById('form-weekly-goal');
  const formPriority = document.getElementById('form-priority-task');
  const formCms = document.getElementById('form-cms-settings');

  // Initialize
  document.addEventListener('DOMContentLoaded', async () => {
    initIcons();
    initTabEvents();
    initModalEvents();
    initFilterEvents();
    initCmsEvents();

    if (window.SupabaseStore && window.SupabaseStore.isConfigured()) {
      const synced = await window.SupabaseStore.loadAllData(appState);
      if (synced) saveState();
    }

    renderAll();
  });

  function initIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load localStorage data, fallback to default", e);
    }
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
      console.error("Failed to save state to localStorage", e);
    }
  }

  function resetState() {
    appState = JSON.parse(JSON.stringify(INITIAL_DATA));
    saveState();
    renderAll();
    showToast("Đã khôi phục dữ liệu ban đầu!", "success");
  }

  function calculateOverallProgress() {
    if (!appState.weeklyGoals || appState.weeklyGoals.length === 0) return 0;
    const sum = appState.weeklyGoals.reduce((acc, curr) => acc + Number(curr.progress || 0), 0);
    return Math.round(sum / appState.weeklyGoals.length);
  }

  function getStatusInfo(progressPercent) {
    if (progressPercent >= 90) {
      return { text: "Đạt", badgeClass: "badge-status-dat", color: "#10b981" };
    } else if (progressPercent >= 60) {
      return { text: "Đang tập", badgeClass: "badge-status-dang-tap", color: "#f59e0b" };
    } else if (progressPercent > 0) {
      return { text: "Cần hỗ trợ", badgeClass: "badge-status-can-ho-tro", color: "#ef4444" };
    } else {
      return { text: "Chưa bắt đầu", badgeClass: "badge-status-chua-bat-dau", color: "#6b7280" };
    }
  }

  // ==================== RENDERING LOGIC ====================
  function renderAll() {
    const overallProgress = calculateOverallProgress();
    const statusInfo = getStatusInfo(overallProgress);

    renderHeaderAndBanner(overallProgress, statusInfo);
    renderMetrics(overallProgress);
    renderCharts(overallProgress);
    renderPriorities();
    renderWeeklyGoals();
    renderLogsList();
    renderNotes();
    renderCmsForm();
    initIcons();
  }

  function renderHeaderAndBanner(overallProgress, statusInfo) {
    const ov = appState.overview;
    
    const topBadge = document.getElementById('badge-top-status');
    if (topBadge) {
      topBadge.className = `px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusInfo.badgeClass}`;
      topBadge.textContent = ov.overallStatus || statusInfo.text;
    }

    document.getElementById('info-class').textContent = ov.className;
    document.getElementById('info-show-name').textContent = ov.showName;
    document.getElementById('overview-title').textContent = ov.showName;
    document.getElementById('overview-perf-date').textContent = formatDateVN(ov.performanceDate);
    document.getElementById('overview-teachers').textContent = ov.teachers;
    
    const bannerBadge = document.getElementById('overview-status-badge');
    if (bannerBadge) {
      bannerBadge.className = `px-2.5 py-0.5 rounded-full text-xs font-bold ${statusInfo.badgeClass}`;
      bannerBadge.textContent = ov.overallStatus || statusInfo.text;
    }

    document.getElementById('overview-general-goal').textContent = ov.generalGoal;
    document.getElementById('overall-percent-num').textContent = `${overallProgress}%`;

    const statusTextEl = document.getElementById('overall-status-text');
    if (statusTextEl) {
      if (overallProgress >= 90) statusTextEl.textContent = "Sẵn sàng biểu diễn!";
      else if (overallProgress >= 60) statusTextEl.textContent = "Tiến độ đạt yêu cầu";
      else statusTextEl.textContent = "Cần tăng tốc & hỗ trợ nhóm tập";
    }

    if (ov.performanceDate) {
      const perfDateObj = new Date(ov.performanceDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diffTime = perfDateObj - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const countdownEl = document.getElementById('countdown-days');
      if (countdownEl) {
        if (diffDays > 0) countdownEl.textContent = `Còn ${diffDays} ngày`;
        else if (diffDays === 0) countdownEl.textContent = `Hôm nay biểu diễn!`;
        else countdownEl.textContent = `Đã hoàn thành biểu diễn`;
      }
    }
  }

  function renderMetrics(overallProgress) {
    const completedWeeks = appState.weeklyGoals.filter(w => w.progress >= 90).length;
    document.getElementById('stat-completed-weeks').textContent = `${completedWeeks} / ${appState.weeklyGoals.length} Tuần`;
    document.getElementById('stat-total-logs').textContent = `${appState.logs.length} Buổi`;
    
    const totalMem = appState.overview.totalMembers || 35;
    document.getElementById('stat-total-members').textContent = `${totalMem} Sinh viên`;

    const supportLogs = appState.logs.filter(l => l.supportNeeded && l.supportNeeded.trim() !== '');
    document.getElementById('stat-need-support-count').textContent = `${supportLogs.length} Sinh viên / Nhóm`;
  }

  function renderCharts(overallProgress) {
    const ctxGauge = document.getElementById('chart-overall-gauge');
    if (ctxGauge) {
      if (gaugeChart) gaugeChart.destroy();
      const remaining = 100 - overallProgress;
      gaugeChart = new Chart(ctxGauge, {
        type: 'doughnut',
        data: {
          labels: ['Đã hoàn thành', 'Chưa hoàn thành'],
          datasets: [{
            data: [overallProgress, remaining],
            backgroundColor: ['#6366f1', 'rgba(255, 255, 255, 0.2)'],
            borderWidth: 0,
            hoverOffset: 2
          }]
        },
        options: {
          cutout: '78%',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: true } }
        }
      });
    }

    const ctxWeekly = document.getElementById('chart-weekly-bar');
    if (ctxWeekly) {
      if (weeklyBarChart) weeklyBarChart.destroy();
      const labels = appState.weeklyGoals.map(w => w.weekLabel);
      const dataValues = appState.weeklyGoals.map(w => w.progress);
      const backgroundColors = dataValues.map(v => v >= 90 ? '#10b981' : v >= 60 ? '#6366f1' : v > 0 ? '#f59e0b' : '#cbd5e1');

      weeklyBarChart = new Chart(ctxWeekly, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Mức độ hoàn thành (%)',
            data: dataValues,
            backgroundColor: backgroundColors,
            borderRadius: 8,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true, max: 100,
              ticks: { callback: function(val) { return val + '%'; }, font: { family: 'Be Vietnam Pro', size: 11 } },
              grid: { color: '#f1f5f9' }
            },
            x: { ticks: { font: { family: 'Be Vietnam Pro', size: 11 } }, grid: { display: false } }
          },
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(context) { return ` Tiến độ: ${context.raw}%`; } } } }
        }
      });
    }
  }

  // RENDER PRIORITIES LIST WITH FULL EDIT & DELETE BUTTONS
  function renderPriorities() {
    const listEl = document.getElementById('list-priorities');
    if (!listEl) return;

    if (!appState.priorities || appState.priorities.length === 0) {
      listEl.innerHTML = `<li class="p-3 bg-slate-50 rounded-xl text-slate-500 italic">Chưa có ưu tiên nào được ghi nhận.</li>`;
      return;
    }

    listEl.innerHTML = appState.priorities.map((item, idx) => `
      <li class="p-3 bg-slate-50 hover:bg-rose-50/50 rounded-xl transition-colors border border-slate-100 flex items-start justify-between gap-2 group">
        <div class="flex items-start gap-2.5 flex-1">
          <span class="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">${idx + 1}</span>
          <div class="flex-1">
            <p class="font-medium text-slate-800 leading-relaxed">${escapeHtml(item.task)}</p>
            <p class="text-[10px] text-slate-400 mt-0.5">Cập nhật bởi ${escapeHtml(item.author)} (${formatDateShort(item.date)})</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button type="button" data-action="edit-priority" data-id="${item.id}" class="text-slate-400 hover:text-indigo-600 p-1" title="Sửa ưu tiên">
            <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
          </button>
          <button type="button" data-action="delete-priority" data-id="${item.id}" class="text-slate-400 hover:text-rose-600 p-1" title="Xóa ưu tiên">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </li>
    `).join('');

    listEl.querySelectorAll('[data-action="edit-priority"]').forEach(btn => {
      btn.addEventListener('click', (e) => openEditPriorityModal(e.currentTarget.getAttribute('data-id')));
    });

    listEl.querySelectorAll('[data-action="delete-priority"]').forEach(btn => {
      btn.addEventListener('click', (e) => deletePriority(e.currentTarget.getAttribute('data-id')));
    });
  }

  function renderWeeklyGoals() {
    const container = document.getElementById('weekly-goals-container');
    if (!container) return;

    const filterStatus = document.getElementById('filter-week-status')?.value || 'ALL';
    const filtered = appState.weeklyGoals.filter(w => filterStatus === 'ALL' || w.status === filterStatus);

    if (filtered.length === 0) {
      container.innerHTML = `<div class="col-span-full glass-card rounded-2xl p-8 text-center text-slate-500">Không tìm thấy mục tiêu tuần phù hợp bộ lọc.</div>`;
      return;
    }

    container.innerHTML = filtered.map(w => {
      const badgeClass = w.status === 'Đạt' ? 'badge-status-dat' :
                         w.status === 'Đang thực hiện' ? 'badge-status-dang-tap' :
                         w.status === 'Cần hỗ trợ' ? 'badge-status-can-ho-tro' : 'badge-status-chua-bat-dau';

      return `
        <div class="glass-card glass-card-hover rounded-2xl p-5 sm:p-6 space-y-4 relative" data-id="${w.id}">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                ${escapeHtml(w.weekLabel)}
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-900">${escapeHtml(w.weekLabel)}</h3>
                <span class="text-xs text-slate-500">${escapeHtml(w.timeframe)}</span>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <select data-action="change-week-status" data-id="${w.id}" class="text-xs font-semibold rounded-full px-3 py-1 ${badgeClass} cursor-pointer focus:ring-2 focus:ring-indigo-500">
                <option value="Đạt" ${w.status === 'Đạt' ? 'selected' : ''}>Đạt</option>
                <option value="Đang thực hiện" ${w.status === 'Đang thực hiện' ? 'selected' : ''}>Đang thực hiện</option>
                <option value="Cần hỗ trợ" ${w.status === 'Cần hỗ trợ' ? 'selected' : ''}>Cần hỗ trợ</option>
                <option value="Chưa bắt đầu" ${w.status === 'Chưa bắt đầu' ? 'selected' : ''}>Chưa bắt đầu</option>
              </select>
              <button type="button" data-action="edit-week" data-id="${w.id}" class="text-slate-400 hover:text-indigo-600 transition-colors p-1" title="Sửa mục tiêu">
                <i data-lucide="pencil" class="w-4 h-4"></i>
              </button>
              <button type="button" data-action="delete-week" data-id="${w.id}" class="text-slate-400 hover:text-rose-600 transition-colors p-1" title="Xóa tuần">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <p class="text-xs font-bold text-indigo-900 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100">🎯 ${escapeHtml(w.goal)}</p>
            <p class="text-xs text-slate-700 leading-relaxed"><strong class="text-slate-900">Nội dung:</strong> ${escapeHtml(w.content)}</p>
            <p class="text-xs text-slate-600"><strong class="text-slate-900">Phụ trách:</strong> ${escapeHtml(w.targetGroup)}</p>
            <p class="text-xs text-slate-600"><strong class="text-slate-900">Tiêu chí:</strong> ${escapeHtml(w.criteria)}</p>
          </div>

          <div class="pt-2 space-y-1.5 border-t border-slate-100">
            <div class="flex items-center justify-between text-xs font-semibold">
              <span class="text-slate-700">Mức độ hoàn thành:</span>
              <span class="text-indigo-600 font-bold tabular-nums text-sm">${w.progress}%</span>
            </div>
            <input type="range" min="0" max="100" value="${w.progress}" data-action="slider-week-progress" data-id="${w.id}" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600">
          </div>

          ${w.notes ? `<div class="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-start gap-2"><i data-lucide="info" class="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5"></i><span>${escapeHtml(w.notes)}</span></div>` : ''}
        </div>
      `;
    }).join('');

    container.querySelectorAll('[data-action="slider-week-progress"]').forEach(input => {
      input.addEventListener('input', (e) => updateWeekProgress(e.target.getAttribute('data-id'), Number(e.target.value)));
    });
    container.querySelectorAll('[data-action="change-week-status"]').forEach(select => {
      select.addEventListener('change', (e) => updateWeekStatus(e.target.getAttribute('data-id'), e.target.value));
    });
    container.querySelectorAll('[data-action="edit-week"]').forEach(btn => {
      btn.addEventListener('click', (e) => openEditWeekModal(e.currentTarget.getAttribute('data-id')));
    });
    container.querySelectorAll('[data-action="delete-week"]').forEach(btn => {
      btn.addEventListener('click', (e) => deleteWeekGoal(e.currentTarget.getAttribute('data-id')));
    });
  }

  function updateWeekProgress(id, newProgress) {
    const weekObj = appState.weeklyGoals.find(w => w.id === id);
    if (weekObj) {
      weekObj.progress = newProgress;
      if (newProgress >= 90) weekObj.status = 'Đạt';
      else if (newProgress > 0 && weekObj.status === 'Chưa bắt đầu') weekObj.status = 'Đang thực hiện';
      
      saveState();
      if (window.SupabaseStore) window.SupabaseStore.saveWeeklyGoal(weekObj);
      renderAll();

      if (newProgress === 100 && window.confetti) {
        window.confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        showToast(`Tuyệt vời! ${weekObj.weekLabel} đã hoàn thành 100%! 🎉`, "success");
      }
    }
  }

  function updateWeekStatus(id, newStatus) {
    const weekObj = appState.weeklyGoals.find(w => w.id === id);
    if (weekObj) {
      weekObj.status = newStatus;
      if (newStatus === 'Đạt' && weekObj.progress < 90) weekObj.progress = 100;
      saveState();
      if (window.SupabaseStore) window.SupabaseStore.saveWeeklyGoal(weekObj);
      renderAll();
      showToast(`Đã chuyển trạng thái ${weekObj.weekLabel} sang "${newStatus}"`, "info");
    }
  }

  function renderLogsList() {
    const container = document.getElementById('logs-list-container');
    if (!container) return;

    const searchTerm = (document.getElementById('search-logs')?.value || '').toLowerCase();
    const filtered = appState.logs.filter(l => {
      return l.content.toLowerCase().includes(searchTerm) ||
             (l.issues && l.issues.toLowerCase().includes(searchTerm)) ||
             (l.supportNeeded && l.supportNeeded.toLowerCase().includes(searchTerm)) ||
             l.author.toLowerCase().includes(searchTerm);
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div class="glass-card rounded-2xl p-8 text-center text-slate-500">Chưa có nhật ký buổi tập nào phù hợp.</div>`;
      return;
    }

    const sorted = [...filtered].sort((a, b) => b.sessionNum - a.sessionNum);

    container.innerHTML = sorted.map(l => `
      <div class="glass-card glass-card-hover rounded-2xl p-5 border-l-4 border-l-indigo-600 space-y-3 relative">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div class="flex items-center space-x-3">
            <span class="px-3 py-1 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-sm">Buổi ${l.sessionNum}</span>
            <span class="text-xs text-slate-500 font-medium">📅 ${formatDateVN(l.date)}</span>
            <span class="text-xs text-slate-500 font-medium">👥 Sĩ số: <strong class="text-slate-800">${escapeHtml(l.attendance)}</strong></span>
          </div>

          <div class="flex items-center space-x-2">
            <button type="button" data-action="edit-log" data-id="${l.id}" class="text-slate-400 hover:text-indigo-600 transition-colors p-1" title="Sửa"><i data-lucide="pencil" class="w-4 h-4"></i></button>
            <button type="button" data-action="delete-log" data-id="${l.id}" class="text-slate-400 hover:text-rose-600 transition-colors p-1" title="Xóa"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-bold text-slate-900 mb-1">${escapeHtml(l.content)}</h4>
          ${l.result ? `<p class="text-xs text-slate-600 mb-2">✅ <strong>Kết quả:</strong> ${escapeHtml(l.result)}</p>` : ''}
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div>
            <strong class="text-rose-600 flex items-center gap-1"><i data-lucide="alert-circle" class="w-3.5 h-3.5"></i> Điểm cần sửa:</strong>
            <p class="text-slate-700 mt-0.5">${l.issues ? escapeHtml(l.issues) : 'Không có'}</p>
          </div>

          <div>
            <strong class="text-amber-600 flex items-center gap-1"><i data-lucide="user-plus" class="w-3.5 h-3.5"></i> Sinh viên cần hỗ trợ:</strong>
            <p class="text-slate-700 mt-0.5">${l.supportNeeded ? escapeHtml(l.supportNeeded) : 'Không có'}</p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 pt-2 gap-2">
          <div class="flex items-center gap-1 text-indigo-700 font-medium">
            <i data-lucide="arrow-right-circle" class="w-4 h-4 text-indigo-500"></i>
            <span>Việc buổi sau: <strong>${l.nextTasks ? escapeHtml(l.nextTasks) : 'Theo kế hoạch'}</strong></span>
          </div>

          <div class="flex items-center gap-3">
            <span class="font-semibold text-slate-700">Mức độ: <span class="text-indigo-600">${l.progress}%</span></span>
            <span>• Cập nhật bởi: <strong>${escapeHtml(l.author)}</strong></span>
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('[data-action="edit-log"]').forEach(btn => {
      btn.addEventListener('click', (e) => openEditLogModal(e.currentTarget.getAttribute('data-id')));
    });

    container.querySelectorAll('[data-action="delete-log"]').forEach(btn => {
      btn.addEventListener('click', (e) => deleteLog(e.currentTarget.getAttribute('data-id')));
    });
  }

  function renderNotes() {
    const renderCategory = (list, elementId, categoryKey) => {
      const el = document.getElementById(elementId);
      if (!el) return;

      el.innerHTML = list.map((item, idx) => `
        <li class="flex items-start justify-between gap-2 p-2 rounded-xl hover:bg-slate-50 transition-colors group">
          <div class="flex items-start gap-2.5">
            <input type="checkbox" ${item.checked ? 'checked' : ''} data-category="${categoryKey}" data-index="${idx}" class="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer">
            <span class="leading-relaxed ${item.checked ? 'line-through text-slate-400' : 'text-slate-700'}">${escapeHtml(item.text)}</span>
          </div>
          <button type="button" data-action="delete-note" data-category="${categoryKey}" data-index="${idx}" class="text-slate-300 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 p-0.5" title="Xóa ghi chú">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </li>
      `).join('');

      el.querySelectorAll('input[type="checkbox"]').forEach(chk => {
        chk.addEventListener('change', (e) => {
          const cat = e.target.getAttribute('data-category');
          const i = Number(e.target.getAttribute('data-index'));
          appState.notes[cat][i].checked = e.target.checked;
          saveState();
          renderNotes();
        });
      });

      el.querySelectorAll('[data-action="delete-note"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const cat = e.currentTarget.getAttribute('data-category');
          const i = Number(e.currentTarget.getAttribute('data-index'));
          appState.notes[cat].splice(i, 1);
          saveState();
          renderNotes();
          showToast("Đã xóa ghi chú!", "info");
        });
      });
    };

    renderCategory(appState.notes.music, 'notes-music', 'music');
    renderCategory(appState.notes.formation, 'notes-formation', 'formation');
    renderCategory(appState.notes.costumes, 'notes-costumes', 'costumes');
    renderCategory(appState.notes.schedule, 'notes-schedule', 'schedule');
    renderCategory(appState.notes.health, 'notes-health', 'health');
  }

  function renderCmsForm() {
    const ov = appState.overview;
    if (!ov) return;

    const elShow = document.getElementById('cms-show-name');
    const elClass = document.getElementById('cms-class-name');
    const elTotal = document.getElementById('cms-total-members');
    const elTeachers = document.getElementById('cms-teachers');
    const elDate = document.getElementById('cms-perf-date');
    const elStatus = document.getElementById('cms-overall-status');
    const elGoal = document.getElementById('cms-general-goal');
    const elCriteria = document.getElementById('cms-completion-criteria');

    if (elShow) elShow.value = ov.showName || '';
    if (elClass) elClass.value = ov.className || '';
    if (elTotal) elTotal.value = ov.totalMembers || 35;
    if (elTeachers) elTeachers.value = ov.teachers || '';
    if (elDate) elDate.value = ov.performanceDate || '';
    if (elStatus) elStatus.value = ov.overallStatus || 'Đang tập';
    if (elGoal) elGoal.value = ov.generalGoal || '';
    if (elCriteria) elCriteria.value = ov.completionCriteria || '';
  }


  // ==================== EVENT HANDLERS ====================
  function initTabEvents() {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        tabBtns.forEach(b => {
          b.classList.remove('active', 'text-indigo-600', 'bg-indigo-50');
          b.classList.add('text-slate-600');
        });

        document.querySelectorAll(`[data-tab="${targetTab}"]`).forEach(b => {
          b.classList.add('active', 'text-indigo-600');
          if (b.classList.contains('tab-btn')) b.classList.add('bg-indigo-50');
        });

        tabContents.forEach(content => {
          if (content.id === `tab-${targetTab}`) {
            content.classList.add('active');
            if (window.gsap) gsap.fromTo(content, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
          } else {
            content.classList.remove('active');
          }
        });
      });
    });
  }

  function initModalEvents() {
    const btnOpenHeader = document.getElementById('btn-open-log-modal');
    const btnOpenTab3 = document.getElementById('btn-open-log-modal-tab3');
    const btnCloseLog = document.getElementById('btn-close-log-modal');
    const btnCancelLog = document.getElementById('btn-cancel-log-modal');
    const backdropLog = document.getElementById('modal-log-backdrop');

    const btnAddWeek = document.getElementById('btn-add-week-goal');
    const btnCloseWeek = document.getElementById('btn-close-week-modal');
    const btnCancelWeek = document.getElementById('btn-cancel-week-modal');
    const backdropWeek = document.getElementById('modal-week-backdrop');

    const btnAddPriority = document.getElementById('btn-add-priority');
    const btnClosePriority = document.getElementById('btn-close-priority-modal');
    const btnCancelPriority = document.getElementById('btn-cancel-priority-modal');
    const backdropPriority = document.getElementById('modal-priority-backdrop');

    const btnReset = document.getElementById('btn-reset-data');

    if (btnOpenHeader) btnOpenHeader.addEventListener('click', openAddLogModal);
    if (btnOpenTab3) btnOpenTab3.addEventListener('click', openAddLogModal);
    if (btnCloseLog) btnCloseLog.addEventListener('click', () => closeModal(modalLog));
    if (btnCancelLog) btnCancelLog.addEventListener('click', () => closeModal(modalLog));
    if (backdropLog) backdropLog.addEventListener('click', () => closeModal(modalLog));

    if (btnAddWeek) btnAddWeek.addEventListener('click', openAddWeekModal);
    if (btnCloseWeek) btnCloseWeek.addEventListener('click', () => closeModal(modalWeek));
    if (btnCancelWeek) btnCancelWeek.addEventListener('click', () => closeModal(modalWeek));
    if (backdropWeek) backdropWeek.addEventListener('click', () => closeModal(modalWeek));

    if (btnAddPriority) btnAddPriority.addEventListener('click', openAddPriorityModal);
    if (btnClosePriority) btnClosePriority.addEventListener('click', () => closeModal(modalPriority));
    if (btnCancelPriority) btnCancelPriority.addEventListener('click', () => closeModal(modalPriority));
    if (backdropPriority) backdropPriority.addEventListener('click', () => closeModal(modalPriority));

    document.querySelectorAll('[data-action="add-note"]').forEach(btn => {
      btn.addEventListener('click', (e) => addNotePrompt(e.currentTarget.getAttribute('data-category')));
    });

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm("Bạn có chắc chắn muốn khôi phục dữ liệu ban đầu không?")) resetState();
      });
    }

    if (formLog) {
      formLog.addEventListener('submit', (e) => {
        e.preventDefault();
        saveLogForm();
      });
    }

    if (formWeek) {
      formWeek.addEventListener('submit', (e) => {
        e.preventDefault();
        saveWeekForm();
      });
    }

    if (formPriority) {
      formPriority.addEventListener('submit', (e) => {
        e.preventDefault();
        savePriorityForm();
      });
    }
  }

  function initCmsEvents() {
    if (formCms) {
      formCms.addEventListener('submit', (e) => {
        e.preventDefault();

        appState.overview.showName = document.getElementById('cms-show-name').value;
        appState.overview.className = document.getElementById('cms-class-name').value;
        appState.overview.totalMembers = Number(document.getElementById('cms-total-members').value) || 35;
        appState.overview.teachers = document.getElementById('cms-teachers').value;
        appState.overview.performanceDate = document.getElementById('cms-perf-date').value;
        appState.overview.overallStatus = document.getElementById('cms-overall-status').value;
        appState.overview.generalGoal = document.getElementById('cms-general-goal').value;
        appState.overview.completionCriteria = document.getElementById('cms-completion-criteria').value;

        saveState();
        if (window.SupabaseStore) window.SupabaseStore.saveOverview(appState.overview);

        renderAll();
        showToast("Đã lưu cấu hình chương trình thành công lên Cloud & Local!", "success");
      });
    }
  }

  function initFilterEvents() {
    const filterStatus = document.getElementById('filter-week-status');
    if (filterStatus) filterStatus.addEventListener('change', renderWeeklyGoals);

    const searchInput = document.getElementById('search-logs');
    if (searchInput) searchInput.addEventListener('input', renderLogsList);
  }

  // ==================== PRIORITIES CRUD ====================
  function openAddPriorityModal() {
    document.getElementById('modal-priority-title').textContent = "Thêm Việc Ưu Tiên Buổi Sau";
    document.getElementById('form-priority-id').value = "";
    formPriority.reset();

    document.getElementById('form-priority-author').value = "Trưởng nhóm Nam";
    document.getElementById('form-priority-date').value = new Date().toISOString().split('T')[0];

    showModal(modalPriority);
  }

  function openEditPriorityModal(pId) {
    const item = appState.priorities.find(p => p.id === pId);
    if (!item) return;

    document.getElementById('modal-priority-title').textContent = "Sửa Việc Ưu Tiên";
    document.getElementById('form-priority-id').value = item.id;
    document.getElementById('form-priority-task-text').value = item.task;
    document.getElementById('form-priority-author').value = item.author;
    document.getElementById('form-priority-date').value = item.date;

    showModal(modalPriority);
  }

  function savePriorityForm() {
    const id = document.getElementById('form-priority-id').value;
    const task = document.getElementById('form-priority-task-text').value;
    const author = document.getElementById('form-priority-author').value;
    const date = document.getElementById('form-priority-date').value;

    let targetPriorityObj = null;

    if (id) {
      const idx = appState.priorities.findIndex(p => p.id === id);
      if (idx !== -1) {
        targetPriorityObj = { id, task, author, date };
        appState.priorities[idx] = targetPriorityObj;
        showToast("Đã cập nhật việc ưu tiên!", "success");
      }
    } else {
      targetPriorityObj = {
        id: `p-${Date.now()}`,
        task, author, date
      };
      appState.priorities.push(targetPriorityObj);
      showToast("Đã thêm việc ưu tiên mới!", "success");
    }

    saveState();
    if (window.SupabaseStore && targetPriorityObj) {
      window.SupabaseStore.savePriority(targetPriorityObj);
    }
    closeModal(modalPriority);
    renderAll();
  }

  function deletePriority(pId) {
    const item = appState.priorities.find(p => p.id === pId);
    if (!item) return;

    if (confirm("Bạn có chắc chắn muốn xóa việc ưu tiên này không?")) {
      appState.priorities = appState.priorities.filter(p => p.id !== pId);
      saveState();
      if (window.SupabaseStore) window.SupabaseStore.deletePriority(pId);
      renderAll();
      showToast("Đã xóa việc ưu tiên!", "info");
    }
  }

  // ==================== WEEKLY GOAL CRUD ====================
  function openAddWeekModal() {
    document.getElementById('modal-week-title').textContent = "Thêm Mục Tiêu Tuần Mới";
    document.getElementById('form-week-id').value = "";
    formWeek.reset();

    const nextWeekNum = appState.weeklyGoals.length + 1;
    document.getElementById('form-week-label').value = `Tuần ${nextWeekNum}`;
    document.getElementById('form-week-progress').value = 0;
    document.getElementById('form-week-target').value = "Toàn chi đoàn";

    showModal(modalWeek);
  }

  function openEditWeekModal(weekId) {
    const w = appState.weeklyGoals.find(item => item.id === weekId);
    if (!w) return;

    document.getElementById('modal-week-title').textContent = `Sửa Mục Tiêu ${w.weekLabel}`;
    document.getElementById('form-week-id').value = w.id;
    document.getElementById('form-week-label').value = w.weekLabel;
    document.getElementById('form-week-timeframe').value = w.timeframe;
    document.getElementById('form-week-goal').value = w.goal;
    document.getElementById('form-week-content').value = w.content;
    document.getElementById('form-week-target').value = w.targetGroup;
    document.getElementById('form-week-progress').value = w.progress;
    document.getElementById('form-week-criteria').value = w.criteria;
    document.getElementById('form-week-notes').value = w.notes || "";

    showModal(modalWeek);
  }

  function saveWeekForm() {
    const id = document.getElementById('form-week-id').value;
    const weekLabel = document.getElementById('form-week-label').value;
    const timeframe = document.getElementById('form-week-timeframe').value;
    const goal = document.getElementById('form-week-goal').value;
    const content = document.getElementById('form-week-content').value;
    const targetGroup = document.getElementById('form-week-target').value;
    const progress = Number(document.getElementById('form-week-progress').value);
    const criteria = document.getElementById('form-week-criteria').value;
    const notes = document.getElementById('form-week-notes').value;

    const status = progress >= 90 ? 'Đạt' : progress > 0 ? 'Đang thực hiện' : 'Chưa bắt đầu';
    let targetWeekObj = null;

    if (id) {
      const idx = appState.weeklyGoals.findIndex(w => w.id === id);
      if (idx !== -1) {
        targetWeekObj = { id, weekLabel, timeframe, goal, content, targetGroup, criteria, progress, status, notes };
        appState.weeklyGoals[idx] = targetWeekObj;
        showToast(`Đã cập nhật mục tiêu ${weekLabel}!`, "success");
      }
    } else {
      targetWeekObj = {
        id: `w-${Date.now()}`,
        weekLabel, timeframe, goal, content, targetGroup, criteria, progress, status, notes
      };
      appState.weeklyGoals.push(targetWeekObj);
      showToast(`Đã thêm mục tiêu ${weekLabel}!`, "success");
    }

    saveState();
    if (window.SupabaseStore && targetWeekObj) {
      window.SupabaseStore.saveWeeklyGoal(targetWeekObj);
    }
    closeModal(modalWeek);
    renderAll();
  }

  function deleteWeekGoal(weekId) {
    const w = appState.weeklyGoals.find(item => item.id === weekId);
    if (!w) return;

    if (confirm(`Bạn có chắc chắn muốn xóa mục tiêu ${w.weekLabel}?`)) {
      appState.weeklyGoals = appState.weeklyGoals.filter(item => item.id !== weekId);
      saveState();
      if (window.SupabaseStore) window.SupabaseStore.deleteWeeklyGoal(weekId);
      renderAll();
      showToast(`Đã xóa mục tiêu ${w.weekLabel}!`, "info");
    }
  }

  // ==================== NOTE ITEM CRUD ====================
  function addNotePrompt(categoryKey) {
    const text = prompt("Nhập nội dung ghi chú mới:");
    if (text && text.trim() !== '') {
      const newNote = { id: Date.now(), text: text.trim(), checked: false };
      appState.notes[categoryKey].push(newNote);
      saveState();
      renderNotes();
      showToast("Đã thêm ghi chú mới!", "success");
    }
  }


  // ==================== PRACTICE LOG CRUD ====================
  function openAddLogModal() {
    document.getElementById('modal-log-title').textContent = "Thêm Nhật Ký Buổi Tập Mới";
    document.getElementById('form-log-id').value = "";
    formLog.reset();

    const nextSessionNum = appState.logs.length + 1;
    const totalMem = appState.overview.totalMembers || 35;
    document.getElementById('form-log-session').value = nextSessionNum;
    document.getElementById('form-log-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('form-log-attendance').value = `${totalMem}/${totalMem}`;
    document.getElementById('form-log-author').value = "Trưởng nhóm Nam";
    document.getElementById('form-log-progress').value = 75;

    showModal(modalLog);
  }

  function openEditLogModal(logId) {
    const logObj = appState.logs.find(l => l.id === logId);
    if (!logObj) return;

    document.getElementById('modal-log-title').textContent = `Sửa Nhật Ký Buổi ${logObj.sessionNum}`;
    document.getElementById('form-log-id').value = logObj.id;
    document.getElementById('form-log-date').value = logObj.date;
    document.getElementById('form-log-session').value = logObj.sessionNum;
    document.getElementById('form-log-content').value = logObj.content;
    document.getElementById('form-log-attendance').value = logObj.attendance;
    document.getElementById('form-log-progress').value = logObj.progress;
    document.getElementById('form-log-result').value = logObj.result || "";
    document.getElementById('form-log-issues').value = logObj.issues || "";
    document.getElementById('form-log-support').value = logObj.supportNeeded || "";
    document.getElementById('form-log-author').value = logObj.author;
    document.getElementById('form-log-next-tasks').value = logObj.nextTasks || "";

    showModal(modalLog);
  }

  function showModal(modalEl) {
    modalEl.classList.remove('hidden');
    if (window.gsap) {
      gsap.fromTo(modalEl.querySelector('.modal-backdrop'), { opacity: 0 }, { opacity: 1, duration: 0.2 });
      gsap.fromTo(modalEl.querySelector('.modal-container'), { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: 'back.out(1.4)' });
    }
  }

  function closeModal(modalEl) {
    if (window.gsap) {
      gsap.to(modalEl.querySelector('.modal-container'), { scale: 0.95, opacity: 0, duration: 0.15, onComplete: () => {
        modalEl.classList.add('hidden');
      }});
    } else {
      modalEl.classList.add('hidden');
    }
  }

  function saveLogForm() {
    const id = document.getElementById('form-log-id').value;
    const date = document.getElementById('form-log-date').value;
    const sessionNum = Number(document.getElementById('form-log-session').value);
    const content = document.getElementById('form-log-content').value;
    const attendance = document.getElementById('form-log-attendance').value;
    const progress = Number(document.getElementById('form-log-progress').value);
    const result = document.getElementById('form-log-result').value;
    const issues = document.getElementById('form-log-issues').value;
    const supportNeeded = document.getElementById('form-log-support').value;
    const author = document.getElementById('form-log-author').value;
    const nextTasks = document.getElementById('form-log-next-tasks').value;

    let targetLogObj = null;

    if (id) {
      const index = appState.logs.findIndex(l => l.id === id);
      if (index !== -1) {
        targetLogObj = { id, date, sessionNum, content, attendance, progress, result, issues, supportNeeded, author, nextTasks };
        appState.logs[index] = targetLogObj;
        showToast(`Đã cập nhật nhật ký Buổi ${sessionNum}!`, "success");
      }
    } else {
      targetLogObj = {
        id: `log-${Date.now()}`,
        date, sessionNum, content, attendance, progress, result, issues, supportNeeded, author, nextTasks
      };
      appState.logs.push(targetLogObj);
      showToast(`Đã thêm nhật ký Buổi ${sessionNum} thành công!`, "success");
    }

    saveState();
    if (window.SupabaseStore && targetLogObj) {
      window.SupabaseStore.saveLog(targetLogObj);
    }
    closeModal(modalLog);
    renderAll();
  }

  function deleteLog(logId) {
    const logObj = appState.logs.find(l => l.id === logId);
    if (!logObj) return;

    if (confirm(`Bạn có chắc chắn muốn xóa nhật ký Buổi ${logObj.sessionNum}?`)) {
      appState.logs = appState.logs.filter(l => l.id !== logId);
      saveState();
      if (window.SupabaseStore) window.SupabaseStore.deleteLog(logId);
      renderAll();
      showToast(`Đã xóa nhật ký Buổi ${logObj.sessionNum}!`, "info");
    }
  }

  function showToast(message, type = "info") {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    const bgClass = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-slate-900';
    
    toast.className = `pointer-events-auto px-4 py-3 rounded-2xl text-white text-xs font-semibold shadow-xl ${bgClass} flex items-center gap-2 transform translate-y-4 opacity-0 transition-all duration-300`;
    toast.innerHTML = `
      <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}" class="w-4 h-4"></i>
      <span>${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);
    initIcons();

    setTimeout(() => toast.classList.remove('translate-y-4', 'opacity-0'), 10);
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function formatDateVN(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  }

  function formatDateShort(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
    return dateStr;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

})();
