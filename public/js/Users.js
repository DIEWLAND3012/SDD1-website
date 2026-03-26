/* =========================================
   USER MANAGEMENT MODULE (CRUD)
   Minimal UI & SVG Icons (Admin Only)
========================================= */

let usersDetailedData = [];

function pageUsers() {
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
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            จัดการผู้ใช้งานในระบบ
          </h2>
          <p class="text-slate-500 text-sm mt-1">เพิ่ม แก้ไข ลบ และจัดการข้อมูลส่วนตัวของผู้ใช้งานทั้งหมด</p>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="relative hidden md:block">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input type="text" id="search-users-detail" placeholder="ค้นหาชื่อ, แผนก, อีเมล..." class="input-glass pl-9 py-2 w-56" onkeyup="filterUsersDetail()">
          </div>
          
          <select id="filter-role-detail" onchange="filterUsersDetail()" class="input-glass py-2 hidden md:block">
            <option value="all">ทุกสิทธิ์</option>
            <option value="admin">Admin</option>
            <option value="technician">Technician</option>
            <option value="user">User</option>
          </select>
          
          <button onclick="openUserModal()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            เพิ่มผู้ใช้ใหม่
          </button>
        </div>
      </div>

      <div class="glass-panel rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm">
        <div class="overflow-x-auto" id="users-detail-table-container">
          <div class="p-12 flex flex-col items-center justify-center text-slate-400">
            <svg class="w-8 h-8 animate-spin mb-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            <p class="text-sm font-medium">กำลังโหลดข้อมูลบัญชีผู้ใช้...</p>
          </div>
        </div>
      </div>
    </div>

    <div id="user-detail-modal" class="fixed inset-0 z-50 hidden bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 opacity-0 transition-opacity duration-300">
      <div class="glass-pane w-full max-w-lg rounded-2xl shadow-2xl border border-white/80 overflow-hidden transform scale-95 transition-transform duration-300 flex flex-col" id="user-detail-modal-panel">
        
        <div class="p-5 border-b border-slate-200/60 flex justify-between items-center bg-white/40">
          <h3 id="user-modal-title" class="text-lg font-bold text-slate-800 flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
            เพิ่มผู้ใช้งานใหม่
          </h3>
          <button onclick="closeUserModal()" class="text-slate-400 hover:text-rose-500 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div class="p-5 overflow-y-auto space-y-4">
          <input type="hidden" id="u-form-id">
          
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">ชื่อ-นามสกุล <span class="text-rose-500">*</span></label>
              <input type="text" id="u-form-name" class="input-glass" placeholder="เช่น สมชาย รักดี">
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">อีเมล <span class="text-rose-500">*</span></label>
              <input type="email" id="u-form-email" class="input-glass" placeholder="example@company.com">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">แผนก/ฝ่าย</label>
                <input type="text" id="u-form-dept" class="input-glass" placeholder="เช่น IT, HR, ทั่วไป">
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">เบอร์ติดต่อ</label>
                <input type="text" id="u-form-phone" class="input-glass" placeholder="08x-xxx-xxxx">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">สิทธิ์การใช้งาน (Role)</label>
                <select id="u-form-role" class="input-glass bg-indigo-50/50">
                  <option value="user">User (ผู้ใช้งานทั่วไป)</option>
                  <option value="technician">Technician (ช่างซ่อม)</option>
                  <option value="admin">Admin (ผู้ดูแลระบบ)</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">สถานะบัญชี</label>
                <select id="u-form-status" class="input-glass">
                  <option value="active">ปกติ (Active)</option>
                  <option value="inactive">ระงับการใช้งาน (Inactive)</option>
                </select>
              </div>
            </div>
          </div>
          
          <div id="u-form-password-hint" class="text-xs text-slate-500 mt-2 p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2">
            <svg class="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>รหัสผ่านเริ่มต้นสำหรับผู้ใช้ใหม่คือ <strong>password123</strong> ผู้ใช้สามารถเปลี่ยนได้ในภายหลัง</span>
          </div>

        </div>

        <div class="p-4 border-t border-slate-200/60 bg-slate-50/50 flex justify-end gap-3">
          <button onclick="closeUserModal()" class="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-200/50 transition-colors">ยกเลิก</button>
          <button onclick="saveUserDetail()" id="u-save-btn" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center gap-2">
            บันทึกข้อมูล
          </button>
        </div>
      </div>
    </div>
  `;

  fetchUsersDetailed();
}

async function fetchUsersDetailed() {
  try {
    const data = await apiFetch('/users');
    usersDetailedData = Array.isArray(data) ? data : (data.users || []);

    if (usersDetailedData.length === 0) {
      usersDetailedData = generateMockDetailedUsers();
    }

    renderUsersDetailedTable(usersDetailedData);
  } catch (error) {
    document.getElementById('users-detail-table-container').innerHTML = `
      <div class="p-8 text-center text-rose-600 flex flex-col items-center">
        <svg class="w-10 h-10 mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <p class="font-medium">ไม่สามารถโหลดข้อมูลผู้ใช้งานได้: ${error.message}</p>
      </div>`;
  }
}

function renderUsersDetailedTable(users) {
  const container = document.getElementById('users-detail-table-container');

  if (!users || users.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center text-slate-500 flex flex-col items-center">
        <svg class="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        <p class="font-medium">ไม่พบข้อมูลผู้ใช้งาน</p>
      </div>`;
    return;
  }

  let html = `
    <table class="w-full text-left border-collapse whitespace-nowrap">
      <thead>
        <tr class="border-b border-slate-200/80 bg-slate-50/50 text-xs text-slate-500 uppercase tracking-wider">
          <th class="p-4 font-semibold">ข้อมูลผู้ใช้</th>
          <th class="p-4 font-semibold">สิทธิ์ (Role)</th>
          <th class="p-4 font-semibold">แผนก / เบอร์โทร</th>
          <th class="p-4 font-semibold">สถานะ</th>
          <th class="p-4 font-semibold text-right">จัดการ</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
  `;

  users.forEach(u => {
    let roleBadge = '';
    if (u.role === 'admin') roleBadge = '<span class="px-2.5 py-1 bg-rose-50 text-rose-600 text-[11px] font-bold uppercase rounded-md">Admin</span>';
    else if (u.role === 'technician') roleBadge = '<span class="px-2.5 py-1 bg-amber-50 text-amber-600 text-[11px] font-bold uppercase rounded-md">Technician</span>';
    else roleBadge = '<span class="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold uppercase rounded-md">User</span>';

    let statusBadge = u.status === 'inactive' 
      ? '<span class="flex items-center gap-1.5 text-xs font-medium text-slate-400"><span class="w-2 h-2 rounded-full bg-slate-300"></span> Inactive</span>'
      : '<span class="flex items-center gap-1.5 text-xs font-medium text-emerald-600"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Active</span>';

    // เช็คว่าถ้าเป็นตัวเอง ห้ามลบ
    const isSelf = window.APP?.user?.email === u.email;

    html += `
      <tr class="hover:bg-slate-50/50 transition-colors">
        <td class="p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
              ${u.name ? u.name.charAt(0) : 'U'}
            </div>
            <div>
              <p class="text-sm font-bold text-slate-800">${u.name}</p>
              <p class="text-xs text-slate-500 mt-0.5">${u.email}</p>
            </div>
          </div>
        </td>
        <td class="p-4">${roleBadge}</td>
        <td class="p-4">
          <p class="text-sm text-slate-700 font-medium">${u.department || '-'}</p>
          <p class="text-xs text-slate-500 mt-0.5">${u.phone || 'ไม่มีเบอร์ติดต่อ'}</p>
        </td>
        <td class="p-4">${statusBadge}</td>
        <td class="p-4 text-right space-x-1">
          <button onclick="openUserModal(${u.id})" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center justify-center" title="แก้ไขข้อมูล">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
          </button>
          ${!isSelf ? `
            <button onclick="deleteUser(${u.id})" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors inline-flex items-center justify-center" title="ลบผู้ใช้">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          ` : `<span class="w-7 inline-block"></span>`}
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

function filterUsersDetail() {
  const searchQuery = document.getElementById('search-users-detail').value.toLowerCase();
  const roleQuery = document.getElementById('filter-role-detail').value;

  const filtered = usersDetailedData.filter(u => {
    const matchesSearch = 
      (u.name || '').toLowerCase().includes(searchQuery) || 
      (u.email || '').toLowerCase().includes(searchQuery) ||
      (u.department || '').toLowerCase().includes(searchQuery);
    
    const matchesRole = roleQuery === 'all' || u.role === roleQuery;

    return matchesSearch && matchesRole;
  });

  renderUsersDetailedTable(filtered);
}

// ==========================================
// MODAL & CRUD LOGIC
// ==========================================

function openUserModal(id = null) {
  const modal = document.getElementById('user-detail-modal');
  const panel = document.getElementById('user-detail-modal-panel');
  const hint = document.getElementById('u-form-password-hint');

  // เคลียร์ฟอร์ม
  document.getElementById('u-form-id').value = '';
  document.getElementById('u-form-name').value = '';
  document.getElementById('u-form-email').value = '';
  document.getElementById('u-form-dept').value = '';
  document.getElementById('u-form-phone').value = '';
  document.getElementById('u-form-role').value = 'user';
  document.getElementById('u-form-status').value = 'active';

  if (id) {
    // โหมดแก้ไข
    document.getElementById('user-modal-title').innerHTML = `
      <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
      แก้ไขข้อมูลผู้ใช้
    `;
    hint.classList.add('hidden'); // ซ่อนแจ้งเตือนรหัสผ่านตั้งต้น

    const user = usersDetailedData.find(u => u.id === id);
    if (user) {
      document.getElementById('u-form-id').value = user.id;
      document.getElementById('u-form-name').value = user.name || '';
      document.getElementById('u-form-email').value = user.email || '';
      document.getElementById('u-form-dept').value = user.department || '';
      document.getElementById('u-form-phone').value = user.phone || '';
      document.getElementById('u-form-role').value = user.role || 'user';
      document.getElementById('u-form-status').value = user.status || 'active';
    }
  } else {
    // โหมดสร้างใหม่
    document.getElementById('user-modal-title').innerHTML = `
      <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
      เพิ่มผู้ใช้งานใหม่
    `;
    hint.classList.remove('hidden');
  }

  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.remove('opacity-0');
    panel.classList.remove('scale-95');
  }, 10);
}

