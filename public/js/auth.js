/* ═══════════════════════════════════════
   AUTH MODULE (Minimal Glassmorphism)
   No Emojis, SVG Icons only
═══════════════════════════════════════ */
function showAuth() {
  document.getElementById('root').innerHTML = `
  <div class="w-full glass-pane overflow-hidden flex flex-col md:flex-row shadow-2xl rounded-3xl fade-in border border-slate-200/60 max-w-5xl mx-auto mt-8 md:mt-16">
    
    <div class="hidden md:flex flex-col justify-center w-1/2 p-12 bg-gradient-to-br from-indigo-50/80 to-slate-100/80 border-r border-slate-200/50 relative">
      <div class="relative z-10">
        <div class="mb-6 text-indigo-600 bg-white shadow-sm w-16 h-16 rounded-2xl flex items-center justify-center border border-indigo-100">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
        
        <h1 class="text-4xl font-bold text-slate-800 mb-2 tracking-tight">ระบบแจ้งซ่อม</h1>
        <p class="text-slate-500 mb-10 font-medium text-lg leading-snug">iMaintain System<br>จัดการงานซ่อมบำรุงอย่างมีระบบและมีประสิทธิภาพ</p>
        
        <div class="space-y-6 text-slate-600 font-medium text-sm">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-200 text-indigo-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            </div> 
            ติดตามสถานะงานซ่อมแบบ Real-time
          </div>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-200 text-indigo-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div> 
            มอบหมายช่าง จัดลำดับความสำคัญ
          </div>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-200 text-indigo-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            </div> 
            บริหารคลังวัสดุอุปกรณ์ (Low-stock)
          </div>
        </div>
      </div>
    </div>

    <div class="w-full md:w-1/2 p-8 md:p-14 relative flex flex-col justify-center bg-white/60 backdrop-blur-md">
      
      <div class="mb-8">
        <h2 id="auth-title" class="text-3xl font-bold text-slate-800 tracking-tight">เข้าสู่ระบบ</h2>
        <p class="text-slate-500 mt-2 font-medium text-sm">กรุณากรอกข้อมูลเพื่อเข้าใช้งานระบบ</p>
      </div>

      <div id="auth-alert" class="mb-6 empty:hidden"></div>

      <div id="f-login">
        <div class="space-y-5">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">อีเมล</label>
            <input type="email" id="l-email" class="input-glass py-2.5" placeholder="your@email.com" onkeydown="if(event.key==='Enter') doLogin()">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">รหัสผ่าน</label>
            <input type="password" id="l-pass" class="input-glass py-2.5" placeholder="••••••••" onkeydown="if(event.key==='Enter') doLogin()">
          </div>
          <button onclick="doLogin()" class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm transition-all active:scale-[0.98] mt-2">
            เข้าสู่ระบบ
          </button>
        </div>
        <div class="mt-8 text-center text-slate-500 text-sm font-medium border-t border-slate-200/60 pt-6">
          ยังไม่มีบัญชีใช่หรือไม่? 
          <button onclick="switchAuth('register')" class="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors ml-1 hover:underline">สร้างบัญชีใหม่</button>
        </div>
      </div>

      <div id="f-register" style="display:none;">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">ชื่อ - นามสกุล <span class="text-red-500">*</span></label>
            <input type="text" id="r-name" class="input-glass" placeholder="ระบุชื่อจริง">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">อีเมล <span class="text-red-500">*</span></label>
            <input type="email" id="r-email" class="input-glass" placeholder="ใช้สำหรับเข้าสู่ระบบ">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">รหัสผ่าน <span class="text-red-500">*</span></label>
            <input type="password" id="r-pass" class="input-glass" placeholder="อย่างน้อย 6 ตัวอักษร">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">รหัส นศ./พนักงาน</label>
              <input type="text" id="r-sid" class="input-glass" placeholder="(ถ้ามี)">
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">สาขา/แผนก</label>
              <input type="text" id="r-dept" class="input-glass" placeholder="(ถ้ามี)">
            </div>
          </div>
          <button onclick="doRegister()" class="w-full py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl shadow-sm transition-all active:scale-[0.98] mt-2">
            ลงทะเบียน
          </button>
        </div>
        <div class="mt-8 text-center text-slate-500 text-sm font-medium border-t border-slate-200/60 pt-6">
          มีบัญชีอยู่แล้ว? 
          <button onclick="switchAuth('login')" class="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors ml-1 hover:underline">กลับไปเข้าสู่ระบบ</button>
        </div>
      </div>

    </div>
  </div>`;
}

