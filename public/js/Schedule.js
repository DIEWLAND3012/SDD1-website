/* =========================================
   SCHEDULE & CALENDAR MODULE
   Minimal UI & SVG Icons (Agenda View)
========================================= */

let scheduleData = [];
let currentScheduleDate = new Date();

function pageSchedule() {
  const content = document.getElementById('page-content');
  
  content.innerHTML = `
    <div class="fade-in space-y-6">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            ตารางปฏิบัติงาน
          </h2>
          <p class="text-slate-500 text-sm mt-1">ติดตามแผนการซ่อมบำรุงและคิวงานของช่าง</p>
        </div>
        
        <div class="flex items-center justify-center gap-3 bg-white/60 p-1.5 rounded-xl border border-slate-200/60 shadow-sm">
          <button onclick="changeMonth(-1)" class="p-2 hover:bg-white rounded-lg transition-colors text-slate-500 hover:text-indigo-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <h3 id="current-month-display" class="text-base font-bold text-slate-700 w-32 text-center">มกราคม 2024</h3>
          <button onclick="changeMonth(1)" class="p-2 hover:bg-white rounded-lg transition-colors text-slate-500 hover:text-indigo-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>

      <div class="glass-panel rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm min-h-[400px]">
        <div id="schedule-container" class="p-5 md:p-8">
          <div class="flex flex-col items-center justify-center text-slate-400 py-12">
            <svg class="w-8 h-8 animate-spin mb-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            <p class="text-sm font-medium">กำลังโหลดตารางงาน...</p>
          </div>
        </div>
      </div>
      
    </div>
  `;

  updateMonthDisplay();
  fetchSchedule();
}

function updateMonthDisplay() {
  const monthNames = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", 
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  const display = document.getElementById('current-month-display');
  if (display) {
    const yearTh = currentScheduleDate.getFullYear() + 543; // แปลงเป็น พ.ศ.
    display.innerText = `${monthNames[currentScheduleDate.getMonth()]} ${yearTh}`;
  }
}

function changeMonth(offset) {
  currentScheduleDate.setMonth(currentScheduleDate.getMonth() + offset);
  updateMonthDisplay();
  fetchSchedule();
}

async function fetchSchedule() {
  try {
    // กำหนด Endpoint ให้ดึงข้อมูลงานที่อยู่ในสถานะ progress หรือมีการนัดหมาย
    // (ปรับแก้ Endpoint ให้ตรงกับระบบ Backend ของคุณได้เลย)
    const data = await apiFetch('/schedule'); 
    scheduleData = Array.isArray(data) ? data : (data.tasks || []);
    
    // ** ฟีเจอร์ตัวช่วย: ถ้า API ยิงมาว่างๆ จะสร้างข้อมูลจำลองให้เห็น UI ก่อน **
    if (scheduleData.length === 0) {
      scheduleData = generateMockSchedule(currentScheduleDate);
    }

    renderSchedule();
  } catch (error) {
    console.error("Schedule fetch error:", error);
    document.getElementById('schedule-container').innerHTML = `
      <div class="p-6 text-center text-rose-600 flex flex-col items-center py-12 bg-rose-50/50 rounded-xl">
        <svg class="w-10 h-10 mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <p class="font-medium">ไม่สามารถโหลดข้อมูลตารางงานได้: ${error.message}</p>
      </div>`;
  }
}