function closeUserModal() {
  const modal = document.getElementById('user-detail-modal');
  const panel = document.getElementById('user-detail-modal-panel');
  
  modal.classList.add('opacity-0');
  panel.classList.add('scale-95');
  setTimeout(() => modal.classList.add('hidden'), 300);
}

async function saveUserDetail() {
  const id = document.getElementById('u-form-id').value;
  const name = document.getElementById('u-form-name').value.trim();
  const email = document.getElementById('u-form-email').value.trim();
  const btn = document.getElementById('u-save-btn');
  const originalHtml = btn.innerHTML;

  if (!name || !email) {
    alert('กรุณากรอก ชื่อ-นามสกุล และ อีเมล ให้ครบถ้วน');
    return;
  }

  try {
    btn.disabled = true;
    btn.innerHTML = `<svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> กำลังบันทึก...`;

    const payload = {
      name: name,
      email: email,
      department: document.getElementById('u-form-dept').value.trim(),
      phone: document.getElementById('u-form-phone').value.trim(),
      role: document.getElementById('u-form-role').value,
      status: document.getElementById('u-form-status').value
    };

    if (id) {
      // แก้ไข (PUT)
      // await apiFetch(`/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      const index = usersDetailedData.findIndex(u => u.id == id);
      if (index !== -1) usersDetailedData[index] = { ...usersDetailedData[index], ...payload };
    } else {
      // สร้างใหม่ (POST)
      // await apiFetch('/users', { method: 'POST', body: JSON.stringify(payload) });
      payload.id = Math.floor(Math.random() * 1000) + 10; // Mock ID
      usersDetailedData.unshift(payload);
    }

    closeUserModal();
    filterUsersDetail(); // รีเฟรชตาราง

  } catch (error) {
    alert(`เกิดข้อผิดพลาด: ${error.message}`);
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalHtml;
  }
}

