/* =========================================
   REPORTS & ANALYTICS MODULE
   Minimal UI & SVG Icons
========================================= */

function pageReports() {
  const content = document.getElementById('page-content');
  
  content.innerHTML = `
    <div class="fade-in space-y-6">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            รายงานและสถิติ
          </h2>
          <p class="text-slate-500 text-sm mt-1">สรุปข้อมูลการซ่อมบำรุงและเรียกดูรายงานตามช่วงเวลา</p>
        </div>
        
        <button onclick="window.print()" class="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 print:hidden">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
          พิมพ์รายงาน
        </button>
      </div>

      <div class="glass-panel p-5 rounded-2xl border border-slate-200/60 shadow-sm print:hidden">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">ตั้งแต่วันที่</label>
            <input type="date" id="filter-start" class="input-glass">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">ถึงวันที่</label>
            <input type="date" id="filter-end" class="input-glass">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">สถานะงาน</label>
            <select id="filter-status" class="input-glass">
              <option value="all">ทั้งหมด</option>
              <option value="pending">รอดำเนินการ</option>
              <option value="progress">กำลังดำเนินการ</option>
              <option value="completed">เสร็จสิ้น</option>
              <option value="cancelled">ยกเลิก</option>
            </select>
          </div>
          <div>
            <button onclick="fetchReportData()" class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              ค้นหาข้อมูล
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4" id="report-summary">
        ${Array(4).fill(`<div class="glass-panel p-4 rounded-xl animate-pulse h-24"></div>`).join('')}
      </div>

      <div class="glass-panel rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm">
        <div class="p-4 border-b border-slate-200/60 bg-white/40 flex justify-between items-center">
          <h3 class="font-bold text-slate-800 flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
            รายละเอียดงานแจ้งซ่อม
          </h3>
        </div>
        <div class="overflow-x-auto" id="report-table-container">
          <div class="p-8 flex flex-col items-center justify-center text-slate-400">
            <svg class="w-8 h-8 animate-spin mb-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            <p class="text-sm font-medium">กำลังโหลดข้อมูลรายงาน...</p>
          </div>
        </div>
      </div>

    </div>
  `;

  // กำหนดค่าเริ่มต้นให้กับวันที่ (ย้อนหลัง 30 วัน ถึง ปัจจุบัน)
  const today = new Date();
  const lastMonth = new Date(today);
  lastMonth.setDate(today.getDate() - 30);
  
  document.getElementById('filter-end').valueAsDate = today;
  document.getElementById('filter-start').valueAsDate = lastMonth;

  // ดึงข้อมูลครั้งแรก
  fetchReportData();
}

async function fetchReportData() {
  const startDate = document.getElementById('filter-start').value;
  const endDate = document.getElementById('filter-end').value;
  const status = document.getElementById('filter-status').value;

  try {
    // สร้าง Query String สำหรับส่งไป API (แก้ไข Endpoint ให้ตรงกับ Backend ของคุณ)
    const queryParams = new URLSearchParams({
      start: startDate,
      end: endDate,
      status: status !== 'all' ? status : ''
    }).toString();

    // ดึงข้อมูลแจ้งซ่อมทั้งหมดตามเงื่อนไข (หรือเรียก API เฉพาะสำหรับ Reports)
    const data = await apiFetch(`/requests?${queryParams}`);
    const requests = Array.isArray(data) ? data : (data.requests || []);

    renderReportSummary(requests);
    renderReportTable(requests);

  } catch (error) {
    console.error("Report fetch error:", error);
    document.getElementById('report-table-container').innerHTML = `
      <div class="p-6 text-center text-rose-600 flex flex-col items-center">
        <svg class="w-10 h-10 mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <p class="font-medium">ไม่สามารถโหลดข้อมูลรายงานได้: ${error.message}</p>
      </div>`;
  }
}

function renderReportSummary(requests) {
  const summary = document.getElementById('report-summary');
  
  const stats = {
    total: requests.length,
    completed: requests.filter(r => r.status === 'completed').length,
    pending: requests.filter(r => r.status === 'pending').length,
    progress: requests.filter(r => r.status === 'progress').length
  };

  const cards = [
    { label: 'งานทั้งหมด', value: stats.total, color: 'text-indigo-600' },
    { label: 'เสร็จสิ้นแล้ว', value: stats.completed, color: 'text-emerald-600' },
    { label: 'กำลังดำเนินการ', value: stats.progress, color: 'text-blue-600' },
    { label: 'รอดำเนินการ', value: stats.pending, color: 'text-amber-600' }
  ];

  summary.innerHTML = cards.map(c => `
    <div class="glass-panel p-4 rounded-xl text-center border border-slate-100 shadow-sm print:border-slate-300 print:shadow-none">
      <p class="text-xs font-medium text-slate-500 mb-1">${c.label}</p>
      <h4 class="text-2xl font-bold ${c.color}">${c.value}</h4>
    </div>
  `).join('');
}

function renderReportTable(requests) {
  const container = document.getElementById('report-table-container');

  if (!requests || requests.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center text-slate-500 flex flex-col items-center">
        <svg class="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        <p class="font-medium">ไม่พบข้อมูลในช่วงเวลาหรือสถานะที่เลือก</p>
      </div>`;
    return;
  }

  let html = `
    <table class="w-full text-left border-collapse print:text-sm">
      <thead>
        <tr class="border-b border-slate-200/80 bg-slate-50/50 text-sm text-slate-600 print:bg-transparent">
          <th class="p-3 font-semibold">รหัส</th>
          <th class="p-3 font-semibold">วันที่แจ้ง</th>
          <th class="p-3 font-semibold">ผู้แจ้ง</th>
          <th class="p-3 font-semibold">ปัญหา/อาการ</th>
          <th class="p-3 font-semibold">ช่างผู้รับผิดชอบ</th>
          <th class="p-3 font-semibold">สถานะ</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100 print:divide-slate-200">
  `;

  requests.forEach(r => {
    const dateStr = r.created_at ? new Date(r.created_at).toLocaleDateString('th-TH') : '-';
    html += `
      <tr class="hover:bg-white/60 transition-colors">
        <td class="p-3 text-sm font-medium text-indigo-600">${r.id || '-'}</td>
        <td class="p-3 text-sm text-slate-600">${dateStr}</td>
        <td class="p-3 text-sm text-slate-800">${r.user_name || r.reporter_name || '-'}</td>
        <td class="p-3 text-sm text-slate-700 truncate max-w-xs" title="${r.title || r.problem_desc}">${r.title || r.problem_desc || '-'}</td>
        <td class="p-3 text-sm text-slate-600">${r.technician_name || '-'}</td>
        <td class="p-3 print:text-xs">
          <span class="print:hidden">${getStatusBadge(r.status || 'pending')}</span>
          <span class="hidden print:inline font-semibold">${getStatusText(r.status)}</span>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

// ตัวช่วยสำหรับโหมด Print
function getStatusText(status) {
  const map = {
    'pending': 'รอดำเนินการ',
    'progress': 'กำลังดำเนินการ',
    'completed': 'เสร็จสิ้น',
    'cancelled': 'ยกเลิก'
  };
  return map[status] || 'รอดำเนินการ';
}