// =========================================================
// Logic (Original 100% with Minimal Alerts)
// =========================================================

function switchAuth(type) {
  const l = document.getElementById('f-login'), r = document.getElementById('f-register'), t = document.getElementById('auth-title');
  const alertBox = document.getElementById('auth-alert');
  alertBox.innerHTML = ''; // เคลียร์แจ้งเตือนเมื่อสลับหน้า
  
  if(type === 'register') { 
    l.style.display = 'none'; 
    r.style.display = 'block'; 
    t.innerText = 'สร้างบัญชีใหม่'; 
  } else { 
    l.style.display = 'block'; 
    r.style.display = 'none'; 
    t.innerText = 'เข้าสู่ระบบ'; 
  }
}

// ฟังก์ชันสำหรับสร้าง HTML ของ Alert แบบมีไอคอน SVG (Minimal)
function createAlert(type, message) {
  const styles = {
    warn: 'text-amber-800 bg-amber-50 border-amber-200',
    info: 'text-blue-800 bg-blue-50 border-blue-200',
    success: 'text-emerald-800 bg-emerald-50 border-emerald-200',
    error: 'text-rose-800 bg-rose-50 border-rose-200'
  };
  
  const icons = {
    warn: `<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`,
    info: `<svg class="w-5 h-5 shrink-0 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>`,
    success: `<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`,
    error: `<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
  };

  return `<div class="flex items-center gap-3 p-3 text-sm font-medium rounded-xl border ${styles[type]}">
            ${icons[type]} <span>${message}</span>
          </div>`;
}

async function doLogin() {
  const email = document.getElementById('l-email').value.trim().toLowerCase();
  const pass = document.getElementById('l-pass').value;
  const alert = document.getElementById('auth-alert');
  
  if(!email || !pass) { 
    alert.innerHTML = createAlert('warn', 'กรุณากรอกอีเมลและรหัสผ่าน'); 
    return; 
  }
  
  try {
    alert.innerHTML = createAlert('info', 'กำลังเข้าสู่ระบบ...');
    const data = await apiFetch('/auth/login', { method:'POST', body:JSON.stringify({email, password:pass}) });
    localStorage.setItem('APP_TOKEN', data.token);
    APP.user = data.user;
    saveApp();
    window.location.href = `${data.user.role}.html`;
  } catch(e) {
    alert.innerHTML = createAlert('error', e.message);
  }
}

async function doRegister() {
  const name = document.getElementById('r-name').value.trim();
  const email = document.getElementById('r-email').value.trim().toLowerCase();
  const pass = document.getElementById('r-pass').value;
  const el = document.getElementById('auth-alert');
  
  if(!name || !email || !pass) {
    el.innerHTML = createAlert('warn', 'กรุณากรอกข้อมูลที่จำเป็น');
    return;
  }
  if(pass.length < 6) {
    el.innerHTML = createAlert('warn', 'รหัสผ่านต้องมีอย่างน้อย 6 ตัว');
    return;
  }
  
  try {
    el.innerHTML = createAlert('info', 'กำลังสร้างบัญชี...');
    const res = await apiFetch('/auth/register', { method:'POST', body:JSON.stringify({
      name, email, password:pass, student_id:document.getElementById('r-sid').value || null, department:document.getElementById('r-dept').value || null
    })});
    
    el.innerHTML = createAlert('success', res.message);
    setTimeout(() => switchAuth('login'), 2000);
  } catch(e) {
    el.innerHTML = createAlert('error', e.message);
  }
}