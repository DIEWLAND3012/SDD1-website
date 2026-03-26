/* =========================================
   SYSTEM LOGS & AUDIT MODULE
   Minimal UI & SVG Icons (Admin Only)
========================================= */

let systemLogsData = [];

function pageSystemLog() {
  const content = document.getElementById('page-content');
  const role = window.APP?.user?.role || 'user';

  // ตรวจสอบสิทธิ์: ถ้าไม่ใช่ admin ให้แสดงหน้า Access Denied
  if (role !== 'admin') {
    content.innerHTML = `
      <div class="fade-in flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div class="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-rose-100">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h2 class="text-2xl font-bold text-slate-800 mb-2">ปฏิเสธการเข้าถึง</h2>
        <p class="text-slate-500 max-w-md">ขออภัย คุณไม่มีสิทธิ์เข้าถึงหน้านี้<br>หน้านี้สงวนไว้สำหรับผู้ดูแลระบบ (Administrator) เท่านั้น</p>
        <button onclick="navigate('requests')" class="mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm transition-colors">
          กลับสู่หน้าหลัก
        </button>
      </div>
    `;
    return;
  }

  content.innerHTML = `
    <div class="fade-in space-y-6">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            บันทึกการทำงานของระบบ (System Logs)
          </h2>
          <p class="text-slate-500 text-sm mt-1">ตรวจสอบประวัติการใช้งานและการเปลี่ยนแปลงข้อมูลในระบบ</p>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="relative hidden md:block">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input type="text" id="search-logs" placeholder="ค้นหาชื่อผู้ใช้, เหตุการณ์..." class="input-glass pl-9 py-2 w-64" onkeyup="filterLogs()">
          </div>
          
          <select id="filter-log-type" onchange="filterLogs()" class="input-glass py-2">
            <option value="all">ทุกประเภท</option>
            <option value="auth">การเข้าสู่ระบบ</option>
            <option value="create">สร้างข้อมูล</option>
            <option value="update">แก้ไข/อัปเดต</option>
            <option value="delete">ลบข้อมูล</option>
            <option value="system">ระบบ</option>
          </select>
        </div>
      </div>

      <div class="glass-panel rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm">
        <div class="overflow-x-auto" id="logs-table-container">
          <div class="p-12 flex flex-col items-center justify-center text-slate-400">
            <svg class="w-8 h-8 animate-spin mb-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            <p class="text-sm font-medium">กำลังโหลดข้อมูลบันทึกระบบ...</p>
          </div>
        </div>
      </div>
      
      <div class="flex items-center justify-between px-4 text-sm text-slate-500">
        <p>แสดงผลล่าสุด 50 รายการ</p>
        <div class="flex gap-2">
          <button class="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>ก่อนหน้า</button>
          <button class="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">ถัดไป</button>
        </div>
      </div>

    </div>
  `;

  fetchLogs();
}

async function fetchLogs() {
  try {
    // กำหนด Endpoint สำหรับดึง Log (ต้องเป็น Admin เท่านั้น)
    const data = await apiFetch('/logs');
    systemLogsData = Array.isArray(data) ? data : (data.logs || []);

    // ** ฟีเจอร์ตัวช่วย: สร้าง Mock Data ถ้า API คืนค่าว่างมา **
    if (systemLogsData.length === 0) {
      systemLogsData = generateMockLogs();
    }

    renderLogsTable(systemLogsData);
  } catch (error) {
    document.getElementById('logs-table-container').innerHTML = `
      <div class="p-8 text-center text-rose-600 flex flex-col items-center">
        <svg class="w-10 h-10 mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <p class="font-medium">ไม่สามารถโหลดข้อมูล Logs ได้: ${error.message}</p>
      </div>`;
  }
}

