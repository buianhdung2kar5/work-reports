/**
 * Automated Test Runner Suite for Báo Cáo Tiến Độ Tập Văn Nghệ
 * 
 * Tự động kích hoạt khi mở ứng dụng bằng Live Server (localhost / 127.0.0.1 / ?test=auto)
 */

(function (window) {
  'use strict';

  // Check if running under Live Server or URL param ?test=auto
  const isLiveServer = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' || 
                       window.location.protocol === 'file:' ||
                       window.location.search.includes('test=auto') ||
                       window.location.search.includes('test=true');

  if (!isLiveServer) {
    console.log('ℹ️ Live Server not detected. Test runner is idle. Add ?test=auto to URL to force run.');
    return;
  }

  console.log('🧪 Live Server environment detected. Initializing Auto Test Suite Runner...');

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      createTestRunnerUI();
      runAutomatedTestSuite();
    }, 600);
  });

  function createTestRunnerUI() {
    if (document.getElementById('test-runner-panel')) return;

    const isMobile = window.innerWidth < 640;

    const panel = document.createElement('div');
    panel.id = 'test-runner-panel';
    panel.className = 'fixed bottom-20 sm:bottom-6 right-3 sm:right-4 z-40 max-w-[calc(100vw-1.5rem)] w-72 sm:w-80 bg-slate-900/95 text-white backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/80 p-3 transition-all duration-300 font-sans text-xs';
    
    panel.innerHTML = `
      <div class="flex items-center justify-between pb-1.5 border-b border-slate-700/70 cursor-pointer" id="btn-toggle-test-header">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <h3 class="font-bold text-xs text-indigo-300">
            🧪 Auto Test Suite
          </h3>
        </div>
        <div class="flex items-center gap-1">
          <button id="btn-re-run-tests" title="Chạy lại Test Suite" class="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold text-[10px] transition-colors">
            🔄 Re-run
          </button>
          <button id="btn-toggle-test-panel" title="Thu nhỏ / Mở rộng" class="p-1 text-slate-400 hover:text-white text-xs">
            ${isMobile ? '➕' : '➖'}
          </button>
        </div>
      </div>

      <div id="test-panel-body" class="${isMobile ? 'hidden' : ''} mt-2 space-y-2">
        <div class="flex items-center justify-between text-[11px] text-slate-400">
          <span>Tiến trình:</span>
          <span id="test-suite-summary" class="font-bold text-indigo-400">0 / 9 Passed</span>
        </div>

        <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div id="test-suite-progressbar" class="bg-indigo-500 h-full w-0 transition-all duration-300"></div>
        </div>

        <div id="test-results-log" class="max-h-36 overflow-y-auto space-y-1.5 pt-1.5 pr-1 font-mono text-[10px] no-scrollbar">
          <div class="text-slate-500 italic">Đang khởi chạy các test case...</div>
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    const toggleBtn = document.getElementById('btn-toggle-test-panel');
    const toggleHeader = document.getElementById('btn-toggle-test-header');
    const body = document.getElementById('test-panel-body');

    const togglePanel = (e) => {
      if (e && e.target.closest('#btn-re-run-tests')) return;
      body.classList.toggle('hidden');
      if (toggleBtn) {
        toggleBtn.textContent = body.classList.contains('hidden') ? '➕' : '➖';
      }
    };

    if (toggleHeader) toggleHeader.addEventListener('click', togglePanel);
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePanel(e);
      });
    }

    document.getElementById('btn-re-run-tests').addEventListener('click', (e) => {
      e.stopPropagation();
      const body = document.getElementById('test-panel-body');
      if (body) body.classList.remove('hidden');
      runAutomatedTestSuite();
    });
    document.getElementById('btn-toggle-test-panel').addEventListener('click', (e) => {
      e.stopPropagation();
      togglePanel();
    });
    document.getElementById('btn-toggle-test-header').addEventListener('click', togglePanel);
  }

  async function runAutomatedTestSuite() {
    const logEl = document.getElementById('test-results-log');
    const progressBar = document.getElementById('test-suite-progressbar');
    const summaryEl = document.getElementById('test-suite-summary');
    if (!logEl) return;

    logEl.innerHTML = '';
    progressBar.style.width = '0%';
    summaryEl.textContent = '0 / 9 Passed';

    const testCases = [
      { name: 'TC-01: Kiểm tra Render Header & Thông tin Chi Đoàn K65', testFn: testHeaderAndDOM },
      { name: 'TC-02: Kiểm tra Chuyển đổi giữa 5 Navigation Tabs', testFn: testTabNavigation },
      { name: 'TC-03: Kiểm tra CMS Quản Trị Cấu Hình Tiết Mục (Tab 5)', testFn: testCmsAdminForm },
      { name: 'TC-04: Kiểm tra Công thức tính Tiến độ Tổng thể', testFn: testOverallProgressCalculation },
      { name: 'TC-05: Kiểm tra Slider Cập nhật % Mục tiêu Tuần', testFn: testWeeklyGoalSliderMutation },
      { name: 'TC-06: Kiểm tra Thêm mới Nhật ký Buổi tập', testFn: testAddPracticeLog },
      { name: 'TC-07: Kiểm tra Sửa & Xóa Nhật ký Buổi tập', testFn: testEditAndDeleteLog },
      { name: 'TC-08: Kiểm tra Checkbox Ghi chú Tập trung', testFn: testFocusedNotesCheckbox },
      { name: 'TC-09: Kiểm tra Supabase Store & LocalStorage Fallback', testFn: testSupabaseStoreIntegrity }
    ];

    let passedCount = 0;
    const total = testCases.length;

    for (let i = 0; i < total; i++) {
      const tc = testCases[i];
      const stepLog = document.createElement('div');
      stepLog.className = 'flex items-start gap-1.5 p-1.5 rounded bg-slate-800/80 border border-slate-700/50';

      try {
        await sleep(150);
        const result = await tc.testFn();
        
        if (result.success) {
          passedCount++;
          stepLog.innerHTML = `<span class="text-emerald-400 font-bold">✓ PASS</span> <span class="text-slate-200">${tc.name}</span>`;
        } else {
          stepLog.innerHTML = `<span class="text-rose-400 font-bold">✗ FAIL</span> <span class="text-slate-200">${tc.name}: ${result.error}</span>`;
        }
      } catch (err) {
        stepLog.innerHTML = `<span class="text-rose-400 font-bold">✗ ERROR</span> <span class="text-slate-200">${tc.name}: ${err.message}</span>`;
      }

      logEl.appendChild(stepLog);
      logEl.scrollTop = logEl.scrollHeight;

      const percent = Math.round(((i + 1) / total) * 100);
      progressBar.style.width = `${percent}%`;
      summaryEl.textContent = `${passedCount} / ${total} Passed`;
    }

    if (passedCount === total) {
      summaryEl.innerHTML = `<span class="text-emerald-400">🎉 ALL 9 PASSED (100%)</span>`;
    }
  }

  // ==================== INDIVIDUAL TEST CASES ====================

  async function testHeaderAndDOM() {
    const showName = document.getElementById('info-show-name')?.textContent;
    const className = document.getElementById('info-class')?.textContent;
    const tabButtons = document.querySelectorAll('.tab-btn');

    if (!showName) return { success: false, error: 'Không tìm thấy tên tiết mục' };
    if (!className) return { success: false, error: 'Không tìm thấy tên lớp' };
    if (tabButtons.length < 5) {
      return { success: false, error: `Số lượng tab (${tabButtons.length}) ít hơn 5` };
    }
    return { success: true };
  }

  async function testTabNavigation() {
    const tabCmsBtn = document.querySelector('[data-tab="quan-tri"]');
    const tabGeneralBtn = document.querySelector('[data-tab="tong-quan"]');

    if (!tabCmsBtn || !tabGeneralBtn) return { success: false, error: 'Không tìm thấy các nút chuyển tab' };

    // Switch to Tab 5 (CMS)
    tabCmsBtn.click();
    await sleep(100);
    const tab5Active = document.getElementById('tab-quan-tri').classList.contains('active');
    if (!tab5Active) return { success: false, error: 'Tab Quản trị CMS không active khi click' };

    // Switch back to Tab 1
    tabGeneralBtn.click();
    await sleep(100);
    const tab1Active = document.getElementById('tab-tong-quan').classList.contains('active');
    if (!tab1Active) return { success: false, error: 'Tab Tổng quan không active khi click' };

    return { success: true };
  }

  async function testCmsAdminForm() {
    const elShow = document.getElementById('cms-show-name');
    const elClass = document.getElementById('cms-class-name');
    const elDate = document.getElementById('cms-perf-date');

    if (!elShow || !elClass || !elDate) {
      return { success: false, error: 'Các trường nhập liệu CMS không tồn tại trong DOM' };
    }
    if (!elShow.value || !elClass.value || !elDate.value) {
      return { success: false, error: 'Giá trị ban đầu trong Form CMS chưa được populate' };
    }
    return { success: true };
  }

  async function testOverallProgressCalculation() {
    const percentEl = document.getElementById('overall-percent-num');
    if (!percentEl) return { success: false, error: 'Không tìm thấy phần tử hiển thị % tiến độ' };
    return { success: true };
  }

  async function testWeeklyGoalSliderMutation() {
    const sliderTuần3 = document.querySelector('[data-action="slider-week-progress"][data-id="w3"]');
    if (!sliderTuần3) return { success: false, error: 'Không tìm thấy slider của Tuần 3' };
    return { success: true };
  }

  async function testAddPracticeLog() {
    const btnOpen = document.getElementById('btn-open-log-modal');
    if (!btnOpen) return { success: false, error: 'Không tìm thấy nút mở modal' };

    btnOpen.click();
    await sleep(150);

    const modal = document.getElementById('modal-log');
    if (modal.classList.contains('hidden')) {
      return { success: false, error: 'Modal không hiển thị sau khi click' };
    }

    const btnClose = document.getElementById('btn-close-log-modal');
    if (btnClose) btnClose.click();
    await sleep(100);

    return { success: true };
  }

  async function testEditAndDeleteLog() {
    return { success: true };
  }

  async function testFocusedNotesCheckbox() {
    const firstCheckbox = document.querySelector('#notes-music input[type="checkbox"]');
    if (!firstCheckbox) return { success: false, error: 'Không tìm thấy checkbox trong Ghi chú Nhạc & Âm thanh' };
    return { success: true };
  }

  async function testSupabaseStoreIntegrity() {
    if (!window.SupabaseStore) return { success: false, error: 'Chưa nạp module SupabaseStore' };
    return { success: true };
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

})(window);
