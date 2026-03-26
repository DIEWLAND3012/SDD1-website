/* =========================================
   SYSTEM SETTINGS MODULE
   Minimal UI & SVG Icons (Admin Only)
========================================= */

let usersDataList = [];

function pageSettings() {
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

  // หน้าจอสำหรับ Admin
  content.innerHTML = `
    <div class="fade-in space-y-6">
      
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          ตั้งค่าระบบ (Admin)
        </h2>
        <p class="text-slate-500 text-sm mt-1">จัดการพารามิเตอร์ของระบบและสิทธิ์ผู้ใช้งาน</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="col-span-1 space-y-6">
          <div class="glass-panel p-6 rounded-2xl border border-slate-200/60 shadow-sm">
            <h3 class="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
              <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              ข้อมูลระบบ
            </h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">ชื่อระบบ (App Name)</label>
                <input type="text" id="sys-name" class="input-glass" value="ระบบแจ้งซ่อมบำรุง">
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">LINE Notify Token</label>
                <input type="password" id="sys-line" class="input-glass" placeholder="ใส่ Token สำหรับแจ้งเตือนผ่านไลน์">
              </div>
              <div class="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                <div>
                  <p class="text-sm font-semibold text-slate-700">อนุญาตให้สมัครสมาชิก</p>
                  <p class="text-xs text-slate-500">เปิดให้บุคคลภายนอกลงทะเบียนได้</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="sys-register" class="sr-only peer" checked>
                  <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              
              <div class="pt-3">
                <button onclick="saveSystemSettings()" id="btn-save-sys" class="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  บันทึกการตั้งค่า
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-span-1 lg:col-span-2 space-y-6">
          <div class="glass-panel p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col h-full">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                จัดการสิทธิ์ผู้ใช้งาน
              </h3>
              <div class="relative w-full sm:w-64">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input type="text" id="search-users" placeholder="ค้นหาชื่อ, อีเมล..." class="input-glass pl-9 py-2 text-sm" onkeyup="filterUsers()">
              </div>
            </div>
            
            <div class="flex-grow overflow-x-auto rounded-xl border border-slate-200/50">
              <div id="users-table-container">
                <div class="p-8 flex flex-col items-center justify-center text-slate-400">
                  <svg class="w-8 h-8 animate-spin mb-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                  <p class="text-sm font-medium">กำลังโหลดข้อมูลผู้ใช้งาน...</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  fetchUsersList();
}

async function fetchUsersList() {
  try {
    // สมมติว่าดึงข้อมูลผู้ใช้ทั้งหมดจาก API (เฉพาะ Admin ถึงเรียกได้)
    const data = await apiFetch('/users');
    usersDataList = Array.isArray(data) ? data : (data.users || []);
    
    // ถ้า API ยังไม่มีข้อมูล ให้ใช้ Mock Data ก่อน
    if (usersDataList.length === 0) {
      usersDataList = [
        { id: 1, name: 'สมชาย รักดี', email: 'somchai@example.com', role: 'admin' },
        { id: 2, name: 'วิชัย ช่างไฟ', email: 'wichai@example.com', role: 'technician' },
        { id: 3, name: 'มานี สีสด', email: 'manee@example.com', role: 'user' },
        { id: 4, name: 'นุกูล แอร์เย็น', email: 'nukul@example.com', role: 'technician' }
      ];
    }
    
    renderUsersTable(usersDataList);
  } catch (error) {
    document.getElementById('users-table-container').innerHTML = `
      <div class="p-6 text-center text-rose-500">โหลดข้อมูลไม่สำเร็จ: ${error.message}</div>
    `;
  }
}

function renderUsersTable(users) {
  const container = document.getElementById('users-table-container');
  
  if (users.length === 0) {
    container.innerHTML = `<div class="p-8 text-center text-slate-500 text-sm">ไม่พบข้อมูลผู้ใช้งาน</div>`;
    return;
  }

  let html = `
    <table class="w-full text-left border-collapse whitespace-nowrap">
      <thead>
        <tr class="bg-slate-50/80 text-xs text-slate-500 uppercase tracking-wider">
          <th class="p-3 font-semibold">ผู้ใช้งาน</th>
          <th class="p-3 font-semibold">สิทธิ์ปัจจุบัน</th>
          <th class="p-3 font-semibold text-right">เปลี่ยนสิทธิ์</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
  `;

  users.forEach(u => {
    // แปลง Role เป็นภาษาไทยพร้อมสี
    let roleBadge = '';
    if (u.role === 'admin') roleBadge = '<span class="px-2 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-md">Admin</span>';
    else if (u.role === 'technician') roleBadge = '<span class="px-2 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-md">ช่างซ่อม</span>';
    else roleBadge = '<span class="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md">ทั่วไป</span>';

    // ป้องกันไม่ให้แอดมินเปลี่ยนสิทธิ์ตัวเองผ่านหน้านี้ (กันเหนียว)
    const isSelf = window.APP?.user?.email === u.email;
    const selectDisabled = isSelf ? 'disabled' : '';
    
    html += `
      <tr class="hover:bg-white/60 transition-colors">
        <td class="p-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
              ${u.name ? u.name.charAt(0) : 'U'}
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-800">${u.name}</p>
              <p class="text-xs text-slate-500">${u.email}</p>
            </div>
          </div>
        </td>
        <td class="p-3">${roleBadge}</td>
        <td class="p-3 text-right">
          <select 
            onchange="updateUserRole(${u.id}, this.value)" 
            class="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 outline-none focus:border-indigo-500 disabled:opacity-50 disabled:bg-slate-50"
            ${selectDisabled}
          >
            <option value="user" ${u.role === 'user' ? 'selected' : ''}>ผู้ใช้ทั่วไป</option>
            <option value="technician" ${u.role === 'technician' ? 'selected' : ''}>ช่างซ่อมบำรุง</option>
            <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>ผู้ดูแลระบบ (Admin)</option>
          </select>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

function filterUsers() {
  const query = document.getElementById('search-users').value.toLowerCase();
  const filtered = usersDataList.filter(u => 
    u.name.toLowerCase().includes(query) || 
    u.email.toLowerCase().includes(query)
  );
  renderUsersTable(filtered);
}

// จำลองการเซฟตั้งค่าระบบ
async function saveSystemSettings() {
  const btn = document.getElementById('btn-save-sys');
  const originalHtml = btn.innerHTML;
  
  btn.innerHTML = `<svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> กำลังบันทึก...`;
  btn.disabled = true;

  try {
    // สมมติยิง API อัปเดตการตั้งค่า
    // const payload = { name: document.getElementById('sys-name').value, ... }
    // await apiFetch('/settings', { method: 'PUT', body: JSON.stringify(payload) });
    
    setTimeout(() => {
      alert('บันทึกการตั้งค่าระบบเรียบร้อยแล้ว');
      btn.innerHTML = originalHtml;
      btn.disabled = false;
    }, 800); // ดีเลย์จำลองการโหลด

  } catch (error) {
    alert('เกิดข้อผิดพลาด: ' + error.message);
    btn.innerHTML = originalHtml;
    btn.disabled = false;
  }
}

// เปลี่ยนสิทธิ์ผู้ใช้งาน
async function updateUserRole(userId, newRole) {
  try {
    // สมมติยิง API เพื่อเปลี่ยน Role
    // await apiFetch(`/users/${userId}/role`, { method: 'PUT', body: JSON.stringify({ role: newRole }) });
    
    // อัปเดตข้อมูลใน UI
    const userIndex = usersDataList.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      usersDataList[userIndex].role = newRole;
      filterUsers(); // รีเฟรชตาราง
    }
    
    // สร้าง Toast notification เล็กๆ (ถ้ามีระบบ Toast)
    console.log(`Updated user ${userId} to role ${newRole}`);
    
  } catch (error) {
    alert('ไม่สามารถเปลี่ยนสิทธิ์ได้: ' + error.message);
    fetchUsersList(); // โหลดข้อมูลเดิมกลับมาถ้าพัง
  }
}