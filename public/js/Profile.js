/* =========================================
   USER PROFILE MODULE
   Minimal UI & SVG Icons
========================================= */

function pageProfile() {
  const content = document.getElementById('page-content');
  const user = window.APP && window.APP.user ? window.APP.user : {};

  // แปลง Role เป็นภาษาไทยให้ดูสวยงาม
  const roleDisplay = {
    'admin': 'ผู้ดูแลระบบ (Admin)',
    'manager': 'ผู้จัดการ (Manager)',
    'technician': 'ช่างซ่อมบำรุง (Technician)',
    'user': 'ผู้ใช้งานทั่วไป (User)'
  };
  const currentRole = roleDisplay[user.role] || user.role || 'ไม่ระบุสถานะ';

  content.innerHTML = `
    <div class="fade-in max-w-4xl mx-auto space-y-6">
      
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          โปรไฟล์ส่วนตัว
        </h2>
        <p class="text-slate-500 text-sm mt-1">จัดการข้อมูลส่วนตัวและรหัสผ่านของคุณ</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div class="col-span-1 space-y-6">
          <div class="glass-panel p-6 rounded-2xl flex flex-col items-center text-center border border-slate-200/60 shadow-sm">
            <div class="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center text-3xl font-bold shadow-md border-4 border-white mb-4">
              ${user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h3 class="text-lg font-bold text-slate-800">${user.name || 'ไม่ระบุชื่อ'}</h3>
            <p class="text-sm font-medium text-indigo-600 mt-1">${currentRole}</p>
            <div class="mt-4 w-full pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-sm text-slate-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              ${user.email || 'ไม่ระบุอีเมล'}
            </div>
          </div>
        </div>

        <div class="col-span-1 md:col-span-2 space-y-6">
          
          <div class="glass-panel p-6 md:p-8 rounded-2xl border border-slate-200/60 shadow-sm">
            <h3 class="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
              <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
              ข้อมูลพื้นฐาน
            </h3>
            <div id="profile-alert" class="mb-4 empty:hidden"></div>
            
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">ชื่อ - นามสกุล</label>
                  <input type="text" id="p-name" class="input-glass" value="${user.name || ''}">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">อีเมล (ไม่สามารถเปลี่ยนได้)</label>
                  <input type="email" class="input-glass bg-slate-100 text-slate-500 cursor-not-allowed" value="${user.email || ''}" disabled>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">รหัส นศ./พนักงาน</label>
                  <input type="text" id="p-sid" class="input-glass" value="${user.student_id || ''}">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">สาขา/แผนก</label>
                  <input type="text" id="p-dept" class="input-glass" value="${user.department || ''}">
                </div>
              </div>
              <div class="pt-2 flex justify-end">
                <button onclick="updateProfile()" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  บันทึกข้อมูลส่วนตัว
                </button>
              </div>
            </div>
          </div>

          <div class="glass-panel p-6 md:p-8 rounded-2xl border border-slate-200/60 shadow-sm">
            <h3 class="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
              <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              เปลี่ยนรหัสผ่าน
            </h3>
            <div id="password-alert" class="mb-4 empty:hidden"></div>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">รหัสผ่านปัจจุบัน</label>
                <input type="password" id="pw-old" class="input-glass" placeholder="••••••••">
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">รหัสผ่านใหม่</label>
                  <input type="password" id="pw-new" class="input-glass" placeholder="อย่างน้อย 6 ตัวอักษร">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">ยืนยันรหัสผ่านใหม่</label>
                  <input type="password" id="pw-confirm" class="input-glass" placeholder="กรอกรหัสผ่านใหม่อีกครั้ง">
                </div>
              </div>
              <div class="pt-2 flex justify-end">
                <button onclick="changePassword()" class="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                  เปลี่ยนรหัสผ่าน
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;
}

// ==========================================
// LOGIC FUNCTIONS
// ==========================================

// ฟังก์ชันสร้าง Alert แบบ Minimal (นำมาจาก auth.js เพื่อให้โทนเดียวกัน)
function createProfileAlert(type, message) {
  const styles = {
    success: 'text-emerald-800 bg-emerald-50 border-emerald-200',
    error: 'text-rose-800 bg-rose-50 border-rose-200',
    warn: 'text-amber-800 bg-amber-50 border-amber-200'
  };
  return `<div class="flex items-center gap-3 p-3 text-sm font-medium rounded-xl border ${styles[type]}">
            <span>${message}</span>
          </div>`;
}

// อัปเดตข้อมูลส่วนตัว
async function updateProfile() {
  const alertBox = document.getElementById('profile-alert');
  const payload = {
    name: document.getElementById('p-name').value.trim(),
    student_id: document.getElementById('p-sid').value.trim(),
    department: document.getElementById('p-dept').value.trim()
  };

  if (!payload.name) {
    alertBox.innerHTML = createProfileAlert('warn', 'กรุณากรอกชื่อ-นามสกุล');
    return;
  }

  try {
    // สมมติว่า Endpoint สำหรับอัปเดตโปรไฟล์คือ PUT /users/me
    const res = await apiFetch('/users/me', {
      method: 'PUT',
      body: JSON.stringify(payload)
    });

    // อัปเดตข้อมูลในระบบ Global
    window.APP.user.name = payload.name;
    window.APP.user.student_id = payload.student_id;
    window.APP.user.department = payload.department;
    saveApp(); // บันทึกลง LocalStorage

    alertBox.innerHTML = createProfileAlert('success', 'บันทึกข้อมูลเรียบร้อยแล้ว');
    
    // รีเฟรชหน้าเพื่อให้รูปโปรไฟล์และชื่อด้านซ้ายอัปเดตตาม
    setTimeout(() => pageProfile(), 1500);

  } catch (error) {
    alertBox.innerHTML = createProfileAlert('error', `เกิดข้อผิดพลาด: ${error.message}`);
  }
}

// เปลี่ยนรหัสผ่าน
async function changePassword() {
  const alertBox = document.getElementById('password-alert');
  const oldPw = document.getElementById('pw-old').value;
  const newPw = document.getElementById('pw-new').value;
  const confPw = document.getElementById('pw-confirm').value;

  if (!oldPw || !newPw || !confPw) {
    alertBox.innerHTML = createProfileAlert('warn', 'กรุณากรอกข้อมูลให้ครบถ้วน');
    return;
  }
  if (newPw.length < 6) {
    alertBox.innerHTML = createProfileAlert('warn', 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร');
    return;
  }
  if (newPw !== confPw) {
    alertBox.innerHTML = createProfileAlert('warn', 'รหัสผ่านใหม่และการยืนยันไม่ตรงกัน');
    return;
  }

  try {
    // สมมติว่า Endpoint สำหรับเปลี่ยนรหัสผ่านคือ PUT /users/password
    await apiFetch('/users/password', {
      method: 'PUT',
      body: JSON.stringify({ old_password: oldPw, new_password: newPw })
    });

    alertBox.innerHTML = createProfileAlert('success', 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว');
    
    // ล้างช่องกรอกรหัสผ่าน
    document.getElementById('pw-old').value = '';
    document.getElementById('pw-new').value = '';
    document.getElementById('pw-confirm').value = '';

  } catch (error) {
    alertBox.innerHTML = createProfileAlert('error', `เปลี่ยนรหัสผ่านไม่สำเร็จ: ${error.message}`);
  }
}