async function deleteUser(id) {
  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งานนี้? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
    try {
      // await apiFetch(`/users/${id}`, { method: 'DELETE' });
      usersDetailedData = usersDetailedData.filter(u => u.id != id);
      filterUsersDetail();
    } catch (error) {
      alert(`ลบข้อมูลไม่สำเร็จ: ${error.message}`);
    }
  }
}

// ----------------------------------------------------
// Mock Data Generator
// ----------------------------------------------------
function generateMockDetailedUsers() {
  return [
    { id: 1, name: 'สมชาย รักดี', email: 'somchai.admin@example.com', role: 'admin', department: 'IT Support', phone: '081-123-4567', status: 'active' },
    { id: 2, name: 'วิชัย ช่างไฟ', email: 'wichai.tech@example.com', role: 'technician', department: 'ซ่อมบำรุงอาคาร', phone: '089-987-6543', status: 'active' },
    { id: 3, name: 'มานี สีสด', email: 'manee.hr@example.com', role: 'user', department: 'Human Resources', phone: '082-222-3333', status: 'active' },
    { id: 4, name: 'นุกูล แอร์เย็น', email: 'nukul.air@example.com', role: 'technician', department: 'ระบบปรับอากาศ', phone: '085-555-4444', status: 'active' },
    { id: 5, name: 'อารี ใจดี', email: 'aree.old@example.com', role: 'user', department: 'การเงิน', phone: '081-000-0000', status: 'inactive' }
  ];
}