function renderSchedule() {
  const container = document.getElementById('schedule-container');
  const month = currentScheduleDate.getMonth();
  const year = currentScheduleDate.getFullYear();
  
  // กรองเอางานเฉพาะในเดือนและปีที่กำลังดูอยู่
  const monthlyTasks = scheduleData.filter(task => {
    if (!task.date) return false;
    const taskDate = new Date(task.date);
    return taskDate.getMonth() === month && taskDate.getFullYear() === year;
  });

  // เรียงลำดับตามวันที่จากน้อยไปมาก
  monthlyTasks.sort((a, b) => new Date(a.date) - new Date(b.date));

  if (monthlyTasks.length === 0) {
    container.innerHTML = `
      <div class="py-16 text-center text-slate-500 flex flex-col items-center">
        <svg class="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        <p class="font-medium text-lg">ว่างเปล่า</p>
        <p class="text-sm mt-1">ไม่มีคิวงานซ่อมบำรุงในเดือนนี้</p>
      </div>`;
    return;
  }

  let html = `<div class="space-y-6">`;
  let currentDayGroup = '';

  monthlyTasks.forEach(task => {
    const taskDateObj = new Date(task.date);
    const dateStr = taskDateObj.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const timeStr = task.time || taskDateObj.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';

    // ถ้าเปลี่ยนวัน ให้สร้างหัวข้อวันที่ใหม่
    if (dateStr !== currentDayGroup) {
      html += `
        <div class="pt-2">
          <h4 class="text-sm font-bold text-slate-700 border-b border-slate-200/80 pb-2 mb-4 flex items-center gap-2">
            <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            ${dateStr}
          </h4>
        </div>
      `;
      currentDayGroup = dateStr;
    }

    // กำหนดสีแถบด้านซ้ายตามสถานะงาน
    let statusColor = 'border-amber-400';
    if (task.status === 'completed') statusColor = 'border-emerald-400';
    else if (task.status === 'progress') statusColor = 'border-blue-400';

    html += `
      <div class="bg-white/80 hover:bg-white p-4 rounded-xl border border-slate-100 shadow-sm transition-all border-l-4 ${statusColor} flex flex-col md:flex-row md:items-center justify-between gap-4 ml-1 md:ml-4 group">
        <div>
          <div class="flex items-center gap-2 mb-1.5">
            <span class="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              ${timeStr}
            </span>
            <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">REQ-#${task.request_id || task.id}</span>
          </div>
          <h5 class="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors cursor-pointer" onclick="typeof openRequestModal === 'function' ? openRequestModal(${task.request_id || task.id}) : null">${task.title}</h5>
          <p class="text-sm text-slate-500 mt-1 flex items-center gap-1">
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            ${task.location || 'ไม่ระบุสถานที่'}
          </p>
        </div>
        
        <div class="flex items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-0 border-slate-100">
          <div class="text-left md:text-right">
            <p class="text-[11px] font-medium text-slate-400 uppercase tracking-wider">ช่างผู้รับผิดชอบ</p>
            <p class="text-sm font-semibold text-slate-700">${task.technician_name || 'ยังไม่มอบหมาย'}</p>
          </div>
          <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 text-sm font-bold border-2 border-white shadow-sm">
            ${task.technician_name ? task.technician_name.charAt(0).toUpperCase() : '?'}
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
}

// ----------------------------------------------------
// Mock Data Generator (ลบออกได้เมื่อต่อ API จริง)
// ----------------------------------------------------
function generateMockSchedule(dateObj) {
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  return [
    { id: '101', request_id: '1023', title: 'ซ่อมแอร์ห้องประชุม A', location: 'อาคาร 1 ชั้น 2', date: new Date(year, month, 5).toISOString(), time: '09:00 น.', status: 'completed', technician_name: 'สมชาย' },
    { id: '102', request_id: '1045', title: 'ตรวจเช็คระบบเครือข่าย', location: 'ตึก IT ห้อง Server', date: new Date(year, month, 12).toISOString(), time: '13:30 น.', status: 'progress', technician_name: 'วิชัย' },
    { id: '103', request_id: '1050', title: 'เปลี่ยนหลอดไฟทางเดิน', location: 'อาคาร 2 ชั้น 1', date: new Date(year, month, 12).toISOString(), time: '15:00 น.', status: 'pending', technician_name: 'สมชาย' },
    { id: '104', request_id: '1062', title: 'ซ่อมโปรเจคเตอร์', location: 'ห้องเรียน 304', date: new Date(year, month, 20).toISOString(), time: '10:00 น.', status: 'pending', technician_name: 'นุกูล' },
    { id: '105', request_id: '1070', title: 'บำรุงรักษาลิฟต์โดยสาร', location: 'อาคารเฉลิมพระเกียรติ', date: new Date(year, month, 28).toISOString(), time: '08:30 น.', status: 'pending', technician_name: '' }
  ];
}