/* =========================================
   USER DASHBOARD MODULE (Minimal UI)
   No Emojis, SVG Icons only
========================================= */

function pageDashboard() {
  const content = document.getElementById('page-content');
  
  // โครงสร้างหน้า Dashboard แบบ Loading State (ระหว่างรอข้อมูลจาก API)
  content.innerHTML = `
    <div class="fade-in space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-800 tracking-tight">ภาพรวมการแจ้งซ่อม</h2>
          <p class="text-slate-500 text-sm mt-1">สรุปสถานะรายการแจ้งซ่อมบำรุงของคุณ</p>
        </div>
        <button onclick="typeof pageRequestsList === 'function' ? pageRequestsList() : alert('รอนำเข้าไฟล์ Requests.js')" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          แจ้งซ่อมใหม่
        </button>
      </div>

      <div id="dash-summary" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        ${Array(4).fill(`<div class="glass-panel p-5 rounded-2xl animate-pulse h-28"></div>`).join('')}
      </div>

      <div class="glass-panel rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm mt-8">
        <div class="p-5 border-b border-slate-200/60 bg-white/40 flex justify-between items-center">
          <h3 class="font-bold text-slate-800 flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            รายการแจ้งซ่อมล่าสุด
          </h3>
        </div>
        <div class="p-5">
          <div class="h-32 flex items-center justify-center text-slate-400 text-sm">
            <svg class="w-6 h-6 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            กำลังโหลดข้อมูล...
          </div>
        </div>
      </div>
    </div>
  `;

  // เรียกฟังก์ชันดึงข้อมูลจาก API
  fetchDashboardData();
}

// ฟังก์ชันดึงข้อมูลสรุปจาก Backend
async function fetchDashboardData() {
  try {
    // สมมติว่ามี API Endpoint สำหรับดึง Dashboard ของ User 
    // (หากระบบจริงใช้ Endpoint อื่น ให้แก้ตรง '/requests/me' ได้เลย)
    const data = await apiFetch('/requests/me'); 
    
    // ตรวจสอบโครงสร้างข้อมูล และคำนวณสรุปผล (กรณีที่ API ส่งกลับมาเป็น Array ของงานซ่อมทั้งหมด)
    const requests = Array.isArray(data) ? data : (data.requests || []);
    
    const stats = {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      progress: requests.filter(r => r.status === 'progress').length,
      completed: requests.filter(r => r.status === 'completed').length
    };

    renderDashboardSummary(stats);
    renderRecentRequests(requests.slice(0, 5)); // เอาแค่ 5 รายการล่าสุด

  } catch (error) {
    console.error("Dashboard fetch error:", error);
    document.getElementById('dash-summary').innerHTML = `
      <div class="col-span-full p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        ไม่สามารถโหลดข้อมูลแดชบอร์ดได้: ${error.message}
      </div>
    `;
  }
}

// วาดการ์ดสรุปข้อมูล
function renderDashboardSummary(stats) {
  const container = document.getElementById('dash-summary');
  
  const cards = [
    { title: 'แจ้งซ่อมทั้งหมด', count: stats.total, color: 'text-indigo-600', bg: 'bg-indigo-50', icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>' },
    { title: 'รอดำเนินการ', count: stats.pending, color: 'text-amber-600', bg: 'bg-amber-50', icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' },
    { title: 'กำลังดำเนินการ', count: stats.progress, color: 'text-blue-600', bg: 'bg-blue-50', icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>' },
    { title: 'เสร็จสิ้นแล้ว', count: stats.completed, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' }
  ];

  container.innerHTML = cards.map(c => `
    <div class="glass-panel p-5 rounded-2xl flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md">
      <div>
        <p class="text-sm font-medium text-slate-500 mb-1">${c.title}</p>
        <h4 class="text-3xl font-bold text-slate-800">${c.count}</h4>
      </div>
      <div class="w-12 h-12 rounded-xl flex items-center justify-center ${c.bg} ${c.color}">
        ${c.icon}
      </div>
    </div>
  `).join('');
}

// วาดตารางรายการล่าสุด
function renderRecentRequests(requests) {
  const container = document.querySelector('.glass-panel.mt-8 .p-5'); // เลือกจุดที่จะวางตาราง
  
  if (!requests || requests.length === 0) {
    container.innerHTML = `
      <div class="py-10 text-center text-slate-500 flex flex-col items-center">
        <svg class="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
        <p class="font-medium">ยังไม่มีประวัติการแจ้งซ่อม</p>
      </div>`;
    return;
  }

  let html = `
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-slate-200/60 text-sm text-slate-500">
            <th class="pb-3 font-medium">รหัสงาน</th>
            <th class="pb-3 font-medium">หัวข้อ/อาการ</th>
            <th class="pb-3 font-medium">วันที่แจ้ง</th>
            <th class="pb-3 font-medium">สถานะ</th>
          </tr>
        </thead>
        <tbody>
  `;

  requests.forEach(r => {
    // สมมติว่ามีฟิลด์ id, title, created_at, status
    const dateStr = r.created_at ? new Date(r.created_at).toLocaleDateString('th-TH') : '-';
    html += `
      <tr class="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
        <td class="py-3 text-sm font-semibold text-indigo-600">${r.id || '-'}</td>
        <td class="py-3 text-sm text-slate-700">${r.title || r.problem_desc || 'ไม่ระบุหัวข้อ'}</td>
        <td class="py-3 text-sm text-slate-500">${dateStr}</td>
        <td class="py-3">${getStatusBadge(r.status || 'pending')}</td>
      </tr>
    `;
  });

  html += `</tbody></table></div>`;
  container.innerHTML = html;
}