function renderLogsTable(logs) {
  const container = document.getElementById('logs-table-container');

  if (!logs || logs.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center text-slate-500 flex flex-col items-center">
        <svg class="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        <p class="font-medium">ไม่พบข้อมูลบันทึกในระบบ</p>
      </div>`;
    return;
  }

  let html = `
    <table class="w-full text-left border-collapse whitespace-nowrap">
      <thead>
        <tr class="border-b border-slate-200/80 bg-slate-50/50 text-xs text-slate-500 uppercase tracking-wider">
          <th class="p-4 font-semibold">วัน-เวลา</th>
          <th class="p-4 font-semibold">ผู้ใช้งาน</th>
          <th class="p-4 font-semibold">ประเภท</th>
          <th class="p-4 font-semibold w-full">รายละเอียดเหตุการณ์</th>
          <th class="p-4 font-semibold text-right">IP Address</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100 font-mono text-sm">
  `;

  logs.forEach(log => {
    const dateObj = new Date(log.timestamp);
    const dateStr = dateObj.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = dateObj.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // กำหนดสีและไอคอนตามประเภทของ Log
    let typeStyle = '';
    let typeIcon = '';
    
    switch(log.type) {
      case 'auth':
        typeStyle = 'bg-blue-50 text-blue-600';
        typeIcon = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>`;
        break;
      case 'create':
        typeStyle = 'bg-emerald-50 text-emerald-600';
        typeIcon = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>`;
        break;
      case 'update':
        typeStyle = 'bg-amber-50 text-amber-600';
        typeIcon = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>`;
        break;
      case 'delete':
        typeStyle = 'bg-rose-50 text-rose-600';
        typeIcon = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>`;
        break;
      default: // system
        typeStyle = 'bg-slate-100 text-slate-600';
        typeIcon = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg>`;
    }

    html += `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="p-4">
          <span class="text-slate-700">${dateStr}</span>
          <span class="text-slate-400 ml-1">${timeStr}</span>
        </td>
        <td class="p-4 text-indigo-600 font-medium">${log.user_name || 'System'}</td>
        <td class="p-4">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${typeStyle}">
            ${typeIcon} ${log.type}
          </span>
        </td>
        <td class="p-4 text-slate-600 truncate max-w-md" title="${log.details}">${log.details}</td>
        <td class="p-4 text-right text-slate-400 text-xs">${log.ip_address || '127.0.0.1'}</td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

function filterLogs() {
  const searchQuery = document.getElementById('search-logs').value.toLowerCase();
  const typeQuery = document.getElementById('filter-log-type').value;

  const filtered = systemLogsData.filter(log => {
    const matchesSearch = 
      (log.user_name || '').toLowerCase().includes(searchQuery) || 
      (log.details || '').toLowerCase().includes(searchQuery);
    
    const matchesType = typeQuery === 'all' || log.type === typeQuery;

    return matchesSearch && matchesType;
  });

  renderLogsTable(filtered);
}

// ----------------------------------------------------
// Mock Data Generator (ลบออกได้เมื่อต่อ API จริง)
// ----------------------------------------------------
function generateMockLogs() {
  const now = new Date();
  return [
    { id: 1, timestamp: new Date(now.getTime() - 1000 * 60 * 5).toISOString(), user_name: 'สมชาย รักดี', type: 'update', details: 'อัปเดตสถานะงานแจ้งซ่อม #REQ-1023 เป็น "กำลังดำเนินการ"', ip_address: '192.168.1.45' },
    { id: 2, timestamp: new Date(now.getTime() - 1000 * 60 * 25).toISOString(), user_name: 'มานี สีสด', type: 'create', details: 'สร้างรายการแจ้งซ่อมใหม่ #REQ-1055 (แอร์ไม่เย็น)', ip_address: '192.168.1.112' },
    { id: 3, timestamp: new Date(now.getTime() - 1000 * 60 * 60).toISOString(), user_name: 'วิชัย ช่างไฟ', type: 'auth', details: 'เข้าสู่ระบบสำเร็จ', ip_address: '172.16.0.8' },
    { id: 4, timestamp: new Date(now.getTime() - 1000 * 60 * 120).toISOString(), user_name: 'System', type: 'system', details: 'สำรองข้อมูลฐานข้อมูลประจำวันเสร็จสมบูรณ์', ip_address: 'localhost' },
    { id: 5, timestamp: new Date(now.getTime() - 1000 * 60 * 300).toISOString(), user_name: 'สมชาย รักดี', type: 'delete', details: 'ลบข้อมูลผู้ใช้งาน "test_user@example.com"', ip_address: '192.168.1.45' },
    { id: 6, timestamp: new Date(now.getTime() - 1000 * 60 * 450).toISOString(), user_name: 'นุกูล แอร์เย็น', type: 'auth', details: 'พยายามเข้าสู่ระบบล้มเหลว (รหัสผ่านผิด)', ip_address: '10.0.0.55' }
  ];
}